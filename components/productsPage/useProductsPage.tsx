import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useCallback, useMemo, useState } from "react";
import type { Row, SortingState, Updater } from "@tanstack/react-table";

import { getProductColumns } from "@/components/productsPage/table/columns";
import type { Product, ProductWithDetails } from "@/shared/types";
import { useDeleteProduct, useGetProducts } from "@/hooks/use-products";

const useProductsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [productModalIsOpen, setProductModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Product | null>(null);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
    category: string;
  }>({ search: "", category: "" });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [updatePriceModalIsOpen, setUpdatePriceModalIsOpen] = useState(false);

  const { data: productsData, isLoading, error } = useGetProducts();
  const deleteProductMutation = useDeleteProduct();

  console.log("productsData", productsData);

  // Los datos ya vienen completos del backend, solo necesitamos mapearlos al tipo esperado
  const data = useMemo(() => {
    if (!productsData) return [];

    const productsDetail: ProductWithDetails[] = productsData.map(
      (product) => ({
        ...product,
        detCategories: product.categories || [],
        detImages: product.images || [],
      }),
    );
    return productsDetail;
  }, [productsData]);

  const onDelete = useCallback(async (product: Product) => {
    setCurrentRow(product);
    setDeleteModalIsOpen(true);
  }, []);

  const onEdit = useCallback(async (product: Product) => {
    setCurrentRow(product);
    setProductModalIsOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  const handleAddProduct = () => {
    setCurrentRow(null);
    setProductModalIsOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentRow?.id) {
      deleteProductMutation.mutate(currentRow.id.toString());
    }
  };

  const handleDownload = () => {
    if (!data || data.length === 0) {
      toast.error("No hay productos para descargar");
      return;
    }

    try {
      // Preparar datos para Excel (solo campos simples, sin categorías, imágenes ni descuentos)
      const excelData = data.map((product) => ({
        Id: product.id,
        SKU: product.sku || "", // Campo obligatorio para identificación
        Nombre: product.name,
        Categorías: product.categories
          ?.map((category) => category.name)
          .join(", "),
        Precio_Retail: product.retailPrice,
        Precio_Mayorista: product.wholesalePrice,
        Fecha_Actualización_Precio: product.priceUpdatedAt
          ? new Date(product.priceUpdatedAt).toLocaleDateString("es-ES")
          : "",
        Precio_Actualizado: product.priceUpdated,
        Stock: product.stock,
        Activo: product.isActive ? "Sí" : "No",
        Destacado: product.isFeatured ? "Sí" : "No",
        Descripción: product.description,
        Slug: product.slug,
      }));

      // Solo usar los datos existentes (sin filas vacías adicionales)

      // Crear workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Función para ajustar automáticamente el ancho de las columnas
      const autoFitColumns = (
        worksheet: XLSX.WorkSheet,
        worksheetData: (string | number | null | undefined)[][],
      ) => {
        const colWidths = worksheetData[0].map((_, colIndex) => {
          const maxWidth = Math.max(
            ...worksheetData.map((row) => {
              const cell = row[colIndex];
              return cell ? cell.toString().length + 2 : 10;
            }),
          );

          // Limitar el ancho máximo de la columna descripción (triple del tamaño anterior)
          if (colIndex === 11) {
            // Columna "Descripción"
            return { wch: Math.min(maxWidth, 150) };
          }

          return { wch: maxWidth };
        });
        worksheet["!cols"] = colWidths;
      };

      // Convertir datos a array 2D para autoFitColumns
      const worksheetData = [
        Object.keys(excelData[0]), // Encabezados
        ...excelData.map((row) => Object.values(row)), // Datos
      ];

      autoFitColumns(ws, worksheetData);

      // Agregar hoja al workbook
      XLSX.utils.book_append_sheet(wb, ws, "Productos");

      // Generar archivo y descargar
      const fileName = `productos-${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Productos descargados exitosamente");
    } catch (error) {
      toast.error("Error al descargar los productos");
    }
  };

  // Filtro global simple - por ahora sin filtros específicos
  const globalFilterFn = (row: Row<Product>) => {
    const product = row.original as Product;
    if (Object.keys(globalFilter).length === 0) return true;

    if (Object.values(globalFilter).every((value) => value === "")) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesCategory = true;
    let matchesSearch = true;

    // Si hay filtro de categoría, verificar que coincida
    if (globalFilter.category && globalFilter.category !== "") {
      matchesCategory =
        product.categories?.some(
          (category) => category.id === Number(globalFilter.category),
        ) || false;
    }

    // Si hay filtro de búsqueda, verificar que coincida en nombre o SKU
    if (globalFilter.search && globalFilter.search !== "") {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku?.toLowerCase().includes(searchTerm) ||
        false;
    }

    // Solo retorna true si ambas condiciones se cumplen
    return matchesCategory && matchesSearch;
  };

  const handlePriceUpdate = () => {
    const selectedProductIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );
    if (selectedProductIds.length === 0) {
      toast.error("No hay productos seleccionados para actualizar precios");
      return;
    }

    setUpdatePriceModalIsOpen(true);
  };

  const handleSorting = useCallback((updaterOrValue: Updater<SortingState>) => {
    setSorting(updaterOrValue);
    setPageIndex(0);
  }, []);

  const handleSearch = useCallback((key: string, value: string) => {
    setGlobalFilter((prev) => ({ ...prev, [key]: value }));
    setPageIndex(0);
    setRowSelection({});
  }, []);

  return {
    data,
    error,
    isLoading,
    deleteProductMutation,
    columns,
    sorting,
    pageIndex,
    productModalIsOpen,
    deleteModalIsOpen,
    currentRow,
    globalFilter,
    rowSelection,
    updatePriceModalIsOpen,
    setRowSelection,
    setUpdatePriceModalIsOpen,
    setPageIndex,
    globalFilterFn,
    handleSearch,
    handleDownload,
    handleAddProduct,
    handleSorting,
    handleConfirmDelete,
    setDeleteModalIsOpen,
    setProductModalIsOpen,
    setCurrentRow,
    handlePriceUpdate,
  };
};

export default useProductsPage;
