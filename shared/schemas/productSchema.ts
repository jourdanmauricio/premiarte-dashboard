import z from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  slug: z.string().min(1, { message: "El slug es requerido" }),
  price: z.string().optional(),
  sku: z.string().min(1, { message: "El SKU es requerido" }),
  description: z.string().min(1, { message: "La descripción es requerida" }),
  stock: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  retailPrice: z.string().optional(),
  wholesalePrice: z.string().optional(),
  discount: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  relatedProducts: z.array(z.number()),
  images: z.array(z.number()),
  categories: z.array(
    z.object({ id: z.number(), name: z.string(), slug: z.string() }),
  ),
  priceUpdatedAt: z.string().optional(),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      sku: z.string().min(1, { message: "El SKU es requerido" }),
      retailPrice: z.number().optional(),
      wholesalePrice: z.number().optional(),
      stock: z.number().optional(),
      attributes: z.array(z.string()),
      values: z.array(
        z.string().min(1, { message: "Completá todos los atributos" }),
      ),
    }),
  ),
}).refine(
  (data) => {
    const filled = data.variants.filter((v) =>
      v.values.every((val) => val.trim() !== ""),
    );
    const signatures = new Set<string>();
    for (const v of filled) {
      const sig = v.values.map((val) => val.trim().toLowerCase()).join("|");
      if (signatures.has(sig)) return false;
      signatures.add(sig);
    }
    return true;
  },
  {
    message: "No puede haber dos variantes con los mismos valores en sus atributos",
    path: ["variants"],
  },
);
