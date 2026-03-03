import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Variant } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useGetVariants() {
  return useQuery<Variant[]>({
    queryKey: ["variants"],
    queryFn: () => api.get("/variation-types").then((res) => res.data),
  });
}

export function useCreateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Variant) => api.post("/variation-types", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
      toast.success("Variante creada correctamente");
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Variant }) =>
      api.put(`/variation-types/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
      toast.success("Variante modificada correctamente");
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/variation-types/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
      toast.success("Variante eliminada correctamente");
    },
  });
}
