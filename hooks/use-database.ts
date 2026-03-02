import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DatabaseBackup } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetDatabaseBackup() {
  return useQuery<DatabaseBackup[]>({
    queryKey: ["database-backup"],
    queryFn: () => api.get("/database").then((res) => res.data),
  });
}

export function useCreateDatabaseBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/database"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["database-backup"] });
      toast.success(
        "Backup solicitado correctamente. Se enviará un correo cuando esté listo.",
      );
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
