// import type { ProductWithDetails } from "@/shared/types";

import { Product } from "@/shared/types";

export const getFolderIcon = (folderId: string) => {
  const icons: Record<string, string> = {
    Todas: "📁",
    Categorías: "📂",
    Productos: "📦",
    Páginas: "📄",
    Otros: "🗂️",
  };
  return icons[folderId] || "📁";
};

export const setPrices = (type: "retail" | "wholesale", product: Product) => {
  const price =
    type === "retail"
      ? product.retailPrice
        ? product.retailPrice.toString()
        : "0"
      : product.wholesalePrice
        ? product.wholesalePrice!.toString()
        : "0";
  const retailPrice = product.retailPrice
    ? product.retailPrice.toString()
    : "0";

  const wholesalePrice = product.wholesalePrice
    ? product.wholesalePrice.toString()
    : "0";

  return { price, retailPrice, wholesalePrice };
};

// Función para generar un slug a partir de un string
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Reemplazar caracteres especiales del español
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u")
      .replace(/ñ/g, "n")
      .replace(/ü/g, "u")
      // Reemplazar espacios y caracteres especiales con guiones
      .replace(/[^a-z0-9]+/g, "-")
      // Eliminar guiones al inicio y al final
      .replace(/^-+|-+$/g, "")
      // Reemplazar múltiples guiones consecutivos con uno solo
      .replace(/-+/g, "-")
  );
}
