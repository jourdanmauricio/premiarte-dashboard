import z from "zod";

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, "Requerido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .min(1, "Requerido"),
    confirmPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .min(1, "Requerido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });
