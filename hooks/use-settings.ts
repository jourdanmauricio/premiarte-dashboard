import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateSettingsData, UpdateSettingsData } from "@/shared/types";
import { Settings } from "@/shared/types";
import { toast } from "sonner";

export function useGetSettings() {
  return useQuery<Settings[]>({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings").then((res) => res.data),
  });
}

export function useCreateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: CreateSettingsData) =>
      api.post("/settings", settings),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuración creada correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      sectionData,
    }: {
      id: string;
      sectionData: UpdateSettingsData;
    }) => {
      const data = {
        key: "home",
        value: JSON.stringify(sectionData),
      };
      return api.put(`/settings/${id}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuración modificada correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["home-settings"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/settings/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuración eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
