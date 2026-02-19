import { z } from "zod";

export const OrderItemFormSchema = z.object({
  id: z.number().optional(),
  productId: z.number().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  sku: z.string().min(1, "El SKU es requerido"),
  retailPrice: z.string().optional(),
  wholesalePrice: z.string().optional(),
  price: z.string().min(0, "El precio es requerido"),
  quantity: z.string().min(1, "La cantidad es requerida"),
  amount: z.string().min(0, "El monto es requerido"),
  observation: z.string().optional(),
});

export const OrderFormSchema = z.object({
  customerId: z.string().min(1, "El cliente es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().min(1, "El email es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  type: z.enum(["wholesale", "retail"]),
  status: z.enum(["pending", "delivered", "cancelled"]),
  totalAmount: z.string().min(0, "El total debe ser mayor o igual a 0"),
  observation: z.string().optional(),
  createdAt: z.date().optional(),
  items: z.array(OrderItemFormSchema),
});
