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
import { User } from "@/shared/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { userChangePasswordFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { useUpdateUserPassword } from "@/hooks/use-users";

interface ModalChangePasswordProps {
  open: boolean;
  closeModal: () => void;
  user: User | null;
}

const defaultValues = {
  newPassword: "",
};

const ModalChangePassword = ({
  open,
  closeModal,
  user,
}: ModalChangePasswordProps) => {
  const updateUserPasswordMutation = useUpdateUserPassword();

  const form = useForm<z.infer<typeof userChangePasswordFormSchema>>({
    resolver: zodResolver(userChangePasswordFormSchema),
    defaultValues,
  });

  const onSubmit = async (
    values: z.infer<typeof userChangePasswordFormSchema>,
  ) => {
    const data = {
      newPassword: values.newPassword,
    };
    await updateUserPasswordMutation.mutateAsync({
      id: user?.id || "",
      data,
    });
    closeModal();
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof userChangePasswordFormSchema>>,
  ) => {
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
      >
        <div style={{ minWidth: "600px" }}>
          <DialogHeader>
            <DialogTitle className="dialog-title">
              Modificar contraseña de usuario
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className="mt-4 flex flex-col gap-x-12 gap-y-8">
                  <InputField
                    label="Nueva contraseña"
                    name="newPassword"
                    placeholder="Password"
                    form={form}
                  />

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
                      text="Guardar"
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

export { ModalChangePassword };
