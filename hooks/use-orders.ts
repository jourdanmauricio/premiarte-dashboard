import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderWithItems } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((res) => res.data),
  });
}

export function useGetOrderById(id: string, enabled: boolean) {
  return useQuery<OrderWithItems>({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res.data),
    enabled: enabled,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (order: Order) => api.post("/orders", order),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido creado correctamente");
      router.push(`/dashboard/orders`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Order }) =>
      api.put(`/orders/${id}`, data),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Pedido modificado correctamente");
      router.push(`/dashboard/orders`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/orders/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
