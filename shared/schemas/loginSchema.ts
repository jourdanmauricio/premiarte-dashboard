import z from "zod";

export const loginFormSchema = z.object({
  email: z.email({ message: "Email inválido" }).min(1, "Requerido"),
  password: z.string().min(1, "Requerido"),
});
