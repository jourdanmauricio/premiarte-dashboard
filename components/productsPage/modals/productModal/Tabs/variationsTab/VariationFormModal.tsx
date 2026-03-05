"use client";

import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Variation } from "@/shared/types";
import { toast } from "sonner";

import { VariationTypeValuesDropdown } from "@/components/ui/custom/dropdowns/VariationTypeValuesDropdown";
import { VariationTypeDropdown } from "@/components/ui/custom/dropdowns/VariationTypeDropdown";
import { SubmitButton } from "@/components/ui/custom/submit-button";

const variationModalSchema = z.object({
  variationType: z.string().min(1, "El tipo de variación es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  value: z.string().min(1, "El valor es requerido"),
});
type VariationFormValues = z.infer<typeof variationModalSchema>;

interface VariantFormModalProps {
  open: boolean;
  onClose: () => void;
  variation: Variation | null;
  editIndex: number | null;
  onSave: (variation: Variation, editIndex: number | null) => void;
}

const defaultValues: VariationFormValues = {
  variationType: "",
  name: "",
  value: "",
};

export function VariationFormModal({
  open,
  onClose,
  variation,
  editIndex,
  onSave,
}: VariantFormModalProps) {
  const isEdit = variation !== null && editIndex !== null;

  const form = useForm<VariationFormValues>({
    resolver: zodResolver(variationModalSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (variation) {
        form.reset({
          name: variation.name,
          value:
            variation.values?.find(
              (v) => v.id?.toString() === variation.id?.toString(),
            )?.value || "",
        });
      } else {
        form.reset({ ...defaultValues, value: "" });
      }
    }
  }, [open, variation, form]);

  const onSubmit = (values: VariationFormValues) => {
    const data: Variation = {
      id: variation?.id,
      name: values.name,
      values: [{ id: variation?.id, value: values.value }],
    };

    const uniqueValues = new Set(
      data.values.map((v) => v.value.toLowerCase().trim()),
    );
    if (uniqueValues.size !== data.values.length) {
      toast.error("Los valores deben ser únicos");
      return;
    }
    if (data.values.length === 0) {
      toast.error("Añade al menos un valor");
      return;
    }

    onSave(data, editIndex);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="max-h-[95%] overflow-auto"
        style={{ minWidth: "400px", maxWidth: "500px" }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar variación" : "Nueva variación"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <VariationTypeDropdown
              label="Tipo de variación"
              name="variationType"
              placeholder="Seleccione el tipo de variación"
              form={form}
            />
            <VariationTypeValuesDropdown
              label="Valor"
              name="value"
              placeholder="Seleccione el valor"
              form={form}
              variationType={form.watch("variationType")}
            />

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="min-w-[150px]"
              >
                Cancelar
              </Button>
              <SubmitButton
                text={isEdit ? "Guardar" : "Crear"}
                isLoading={form.formState.isSubmitting}
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
