import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetCustomers() {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => api.get("/customers").then((res) => res.data),
  });
}

export function useGetCustomerById(id: string) {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: () => api.get(`/customers/${id}`).then((res) => res.data),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: Customer) => api.post("/customers", customer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Customer }) =>
      api.put(`/customers/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente modificado correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/customers/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
