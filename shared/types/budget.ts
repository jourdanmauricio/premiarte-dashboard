import { BudgetItemFormSchema } from "@/shared/schemas";
import { Customer } from "@/shared/types/customer";
import { Product } from "@/shared/types/product";
import type z from "zod";

export interface BudgetItem {
  id: number;
  productId: number;
  product: Product;
  sku: string;
  slug: string;
  name: string;
  imageUrl: string;
  imageAlt: string;
  retailPrice: number; // precio unitario en centavos
  wholesalePrice: number; // precio unitario en centavos
  price: number; // precio unitario en centavos
  quantity: number;
  amount: number; // precio total del item (price * quantity)
  observation?: string;
}

export interface Budget {
  id: number;
  customerId: number;
  responsibleId: string;
  name: string;
  email: string;
  phone: string;
  type: "wholesale" | "retail";
  observation?: string;
  totalAmount: number; // en centavos
  status: "pending" | "sent" | "approved" | "closed";
  userId?: string; // ID del usuario de Clerk
  isRead: boolean;
  expiresAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  items?: BudgetItem[]; // items del presupuesto (relación)
  customer?: Customer;
  createdAt: string;
}

export interface CreateBudgetItemData {
  productId: number;
  retailPrice: number;
  wholesalePrice: number;
  price: number;
  quantity: number;
  amount: number;
  observation?: string;
}

export interface CreateBudgetData {
  customerId: number;
  responsibleId?: number;
  userId?: string;
  observation?: string;
  totalAmount: number;
  type: string;
  status: string;
  items: CreateBudgetItemData[];
}

export interface UpdateBudgetData {
  customerId?: number;
  responsibleId?: number;
  observation?: string;
  status?: Budget["status"];
  isRead?: boolean;
  expiresAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  products?: CreateBudgetItemData[];
}

// Tipos para filtros y consultas
export interface BudgetFilters {
  status?: Budget["status"];
  customerId?: number;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  isRead?: boolean;
}

export type BudgetItemRow = z.infer<typeof BudgetItemFormSchema>;

export type BudgetStatus = "pending" | "sent" | "approved" | "closed";
