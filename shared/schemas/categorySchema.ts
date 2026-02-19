import z from "zod";

export const CategoryFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "El nombre es requerido" }),
  slug: z.string().min(1, { message: "El slug es requerido" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  imageId: z.number().min(1, { message: "La imagen es requerida" }),
  featured: z.boolean(),
});
