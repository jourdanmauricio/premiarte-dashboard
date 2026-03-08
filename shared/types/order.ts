import type { OrderItemFormSchema } from "@/shared/schemas";
import { Customer } from "@/shared/types/customer";
import { Product } from "@/shared/types/product";
import type z from "zod";

export interface OrderItem {
  id: number;
  productId: number;
  variantId: string | null;
  product: Product;
  sku?: string;
  slug?: string;
  name?: string;
  imageUrl?: string;
  imageAlt?: string;
  retailPrice: number; // precio unitario en centavos
  wholesalePrice: number; // precio unitario en centavos
  price: number; // precio unitario en centavos
  quantity: number;
  amount: number; // precio total del item (price * quantity)
  observation?: string | null;
  attributes?: string[] | null;
  values?: string[] | null;
}

export interface Order {
  id: number;
  customerId: number;
  customer?: Customer;
  name: string;
  email: string;
  phone: string;
  type: "wholesale" | "retail";
  observation?: string;
  totalAmount: number; // en centavos
  status: "pending" | "delivered" | "cancelled";
  userId?: string; // ID del usuario de Clerk
  isRead: boolean;
  createdAt: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderData {
  customerId: number;
  userId?: string;
  observation?: string;
  totalAmount: number;
  type: string;
  items: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  productId: number;
  variantId?: string | null;
  retailPrice: number;
  wholesalePrice: number;
  price: number;
  quantity: number;
  amount: number;
  observation?: string;
  attributes?: string[] | null;
  values?: string[] | null;
}

export interface UpdateOrderData {
  customerId?: number;
  observation?: string;
  status?: "pending" | "delivered" | "cancelled";
  items?: CreateOrderItemData[];
}

export interface OrderFilters {
  status?: "pending" | "approved" | "rejected" | "expired";
  customerId?: number;
  userId?: string;
}

export type OrderItemRow = z.infer<typeof OrderItemFormSchema>;
