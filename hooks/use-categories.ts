import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useGetCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Category) => api.post("/categories", category),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["categories", "featured-categories"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Category }) =>
      api.put(`/categories/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría modificada correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["categories", "featured-categories"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["categories", "featured-categories"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
