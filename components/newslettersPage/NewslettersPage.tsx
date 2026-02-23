"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Newsletter } from "@/shared/types";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import type { Row, SortingState } from "@tanstack/react-table";
import {
  useDeleteNewsletter,
  useGetNewsletters,
} from "@/hooks/use-newsletters";
import { getNewsletterColumns } from "@/components/newslettersPage/table/columns";
import { NewsletterFilter } from "@/components/newslettersPage/table/NewsletterFilter";

const NewslettersPage = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState<{ search: string }>({
    search: "",
  });

  const { data, isLoading, error } = useGetNewsletters();
  const deleteNewsletterMutation = useDeleteNewsletter();

  const handleDeleteNewsletter = useCallback((newsletter: Newsletter) => {
    setCurrentNewsletter(newsletter);
    setDeleteModalIsOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (currentNewsletter !== null) {
      deleteNewsletterMutation.mutate(currentNewsletter.id.toString());
    }
  }, [currentNewsletter, deleteNewsletterMutation]);

  const columns = useMemo(
    () =>
      getNewsletterColumns({
        onDelete: handleDeleteNewsletter,
      }),
    [handleDeleteNewsletter],
  );

  const handleDownload = () => {
    if (!data || data.length === 0) {
      toast.error("No hay contactos para descargar");
      return;
    }
    try {
      // Preparar datos para Excel (solo campos simples, sin categorías, imágenes ni descuentos)
      const excelData = data.map((newsletter) => ({
        Id: newsletter.id,
        Nombre: newsletter.name,
        Email: newsletter.email,
      }));

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
          if (colIndex === 7) {
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
      XLSX.utils.book_append_sheet(wb, ws, "Newsletters");

      // Generar archivo y descargar
      const fileName = `newsletters-${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Newsletters descargadas exitosamente");
    } catch {
      toast.error("Error al descargar las newsletters");
    }
  };

  const globalFilterFn = (row: Row<Newsletter>) => {
    const newsletter = row.original as Newsletter;
    if (Object.keys(globalFilter).length === 0) return true;

    if (Object.values(globalFilter).every((value) => value === "")) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesSearch = true;

    // Si hay filtro de búsqueda, verificar que coincida en nombre o SKU
    if (globalFilter.search && globalFilter.search !== "") {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        newsletter.name.toLowerCase().includes(searchTerm) ||
        newsletter.email?.toLowerCase().includes(searchTerm) ||
        false;
    }

    // Solo retorna true si ambas condiciones se cumplen
    return matchesSearch;
  };

  return (
    <>
      <div className="rounded-lg shadow-md py-6 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold ">Gestión de Newsletters</h2>

          <div className="flex items-center gap-4">
            <NewsletterFilter
              globalFilter={globalFilter}
              handleSearch={(key: string, value: string) =>
                setGlobalFilter({ ...globalFilter, [key]: value })
              }
            />
            <Button variant="outline" onClick={handleDownload}>
              <DownloadIcon className="size-5" />
            </Button>
          </div>
        </div>

        <CustomTable
          data={data || []}
          columns={columns}
          isLoading={isLoading || deleteNewsletterMutation.isPending}
          error={!!error}
          sorting={sorting}
          handleSorting={setSorting}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          globalFilter={globalFilter}
          globalFilterFn={globalFilterFn}
        />
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteModalIsOpen && currentNewsletter !== null && (
        <CustomAlertDialog
          title="Eliminar newsletter"
          description={`¿Estás seguro de querer eliminar el newsletter "${currentNewsletter.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText="Eliminar"
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            setDeleteModalIsOpen(false);
            setCurrentNewsletter(null);
          }}
        />
      )}
    </>
  );
};

export { NewslettersPage };
