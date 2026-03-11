import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, ProductCreate } from "@/shared/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/get-error-message";

export function useGetProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const products = await api
        .get("/products?isActive=false")
        .then((res) => res.data);
      return products.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductCreate) => api.post("/products", product),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto creado correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["products", "featured-products"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductCreate }) =>
      api.put(`/products/${id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto modificado correctamente");
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["products", "featured-products"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdatePricesProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      products: number[];
      percentage: number;
      operation: "add" | "subtract";
    }) => api.put(`/products/update-prices`, data),

    onSuccess: async () => {
      // este invalidate actualiza la lista de productos completa. Se puede mejorar para actualizar solo los productos que se han modificado.
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Precios actualizados correctamente");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["images"] }),
      ]);
      try {
        await api.post("/revalidate", {
          type: "tags",
          tags: ["products", "featured-products"],
        });
      } catch {
        // Revalidación en el front opcional; no bloqueamos la UX
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
