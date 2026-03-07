import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

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
            variants: (product.variants ?? []).map((v) => ({
              id: v.id,
              sku: v.sku ?? "",
              retailPrice: typeof v.retailPrice === "number" ? v.retailPrice : undefined,
              wholesalePrice: typeof v.wholesalePrice === "number" ? v.wholesalePrice : undefined,
              stock: typeof v.stock === "number" ? v.stock : undefined,
              attributes: Array.isArray(v.attributes) ? v.attributes : [],
              values: Array.isArray(v.values) ? v.values : [],
            })),
          }
        : defaultValues,
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const onSubmit = async (formData: z.infer<typeof ProductFormSchema>) => {
    const hasVariants = formData.variants.length > 0;

    const newProduct: ProductCreate = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      sku: formData.sku,
      stock: hasVariants ? undefined : formData.stock ? parseInt(formData.stock) : undefined,
      retailPrice: hasVariants ? undefined : formData.retailPrice
        ? parseFloat(formData.retailPrice)
        : undefined,
      wholesalePrice: hasVariants ? undefined : formData.wholesalePrice
        ? parseFloat(formData.wholesalePrice)
        : undefined,
      relatedProductIds: formData.relatedProducts,
      categoryIds: formData.categories.map((category) => category.id),
      images: formData.images as unknown as Image[],
      variants: formData.variants,
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

  const onError = () => {
    const errors = form.formState.errors;
    const variantsMsg = errors.variants?.message;
    const firstMsg =
      typeof variantsMsg === "string"
        ? variantsMsg
        : errors.root?.message ??
          Object.values(errors).find((e) => e?.message)?.message;
    toast.error(firstMsg ?? "Revisá los datos del formulario.");
  };

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
