import z from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Variant } from "@/shared/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { userFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { useCreateVariant, useUpdateVariant } from "@/hooks/use-variants";
import { variantFormSchema } from "@/shared/schemas";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ModalProps {
  open: boolean;
  closeModal: () => void;
  variant: Variant | null;
}

const defaultValues = {
  name: "",
  values: [],
};

const Modal = ({ open, closeModal, variant }: ModalProps) => {
  const mode = variant ? "EDIT" : "CREATE";

  const createVariantMutation = useCreateVariant();
  const updateVariantMutation = useUpdateVariant();

  const form = useForm<z.infer<typeof variantFormSchema>>({
    resolver: zodResolver(variantFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (variant) {
      form.reset({
        name: variant?.name || "",
        values:
          variant?.values.map((value) => ({
            id: value.id?.toString() || "",
            value: value.value,
          })) || [],
      });
    } else {
      form.reset(defaultValues);
    }
  }, [variant, form]);

  const onSubmit = async (values: z.infer<typeof variantFormSchema>) => {
    const data = {
      name: values.name,
      values: values.values.map((value) => ({
        value: value.value,
      })),
    };

    // Validar que los valores sean únicos
    const uniqueValues = new Set(
      data.values.map((value) => value.value.toLowerCase().trim()),
    );
    if (uniqueValues.size !== data.values.length) {
      toast.error("Los valores deben ser únicos");
      return;
    }

    if (mode === "CREATE") {
      await createVariantMutation.mutateAsync(data as unknown as Variant);
      closeModal();
    } else {
      await updateVariantMutation.mutateAsync({
        id: variant?.id?.toString() || "",
        data: data as unknown as Variant,
      });
      closeModal();
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof userFormSchema>>) => {
    console.log(errors);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="max-h-[95%] overflow-auto"
        style={{
          minWidth: "600px",
          maxWidth: "700px",
        }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div style={{ minWidth: "600px" }}>
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {mode === "CREATE"
                ? "Nuevo usuario"
                : `Modificar usuario ${form.watch("name")}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className="mt-4 flex flex-col gap-x-12 gap-y-8">
                  <InputField
                    label="Nombre"
                    name="name"
                    placeholder="Nombre del usuario"
                    form={form}
                  />

                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Valores</h3>
                    <Button
                      type="button"
                      onClick={() => {
                        // Si un valor es nulo o undefined, no se puede agregar
                        if (
                          form
                            .watch("values")
                            .some(
                              (value) =>
                                value.value === "" || value.value === undefined,
                            )
                        ) {
                          form.trigger("values");
                          return;
                        }

                        form.setValue("values", [
                          { value: "", id: undefined },
                          ...form.watch("values"),
                        ]);
                        form.setFocus("values.0.value");
                      }}
                    >
                      <PlusIcon className="size-5" />
                    </Button>
                  </div>

                  <ScrollArea
                    className="w-full shrink-0 rounded-md border"
                    style={{ height: 288 }}
                  >
                    {form.watch("values").map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center gap-2 mt-4"
                      >
                        <InputField
                          label=""
                          name={`values.${index}.value`}
                          placeholder="Valor"
                          form={form}
                          className="w-3/4"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-500 h-8 w-8 p-0 hover:text-red-300"
                          onClick={() => {
                            const values = form.watch("values");
                            values.splice(index, 1);
                            form.setValue("values", values, {
                              shouldDirty: true,
                            });
                          }}
                        >
                          <Trash2Icon className="size-5" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>

                  <div className="col-span-2 flex justify-end gap-8 pt-10">
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="outline"
                      className="min-w-[150px]"
                    >
                      Cancelar
                    </Button>
                    <SubmitButton
                      text={mode === "CREATE" ? "Crear usuario" : "Guardar"}
                      className="min-w-[150px]"
                      isLoading={form.formState.isSubmitting}
                      disabled={
                        form.formState.isSubmitting || !form.formState.isDirty
                      }
                    />
                  </div>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
