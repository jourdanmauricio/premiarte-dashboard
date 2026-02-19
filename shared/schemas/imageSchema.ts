import z from "zod";

export const ImageFormSchema = z.object({
  tag: z.string().optional(),
  alt: z.string().min(1, { message: "Requerido" }),
  observation: z.string().optional(),
});
