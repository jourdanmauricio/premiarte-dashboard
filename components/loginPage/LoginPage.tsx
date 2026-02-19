"use client";

import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FieldErrors, useForm } from "react-hook-form";

import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { loginFormSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/ui/custom/input-field";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error || res?.status === 401) {
      toast.error("Credenciales incorrectas");
      return;
    }
    toast.success("Bienvenido!!!");
    router.push("/dashboard");
  };
  const handleSubmitError = (
    errors: FieldErrors<z.infer<typeof loginFormSchema>>,
  ) => {
    console.log(errors);
  };
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-4xl font-semibold">Premiarte - Login</span>
            <span className="text-4xl font-semibold">🔐</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleSubmitError)}>
            <div className="flex w-full flex-col gap-10">
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
                form={form}
                icon={<Mail className="h-4 w-4 text-neutral-500" />}
                autoFocus
              />

              <InputField
                label="Password"
                name="password"
                placeholder="Password"
                form={form}
                type={showPassword ? "text" : "password"}
                icon={
                  showPassword ? (
                    <Eye className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-neutral-500" />
                  )
                }
                iconOnClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </div>

            <div className="mt-10 flex justify-end">
              <SubmitButton
                className="min-w-[150px]"
                text="Login"
                isLoading={form.formState.isSubmitting}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export { LoginPage };
