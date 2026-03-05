import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Category, Product, ProductCreate } from "@/shared/types";
import { ProductFormSchema } from "@/shared/schemas";
import { useCreateProduct } from "@/hooks/use-products";
import { useUpdateProduct } from "@/hooks/use-products";
import { Image } from "@/shared/types/image";

const defaultValues = {
  name: "",
  description: "",
  slug: "",
  imageId: 0,
  isActive: true,
  isFeatured: false,
  sku: "",
  stock: "0",
  retailPrice: "0",
  wholesalePrice: "0",
  relatedProducts: [],
  images: [],
  categories: [],
  variants: [],
};

const useProductModal = (product: Product | null, closeModal: () => void) => {
  const mode = product ? "EDIT" : "CREATE";

  console.log("product", product);

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues:
      mode === "EDIT" && product && "slug" in product
        ? {
            name: product.name,
            slug: product.slug,
            description: product.description,
            images: Array.isArray(product.images)
              ? product.images.map((img: Image) =>
                  typeof img === "object" ? img.id : img,
                )
              : [],
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            relatedProducts: product.relatedProducts || [],
            categories: Array.isArray(product.categories)
              ? product.categories.map(
                  (cat: Category) =>
                    typeof cat === "object"
                      ? cat // Mantener objeto completo para el CategorySelector
                      : { id: cat, name: "", slug: "" }, // Si es solo ID, crear objeto mínimo
                )
              : [],
            sku: product.sku ? product.sku.toString() : "",
            stock: product.stock ? product.stock.toString() : "0",
            retailPrice: product.retailPrice
              ? product.retailPrice.toString()
              : "0",
            wholesalePrice: product.wholesalePrice
              ? product.wholesalePrice.toString()
              : "0",
            priceUpdatedAt: product.priceUpdatedAt
              ? product.priceUpdatedAt
              : "",
            variants: product.variants ?? [],
          }
        : defaultValues,
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const onSubmit = async (formData: z.infer<typeof ProductFormSchema>) => {
    const newProduct: ProductCreate = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      sku: formData.sku,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      retailPrice: formData.retailPrice
        ? parseFloat(formData.retailPrice)
        : undefined,
      wholesalePrice: formData.wholesalePrice
        ? parseFloat(formData.wholesalePrice)
        : undefined,
      relatedProductIds: formData.relatedProducts,
      categoryIds: formData.categories.map((category) => category.id),
      images: formData.images as unknown as Image[],
      variants: [],
    };

    if (mode === "CREATE") {
      await createProductMutation.mutateAsync(newProduct);
      closeModal();
    } else {
      await updateProductMutation.mutateAsync({
        id: product?.id?.toString() || "",
        data: newProduct,
      });
      closeModal();
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  // Función helper para detectar cambios de precio
  const handlePriceChange = (fieldName: "retailPrice" | "wholesalePrice") => {
    return (value: string) => {
      // Solo actualizar si estamos en modo edición y el valor ha cambiado
      if (mode === "EDIT" && product) {
        const originalValue = product[fieldName]?.toString() || "";
        if (value !== originalValue) {
          form.setValue("priceUpdatedAt", new Date().toISOString());
        }
      }
    };
  };

  return {
    mode,
    form,
    createProductMutation,
    updateProductMutation,
    onSubmit,
    onError,
    handlePriceChange,
  };
};

export default useProductModal;
