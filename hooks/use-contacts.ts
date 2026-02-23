import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contact } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetContacts() {
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: () => api.get("/contacts").then((res) => res.data),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/contacts/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
