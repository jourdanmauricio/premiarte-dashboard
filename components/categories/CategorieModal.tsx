import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCategory, useCreateCategory } from "@/hooks/use-categories";

import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { DialogHeader } from "@/components/ui/dialog";
import type { Category } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CategoryFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { Checkbox } from "@/components/ui/checkbox";
import { SingleImageSelector } from "@/components/ui/custom/single-image-selector/SingleImageSelector";
import { TextareaField } from "@/components/ui/custom/textarea-field";

interface CategorieModalProps {
  open: boolean;
  closeModal: () => void;
  category: Category | null;
}

const defaultValues = {
  name: "",
  description: "",
  slug: "",
  imageId: 0,
  featured: false,
};

const CategorieModal = ({
  open,
  closeModal,
  category,
}: CategorieModalProps) => {
  const mode = category ? "EDIT" : "CREATE";

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues:
      mode === "EDIT" && category
        ? {
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageId: category.imageId,
            featured: category.featured,
          }
        : defaultValues,
  });

  const updateCategoryMutation = useUpdateCategory();
  const createCategoryMutation = useCreateCategory();

  const onSubmit = async (data: z.infer<typeof CategoryFormSchema>) => {
    if (mode === "CREATE") {
      await createCategoryMutation.mutateAsync(data);
      closeModal();
    } else {
      await updateCategoryMutation.mutateAsync({
        id: category?.id?.toString() || "",
        data,
      });
      closeModal();
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent
        className="max-h-[95%] max-w-2xl overflow-y-auto w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {mode === "CREATE" ? "Nueva categoría" : "Editar categoría"}
          </DialogTitle>
          <DialogDescription />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="mt-4 flex flex-col gap-6 w-full"
            >
              <InputField
                label="Nombre"
                name="name"
                placeholder="Nombre de la categoría"
                form={form}
                onChange={(e) => {
                  form.setValue("name", e.target.value, { shouldDirty: true });
                  form.setValue(
                    "slug",
                    e.target.value.toLowerCase().replace(/ /g, "-"),
                    { shouldDirty: true },
                  );
                }}
              />
              <InputField
                label="Slug"
                name="slug"
                placeholder="Slug"
                form={form}
              />
              <TextareaField
                label="Descripción"
                name="description"
                placeholder="Descripción"
                maxLength={350}
                inputClassname="h-[180px]"
                form={form}
              />

              <SingleImageSelector form={form} defaultTag="Categorías" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => {
                    form.setValue("featured", !!checked, { shouldDirty: true });
                  }}
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Destacada
                </label>
              </div>

              <div className="flex justify-end gap-8 pt-10">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  Cancelar
                </Button>
                <SubmitButton
                  text={mode === "CREATE" ? "Crear categoría" : "Guardar"}
                  className="min-w-[150px]"
                  isLoading={
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending
                  }
                  disabled={
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending ||
                    !form.formState.isDirty
                  }
                />
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { CategorieModal };
