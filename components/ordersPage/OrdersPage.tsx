"use client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";

import type { Order } from "@/shared/types";

import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/ui/custom/CustomTable";

import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { getOrderColumns } from "@/components/ordersPage/table/orderColumns";
import { FilterOrders } from "@/components/ordersPage/table/FilterOrders";
import { orderStatusList } from "@/shared/constanst";
import { useGetOrders, useDeleteOrder } from "@/hooks/use-orders";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

const OrdersPage = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
    status: string;
  }>({ search: "", status: "pending" });

  const router = useRouter();
  const { data, isLoading, error } = useGetOrders();
  const deleteOrder = useDeleteOrder();

  const handleConfirmDelete = useCallback(() => {
    if (currentOrder !== null) {
      deleteOrder.mutate(currentOrder.id.toString());
    }
  }, [currentOrder, deleteOrder]);

  //   const handleDownloadTemplate = () => {
  //     if (!data || data.length === 0) {
  //       toast.error("No hay pedidos para descargar");
  //       return;
  //     }
  //   };

  const handleAddOrder = () => {
    router.push("/dashboard/orders/new");
  };

  const handleDeleteOrder = useCallback((order: Order) => {
    setCurrentOrder(order);
    setDeleteModalIsOpen(true);
  }, []);

  const handleEditOrder = useCallback(
    (order: Order) => {
      setCurrentOrder(order);
      router.push(`/dashboard/orders/${order.id}`);
    },
    [router],
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        onDelete: handleDeleteOrder,
        onEdit: handleEditOrder,
      }),
    [handleDeleteOrder, handleEditOrder],
  );

  const globalFilterFn = (row: Row<Order>) => {
    const order = row.original as Order;
    if (Object.keys(globalFilter).length === 0) return true;

    if (Object.values(globalFilter).every((value) => value === "")) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesCategory = true;
    let matchesSearch = true;

    // Si hay filtro de categoría, verificar que coincida
    if (globalFilter.status && globalFilter.status !== "") {
      matchesCategory = order.status === globalFilter.status;
    }

    // Si hay filtro de búsqueda, verificar que coincida en nombre o SKU
    if (globalFilter.search && globalFilter.search !== "") {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        order.customer?.name?.toLowerCase().includes(searchTerm) ?? false;
    }

    // Solo retorna true si ambas condiciones se cumplen
    return matchesCategory && matchesSearch;
  };

  const handleDownload = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay presupuestos para descargar");
      return;
    }

    try {
      // Preparar datos para Excel (solo campos simples, sin categorías, imágenes ni descuentos)
      const excelData = data.map((order) => ({
        Id: order.id,
        Nombre: order.customer?.name,
        Email: order.customer?.email,
        Telefono: order.customer?.phone,
        Tipo: order.type === "wholesale" ? "Mayorista" : "Minorista",
        Total: order.totalAmount,
        Status: orderStatusList.find((status) => status.id === order.status)
          ?.description,
        CreatedAt: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "",
        Observacion: order.observation,
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
          if (colIndex === 8) {
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
      XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

      // Generar archivo y descargar
      const fileName = `pedidos-${new Date().toISOString().split("T")[0]}.xlsx`;
      await XLSX.writeFile(wb, fileName);
    } catch {
      toast.error("Error al descargar los pedidos");
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-md py-6 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Pedidos</h2>

          <div className="flex items-center gap-4">
            <FilterOrders
              globalFilter={globalFilter}
              handleSearch={(key: string, value: string) =>
                setGlobalFilter({ ...globalFilter, [key]: value })
              }
            />
            <Button variant="outline" onClick={handleDownload}>
              <DownloadIcon className="size-5" />
            </Button>
            <Button variant="default" onClick={handleAddOrder}>
              <PlusIcon className="size-5" />
            </Button>
          </div>
        </div>

        <CustomTable
          data={data || []}
          columns={columns}
          isLoading={isLoading || deleteOrder.isPending}
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
      {deleteModalIsOpen && currentOrder !== null && (
        <CustomAlertDialog
          title="Eliminar pedido"
          description={`¿Estás seguro de querer eliminar el pedido "${currentOrder.id}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText="Eliminar"
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            setDeleteModalIsOpen(false);
            setCurrentOrder(null);
          }}
        />
      )}
    </>
  );
};

export { OrdersPage };
