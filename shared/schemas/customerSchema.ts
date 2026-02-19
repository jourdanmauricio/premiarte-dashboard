import z from "zod";

export const CustomerFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "El email no es válido",
    ),
  phone: z.string().optional(),
  type: z.enum(["wholesale", "retail"]),
  document: z.string().optional(),
  address: z.string().optional(),
  observation: z.string().optional(),
});
