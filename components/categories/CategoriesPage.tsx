"use client";

import { DownloadIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { CategorieModal } from "./CategorieModal";
import { FilterCategories } from "./table/FilterCategories";
import { useCategoriesPage } from "@/components/categories/useCategoriesPage";

const CategoriesPage = () => {
  const {
    sorting,
    pageIndex,
    deleteModalIsOpen,
    categorieModalIsOpen,
    currentRow,
    data,
    error,
    isLoading,
    deleteMutation,
    columns,
    globalFilter,
    handleSearch,
    handleDownload,
    handleAddCategory,
    setSorting,
    setPageIndex,
    setDeleteModalIsOpen,
    setCurrentRow,
    setCategorieModalIsOpen,
    globalFilterFn,
    handleConfirmDelete,
  } = useCategoriesPage();

  return (
    <div>
      <h2 className="text-3xl font-bold">Categorías</h2>
      <div className="flex justify-between items-center mt-6">
        <FilterCategories
          globalFilter={globalFilter}
          handleSearch={handleSearch}
        />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleDownload}
            disabled={isLoading}
            title="Download Categorías"
          >
            <DownloadIcon
              className={`size-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="default" onClick={handleAddCategory}>
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>

      <CustomTable
        data={data || []}
        columns={columns}
        isLoading={isLoading || deleteMutation.isPending}
        globalFilter={{}}
        error={!!error}
        sorting={sorting}
        handleSorting={setSorting}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        globalFilterFn={globalFilterFn}
      />

      {deleteModalIsOpen && (
        <CustomAlertDialog
          title="Eliminar categoría"
          description={`¿Estás seguro de querer eliminar la categoría "${currentRow?.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText={
            deleteMutation.isPending ? "Eliminando..." : "Eliminar"
          }
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            if (!deleteMutation.isPending) {
              setDeleteModalIsOpen(false);
              setCurrentRow(null);
            }
          }}
        />
      )}

      {categorieModalIsOpen && (
        <CategorieModal
          open={categorieModalIsOpen}
          closeModal={() => setCategorieModalIsOpen(false)}
          category={currentRow}
        />
      )}
    </div>
  );
};

export { CategoriesPage };
