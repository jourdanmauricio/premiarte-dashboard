import z from "zod";

export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  password: z.string().optional(),
  email: z.email({ message: "Email inválido" }).min(1, "Requerido"),
});

export const userChangePasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(1, "Requerido")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});
