"use client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import type { Row, SortingState } from "@tanstack/react-table";
import { getBudgetColumns } from "@/components/budgetsPage/table/budgetColumns";
import { CustomConfirmDialog } from "@/components/ui/custom/custom-confirm-dialog";
import { FilterBudgets } from "@/components/budgetsPage/table/FilterBugets";
import { budgetStatusList } from "@/shared/constanst";
import { Budget, BudgetStatus, Order } from "@/shared/types";
import {
  useGetBudgets,
  useDeleteBudget,
  useGetBudgetById,
  useUpdateBudgetStatus,
} from "@/hooks/use-budgets";
import { useRouter } from "next/navigation";
import { PdfModal } from "@/components/budgetsPage/pdf/PdfModal";
import { useCreateOrder } from "@/hooks/use-orders";
import { getErrorMessage } from "@/lib/get-error-message";
import { ViewBudgetModal } from "./ViewBudgetModal";

const BudgetsPage = () => {
  const router = useRouter();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [createPDFModalIsOpen, setCreatePDFModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [addOrderModalIsOpen, setAddOrderModalIsOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
    status: string;
  }>({ search: "", status: "pending" });

  const { data, isLoading, error } = useGetBudgets();
  const deleteBudgetMutation = useDeleteBudget();
  const getBudgetById = useGetBudgetById(
    currentBudget?.id?.toString() || "",
    currentBudget !== null ? true : false,
  );
  const createOrder = useCreateOrder();
  const updateBudgetStatus = useUpdateBudgetStatus();

  console.log("data", data);

  const handleDeleteBudget = useCallback((budget: Budget) => {
    setCurrentBudget(budget);
    setDeleteModalIsOpen(true);
  }, []);

  const handleEditBudget = useCallback(
    (budget: Budget) => {
      setCurrentBudget(budget);
      router.push(`/dashboard/budgets/${budget.id}`);
    },
    [router],
  );

  const handleConfirmDelete = () => {
    if (currentBudget !== null) {
      deleteBudgetMutation.mutate(currentBudget.id.toString());
    }
  };

  const handleCreatePDFBudget = useCallback((budget: Budget) => {
    setCurrentBudget(budget);
    setCreatePDFModalIsOpen(true);
  }, []);

  const handleViewBudget = useCallback(
    (budget: Budget) => {
      setCurrentBudget(budget);
      setViewModalIsOpen(true);
    },
    [currentBudget],
  );

  const handleConfirmAddOrder = useCallback(
    (budget: Budget) => {
      setCurrentBudget(budget);
      setAddOrderModalIsOpen(true);
    },
    [currentBudget],
  );

  const handleAddOrder = async (budget: Budget) => {
    try {
      const budgetDb = await getBudgetById.data;

      if (!budgetDb) {
        toast.error("Presupuesto no encontrado");
        return;
      }

      const newOrder = {
        customerId: budgetDb.customerId,
        type: budgetDb.type,
        status: "pending",
        totalAmount: budgetDb.totalAmount,
        observation: budgetDb.observation,
        products:
          budgetDb.items?.map((item) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            amount: item.amount,
            retailPrice: item.retailPrice,
            wholesalePrice: item.wholesalePrice,
            observation: item.observation,
          })) || [],
      };

      await createOrder.mutate(newOrder as unknown as Order);

      await updateBudgetStatus.mutate({
        id: budget.id.toString(),
        status: "approved" as BudgetStatus,
      });
    } catch (error) {
      console.error("Error en handleAddOrder:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const columns = useMemo(
    () =>
      getBudgetColumns({
        onDelete: handleDeleteBudget,
        onEdit: handleEditBudget,
        onView: handleViewBudget,
        onCreatePDF: handleCreatePDFBudget,
        onCreateOrder: handleConfirmAddOrder,
      }),
    [
      handleDeleteBudget,
      handleEditBudget,
      handleCreatePDFBudget,
      handleConfirmAddOrder,
      handleViewBudget,
    ],
  );

  const translateBudgetStatus = (status: BudgetStatus) => {
    return budgetStatusList.find((statusItem) => statusItem.id === status)
      ?.description;
  };

  const handleDownload = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay presupuestos para descargar");
      return;
    }

    try {
      // Preparar datos para Excel (solo campos simples, sin categorías, imágenes ni descuentos)
      const excelData = data.map((budget: Budget) => ({
        Id: budget.number,
        Nombre: budget.customer?.name,
        Tipo: budget.type === "wholesale" ? "Mayorista" : "Minorista",
        Total: budget.totalAmount,
        Estado: translateBudgetStatus(budget.status),
        CreatedAt: budget.createdAt
          ? new Date(budget.createdAt).toLocaleDateString()
          : "",
        Observacion: budget.observation,
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
      XLSX.utils.book_append_sheet(wb, ws, "Presupuestos");

      // Generar archivo y descargar
      const fileName = `presupuestos-${new Date().toISOString().split("T")[0]}.xlsx`;
      await XLSX.writeFile(wb, fileName);
    } catch {
      toast.error("Error al descargar los presupuestos");
    }
  };

  const handleAddBudget = () => {
    router.push("/dashboard/budgets/new");
  };

  const checkStatus = (status: string) => {
    if (status === "approved") {
      return (
        <span className="text-red-500">
          Atención! El presupuesto está aprobado, se ha creado un pedido de
          compra anteriormente
        </span>
      );
    }
    if (status === "closed") {
      return (
        <span className="text-red-500">
          Atención! Está cerrado, verificar el precio de los productos antes de
          crear un nuevo pedido
        </span>
      );
    }
    return "";
  };

  const globalFilterFn = (row: Row<Budget>) => {
    const budget = row.original as Budget;

    if (Object.keys(globalFilter).length === 0) return true;

    if (Object.values(globalFilter).every((value) => value === "")) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesCategory = true;
    let matchesSearch = true;

    // Si hay filtro de categoría, verificar que coincida
    if (globalFilter.status && globalFilter.status !== "") {
      matchesCategory = budget.status === globalFilter.status;
    }

    // Si hay filtro de búsqueda, verificar que coincida en nombre o SKU
    if (globalFilter.search && globalFilter.search !== "") {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        budget.customer?.name?.toLowerCase().includes(searchTerm) || false;
    }

    // Solo retorna true si ambas condiciones se cumplen
    return matchesCategory && matchesSearch;
  };

  return (
    <>
      <div className="rounded-lg shadow-md py-6 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Presupuestos</h2>

          <div className="flex items-center gap-4">
            <FilterBudgets
              globalFilter={
                globalFilter as unknown as { search: string; status: string }
              }
              handleSearch={(key, value) =>
                setGlobalFilter({ ...globalFilter, [key]: value })
              }
            />
            <Button variant="outline" onClick={handleDownload}>
              <DownloadIcon className="size-5" />
            </Button>
            <Button variant="default" onClick={handleAddBudget}>
              <PlusIcon className="size-5" />
            </Button>
          </div>
        </div>

        <CustomTable
          data={data || []}
          columns={columns}
          isLoading={isLoading || deleteBudgetMutation.isPending}
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
      {deleteModalIsOpen && currentBudget !== null && (
        <CustomAlertDialog
          title="Eliminar presupuesto"
          description={`¿Estás seguro de querer eliminar el presupuesto "${currentBudget.customer?.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText="Eliminar"
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            setDeleteModalIsOpen(false);
            setCurrentBudget(null);
          }}
        />
      )}

      {createPDFModalIsOpen && currentBudget !== null && (
        <PdfModal
          open={createPDFModalIsOpen}
          budget={currentBudget}
          closeModal={() => {
            setCreatePDFModalIsOpen(false);
            setCurrentBudget(null);
          }}
        />
      )}

      {addOrderModalIsOpen && currentBudget !== null && (
        <CustomConfirmDialog
          open={addOrderModalIsOpen}
          onCloseDialog={() => setAddOrderModalIsOpen(false)}
          onContinueClick={() => handleAddOrder(currentBudget)}
          onCancelClick={() => setAddOrderModalIsOpen(false)}
          title="Crear pedido"
          description={
            <span className="">
              ¿Estás seguro de querer crear un pedido para el presupuesto{" "}
              {currentBudget.customer?.name}?
              <br />
              <br />
              {checkStatus(currentBudget.status)}
            </span>
          }
          cancelButtonText="Cancelar"
          continueButtonText={
            createOrder.isPending ? "Creando..." : "Crear pedido"
          }
          isLoading={createOrder.isPending}
        />
      )}

      {viewModalIsOpen && currentBudget !== null && (
        <ViewBudgetModal
          open={viewModalIsOpen}
          budget={currentBudget}
          closeModal={() => setViewModalIsOpen(false)}
        />
      )}
    </>
  );
};

export { BudgetsPage };
