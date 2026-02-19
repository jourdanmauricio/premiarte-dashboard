import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { DialogHeader } from "@/components/ui/dialog";
import type { Customer } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/custom/input-field";
import Dropdown from "@/components/ui/custom/dropdown";
import { customerTypeList } from "@/shared/constanst";
import { CustomerFormSchema } from "@/shared/schemas";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customers";

interface CategorieModalProps {
  open: boolean;
  closeModal: () => void;
  customer: Customer | null;
}

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  type: "retail" as "wholesale" | "retail",
  document: "",
  address: "",
  observation: "",
};

const CustomerModal = ({ open, closeModal, customer }: CategorieModalProps) => {
  const mode = customer ? "EDIT" : "CREATE";
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const form = useForm<z.infer<typeof CustomerFormSchema>>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues:
      mode === "EDIT" && customer
        ? {
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone || "",
            type: customer.type,
            document: customer.document || "",
            address: customer.address || "",
            observation: customer.observation || "",
          }
        : defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof CustomerFormSchema>) => {
    const newCustomer = {
      name: form.getValues("name"),
      email: form.getValues("email") || null,
      phone: form.getValues("phone") || null,
      type: form.getValues("type"),
      document: form.getValues("document"),
      address: form.getValues("address"),
      observation: form.getValues("observation"),
    };

    if (mode === "CREATE") {
      await createCustomerMutation.mutateAsync(
        newCustomer as unknown as Customer,
      );
      closeModal();
    } else {
      await updateCustomerMutation.mutateAsync({
        id: customer?.id?.toString() || "",
        data: newCustomer as unknown as Customer,
      });
      closeModal();
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="max-h-[95%] max-w-2xl overflow-y-auto w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {mode === "CREATE"
              ? "Nuevo cliente"
              : `Modifiar cliente ${customer?.name}`}
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
                placeholder="Nombre del cliente"
                form={form}
              />
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                form={form}
              />
              <InputField
                label="Teléfono"
                name="phone"
                placeholder="Teléfono"
                form={form}
              />

              <Dropdown
                label="Tipo"
                name="type"
                placeholder="Tipo"
                form={form}
                list={customerTypeList}
              />
              <InputField
                label="Documento"
                name="document"
                placeholder="Documento"
                form={form}
              />
              <InputField
                label="Dirección"
                name="address"
                placeholder="Dirección"
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
                  text={mode === "CREATE" ? "Crear cliente" : "Guardar"}
                  className="min-w-[150px]"
                  isLoading={
                    createCustomerMutation.isPending ||
                    updateCustomerMutation.isPending
                  }
                  disabled={
                    createCustomerMutation.isPending ||
                    updateCustomerMutation.isPending ||
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

export { CustomerModal };
