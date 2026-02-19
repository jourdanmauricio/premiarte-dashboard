import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useGetImages() {
  return useQuery<Image[]>({
    queryKey: ["images"],
    queryFn: () => api.get("/images").then((res) => res.data),
  });
}

export function useCreateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Imagen creada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Image }) =>
      api.put(`/images/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Imagen modificada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/images/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Imagen eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
