import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useUpdateCategory, useCreateCategory } from "@/hooks/use-categories";

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import type { Contact } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ContactFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { TextareaField } from "@/components/ui/custom/textarea-field";

interface ContactModalProps {
  open: boolean;
  closeModal: () => void;
  contact: Contact | null;
}

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const ContactModal = ({ open, closeModal, contact }: ContactModalProps) => {
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: contact
      ? {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
        }
      : defaultValues,
  });

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
          <DialogTitle className="dialog-title">Ver contacto</DialogTitle>
          <DialogDescription />
          <Form {...form}>
            <form className="mt-4 flex flex-col gap-6 w-full">
              <InputField
                label="Nombre"
                name="name"
                placeholder="Nombre"
                form={form}
                readOnly
              />
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                form={form}
                readOnly
              />
              <InputField
                label="Teléfono"
                name="phone"
                placeholder="Teléfono"
                maxLength={350}
                form={form}
                readOnly
              />

              <TextareaField
                label="Mensaje"
                name="message"
                placeholder="Mensaje"
                maxLength={350}
                inputClassname="h-[180px]"
                form={form}
                readOnly
              />

              <div className="flex justify-end gap-8 pt-10">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  Cerrar
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { ContactModal };
