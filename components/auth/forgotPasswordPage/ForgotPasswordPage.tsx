"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";
import { FieldErrors, useForm } from "react-hook-form";

import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { forgotPasswordFormSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof forgotPasswordFormSchema>) => {
    try {
      const res = await api.post("/auth/forgot-password", values);
      if (res.status !== 200) {
        toast.error("Error al enviar el enlace de recuperación de contraseña");
        return;
      }
      toast.success("Enlace de recuperación de contraseña enviado");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  const handleSubmitError = (
    errors: FieldErrors<z.infer<typeof forgotPasswordFormSchema>>,
  ) => {
    console.log(errors);
  };
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-4xl font-semibold">
              PremiArte - Recuperar contraseña
            </span>
            <span className="text-4xl font-semibold">🔐</span>
            <p className="text-[16px] text-neutral-300 my-8">
              Ingresa tu email para recibir un enlace de recuperación de
              contraseña.
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        style={{ "--spacing": "0.222222rem" } as React.CSSProperties}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleSubmitError)}>
            <div className="flex w-full flex-col gap-10">
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                form={form}
                icon={<Mail className="h-6 w-6 text-neutral-500" />}
                autoFocus
              />

              <p className="text-sm text-neutral-500 text-right">
                <Link href="/">Volver al login</Link>
              </p>
            </div>

            <div className="mt-10 flex justify-end">
              <SubmitButton
                className="min-w-[150px]"
                text="Recuperar contraseña"
                isLoading={form.formState.isSubmitting}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { ForgotPasswordPage };
