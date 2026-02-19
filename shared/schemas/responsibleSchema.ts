import z from "zod";

export const ResponsibleFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  cuit: z.string().min(1, "El CUIT es requerido"),
  condition: z.string().min(1, "La condición es requerida"),
  observation: z.string().optional(),
});
