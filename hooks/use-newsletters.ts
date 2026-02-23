import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Newsletter } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetNewsletters() {
  return useQuery<Newsletter[]>({
    queryKey: ["newsletters"],
    queryFn: () => api.get("/newsletters").then((res) => res.data),
  });
}

export function useDeleteNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/newsletters/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["newsletters"] });
      toast.success("Newsletter eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
