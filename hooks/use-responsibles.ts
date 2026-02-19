import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Responsible } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export function useGetResponsibles() {
  return useQuery<Responsible[]>({
    queryKey: ["responsibles"],
    queryFn: () => api.get("/responsibles").then((res) => res.data),
  });
}

export function useGetResponsibleById(id: string) {
  return useQuery<Responsible>({
    queryKey: ["responsible", id],
    queryFn: () => api.get(`/responsibles/${id}`).then((res) => res.data),
  });
}

export function useCreateResponsible() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responsible: Responsible) =>
      api.post("/responsibles", responsible),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["responsibles"] });
      toast.success("Responsable creado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateResponsible() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Responsible }) =>
      api.put(`/responsibles/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["responsibles"] });
      toast.success("Responsable modificado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteResponsible() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/responsibles/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["responsibles"] });
      toast.success("Responsable eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
