import z from "zod";

export const variationFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  values: z.array(
    z.object({
      // los valores deben ser únicos... y no pueden estar vacíos
      id: z.string().optional(),
      value: z.string().min(1, "Requerido"),
    }),
  ),
});

export type VariationFormSchema = z.infer<typeof variationFormSchema>;
