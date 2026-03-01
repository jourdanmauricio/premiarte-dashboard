import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Responsible } from "@/shared/types";
import { ResponsibleFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import {
  useCreateResponsible,
  useUpdateResponsible,
} from "@/hooks/use-responsibles";

interface ResponsibleModalProps {
  open: boolean;
  closeModal: () => void;
  responsible: Responsible | null;
}

type ResponsibleFormData = z.infer<typeof ResponsibleFormSchema>;

const defaultValues = {
  name: "",
  cuit: "",
  condition: "",
  observation: "",
};

const ResponsibleModal = ({
  open,
  closeModal,
  responsible,
}: ResponsibleModalProps) => {
  const mode = responsible ? "EDIT" : "CREATE";

  const createResponsibleMutation = useCreateResponsible();
  const updateResponsibleMutation = useUpdateResponsible();

  const form = useForm<z.infer<typeof ResponsibleFormSchema>>({
    resolver: zodResolver(ResponsibleFormSchema),
    defaultValues: responsible
      ? { ...responsible, observation: responsible.observation || "" }
      : defaultValues,
  });

  const onSubmit = async (data: ResponsibleFormData) => {
    if (mode === "CREATE") {
      await createResponsibleMutation.mutateAsync(
        data as unknown as Responsible,
      );
      closeModal();
    } else {
      await updateResponsibleMutation.mutateAsync({
        id: responsible?.id?.toString() || "",
        data: data as unknown as Responsible,
      });
      closeModal();
    }
  };

  const onError = () => {
    console.log(form.formState.errors);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-h-[95%] max-w-2xl overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {mode === "CREATE" ? "Nuevo responsable" : "Editar responsable"}
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
                placeholder="Nombre del responsable"
                form={form}
              />
              <InputField
                label="CUIT"
                name="cuit"
                placeholder="CUIT"
                form={form}
              />
              <InputField
                label="Condición"
                name="condition"
                placeholder="Condición"
                form={form}
              />

              <InputField
                label="Observación"
                name="observation"
                placeholder="Observación"
                form={form}
              />

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
                  text={mode === "CREATE" ? "Crear responsable" : "Guardar"}
                  className="min-w-[150px]"
                  isLoading={
                    createResponsibleMutation.isPending ||
                    updateResponsibleMutation.isPending
                  }
                  disabled={
                    createResponsibleMutation.isPending ||
                    updateResponsibleMutation.isPending ||
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

export { ResponsibleModal };
