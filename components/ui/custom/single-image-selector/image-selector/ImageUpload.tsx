import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateImage } from "@/hooks/use-media";
import { toast } from "sonner";
import type { Image } from "@/shared/types";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/custom/input-field";
import Dropdown from "@/components/ui/custom/dropdown";
import { ImageFormSchema } from "@/shared/schemas";
import { imageTagsList } from "@/shared/constanst";

interface ImageUploadProps {
  onUploadSuccess: (image: Image) => void;
  onStateChange?: (state: {
    canSubmit: boolean;
    isLoading: boolean;
    submit: () => void;
  }) => void;
  defaultTag?: string;
}

export const ImageUpload = ({
  onUploadSuccess,
  onStateChange,
  defaultTag = "Otros",
}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = {
    tag: defaultTag,
    alt: "",
    observation: "",
  };

  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues,
  });

  const createImageMutation = useCreateImage();

  const resetForm = () => {
    form.reset(defaultValues);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Notificar al padre sobre el estado
  useEffect(() => {
    if (onStateChange) {
      const canSubmit = Boolean(selectedFile && form.formState.isValid);
      const isLoading = createImageMutation.isPending;
      const submit = async () => {
        if (canSubmit && selectedFile) {
          const values = form.getValues();
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("alt", values.alt);
          if (values.tag) formData.append("tag", values.tag);
          if (values.observation) formData.append("observation", values.observation);

          const result = await createImageMutation.mutateAsync(formData);
          if (result?.data) {
            onUploadSuccess(result.data);
            resetForm();
          }
        }
      };
      onStateChange({ canSubmit, isLoading, submit });
    }
  }, [
    selectedFile,
    form.formState.isValid,
    createImageMutation.isPending,
    onStateChange,
  ]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-completar campos del formulario
    const fileName = file.name.split(".")[0];
    form.setValue("alt", fileName);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: z.infer<typeof ImageFormSchema>) => {
    if (!selectedFile) {
      toast.error("Selecciona una imagen");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("alt", data.alt);
    if (data.tag) formData.append("tag", data.tag);
    if (data.observation) formData.append("observation", data.observation);

    const result = await createImageMutation.mutateAsync(formData);
    if (result?.data) {
      onUploadSuccess(result.data);
      resetForm();
    }
  };

  const tagOptions = imageTagsList
    .filter((tag) => tag.id !== "Todas")
    .map((tag) => ({
      id: tag.id,
      description: tag.description,
    }));

  return (
    <div className="space-y-6">
      {/* Área de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${selectedFile ? "border-green-500 bg-green-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl("");
              }}
            >
              Cambiar imagen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: JPG, PNG, GIF, WebP
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleBrowseClick}>
              Seleccionar archivo
            </Button>
          </div>
        )}
      </div>

      {/* Formulario */}
      {selectedFile && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Nombre alternativo (ALT)"
              name="alt"
              placeholder="Descripción de la imagen"
              form={form}
            />

            <Dropdown
              list={tagOptions}
              label="Carpeta"
              name="tag"
              placeholder="Selecciona una carpeta"
              form={form}
            />

            <InputField
              label="Observaciones (opcional)"
              name="observation"
              placeholder="Notas adicionales sobre la imagen"
              form={form}
            />
          </form>
        </Form>
      )}
    </div>
  );
};
