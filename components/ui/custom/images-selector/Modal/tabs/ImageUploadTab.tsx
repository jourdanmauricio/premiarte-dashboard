import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateImage } from "@/hooks/use-media";
import { toast } from "sonner";
import type { Image as ImageType } from "@/shared/types";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/custom/input-field";
import Dropdown from "@/components/ui/custom/dropdown";
import { imageTagsList } from "@/shared/constanst";
import { ImageFormSchema } from "@/shared/schemas";
import Image from "next/image";

type FileWithPreview = { id: string; file: File; previewUrl: string };

interface ImageUploadTabProps {
  onUploadSuccess: (images: ImageType[]) => void;
  defaultTag: string;
}

function generateAltForFile(fileName: string, defaultTag: string): string {
  if (defaultTag === "Productos") return `product_${fileName}`;
  if (defaultTag === "Categorías") return `category_${fileName}`;
  return fileName.split(".")[0] ?? fileName;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
}

export function ImageUploadTab({
  onUploadSuccess,
  defaultTag,
}: ImageUploadTabProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = useMemo(
    () => ({
      alt: "",
      tag: defaultTag,
      observation: "",
    }),
    [defaultTag],
  );

  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues,
  });

  const createImageMutation = useCreateImage();

  // Mantener el form válido cuando hay archivos (alt se genera por archivo)
  useEffect(() => {
    if (selectedFiles.length > 0 && !form.getValues("alt")) {
      form.setValue(
        "alt",
        generateAltForFile(selectedFiles[0].file.name, defaultTag),
        { shouldValidate: true },
      );
    }
  }, [selectedFiles, defaultTag, form]);

  const addFiles = useCallback(async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    const invalid = files.length - images.length;
    if (invalid > 0) {
      toast.error("Solo se permiten archivos de imagen");
    }
    if (images.length === 0) return;

    const newItems: FileWithPreview[] = await Promise.all(
      images.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: await readFileAsDataUrl(file),
      })),
    );
    setSelectedFiles((prev) => [...prev, ...newItems]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetForm = useCallback(() => {
    form.reset(defaultValues);
    setSelectedFiles([]);
    setUploadProgress(null);
  }, [form, defaultValues]);

  const handleSubmit = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    const values = form.getValues();
    const created: ImageType[] = [];
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        setUploadProgress(i);
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("alt", generateAltForFile(item.file.name, defaultTag));
        if (values.tag) formData.append("tag", values.tag);
        if (values.observation)
          formData.append("observation", values.observation);

        const result = await createImageMutation.mutateAsync(formData);
        if (result?.data) created.push(result.data);
      }
      setUploadProgress(selectedFiles.length);
      if (created.length > 0) {
        onUploadSuccess(created);
        resetForm();
      }
    } catch {
      setUploadProgress(null);
    }
  }, [
    selectedFiles,
    form,
    createImageMutation,
    onUploadSuccess,
    resetForm,
    defaultTag,
  ]);

  const hasValidAlt =
    form.formState.isValid || (form.getValues("alt")?.length ?? 0) > 0;
  const canSubmit = selectedFiles.length > 0 && hasValidAlt;
  const isLoading = createImageMutation.isPending;
  const total = selectedFiles.length;
  const current = uploadProgress ?? 0;

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files?.length) {
      addFiles(Array.from(files));
    }
    event.target.value = "";
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
    const files = e.dataTransfer.files;
    if (files?.length) addFiles(Array.from(files));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${selectedFiles.length ? "border-green-500 bg-green-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar varias
            </p>
            <p className="text-sm text-gray-500">
              Formatos: JPG, PNG, GIF, WebP. Puedes elegir más de un archivo.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleBrowseClick}>
            Seleccionar archivos
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {selectedFiles.length} imagen
              {selectedFiles.length !== 1 ? "es" : ""} seleccionada
              {selectedFiles.length !== 1 ? "s" : ""}
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedFiles.map((item) => (
                <li
                  key={item.id}
                  className="relative rounded-lg overflow-hidden border bg-gray-50"
                >
                  <Image
                    src={item.previewUrl}
                    alt={item.file.name}
                    width={120}
                    height={120}
                    className="w-full h-24 object-contain"
                  />
                  <p className="text-xs text-gray-600 truncate px-2 py-1">
                    {item.file.name}
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removeFile(item.id)}
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <Form {...form}>
            <form className="space-y-4">
              <Dropdown
                list={imageTagsList}
                label="Carpeta (para todas)"
                name="tag"
                placeholder="Selecciona una carpeta"
                form={form}
              />

              <InputField
                label="Observaciones (opcional, para todas)"
                name="observation"
                placeholder="Notas adicionales"
                form={form}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                >
                  Limpiar lista
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                >
                  {isLoading
                    ? `Subiendo ${current + 1} de ${total}...`
                    : `Subir ${total} imagen${total !== 1 ? "es" : ""}`}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
