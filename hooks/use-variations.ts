import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Variation } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useGetVariations() {
  return useQuery<Variation[]>({
    queryKey: ["variation-types"],
    queryFn: () => api.get("/variation-types").then((res) => res.data),
  });
}

export function useCreateVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Variation) => api.post("/variation-types", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variation-types"] });
      toast.success("Variante creada correctamente");
    },
  });
}

export function useUpdateVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Variation }) =>
      api.put(`/variation-types/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variation-types"] });
      toast.success("Variante modificada correctamente");
    },
  });
}

export function useDeleteVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/variation-types/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["variants"] });
      toast.success("Variante eliminada correctamente");
    },
  });
}
