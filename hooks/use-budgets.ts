import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Budget, BudgetStatus, UpdateBudgetData } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetBudgets() {
  return useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: () => api.get("/budgets").then((res) => res.data),
  });
}

export function useGetBudgetById(id: string, enabled: boolean) {
  return useQuery<Budget>({
    queryKey: ["budget", id],
    queryFn: () => api.get(`/budgets/${id}`).then((res) => res.data),
    enabled: enabled,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (budget: Budget) => api.post("/budgets", budget),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Presupuesto creado correctamente");
      router.push(`/dashboard/budgets`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetData }) =>
      api.put(`/budgets/${id}`, data),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      await queryClient.invalidateQueries({ queryKey: ["budget", id] });
      toast.success("Presupuesto modificado correctamente");
      router.push(`/dashboard/budgets`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateBudgetStatus() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BudgetStatus }) =>
      api.put(`/budgets/${id}/status`, { status: status }),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      await queryClient.invalidateQueries({ queryKey: ["budget", id] });
      // toast.success("Presupuesto modificado correctamente");
      router.push(`/dashboard/orders`);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/budgets/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Presupuesto eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
