import z from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.email({ message: "Email inválido" }).min(1, "Requerido"),
});
