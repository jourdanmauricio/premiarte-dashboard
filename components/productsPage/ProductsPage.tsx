"use client";

import { PlusIcon, DownloadIcon, DollarSignIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { ProductModal } from "@/components/productsPage/modals/ProductModal";
import useProductsPage from "@/components/productsPage/useProductsPage";
import { UpdatePriceModal } from "@/components/productsPage/modals/UpdatePriceModal";
import { FilterProducts } from "@/components/productsPage/table/FilterProducts";

const ProductsPage = () => {
  const {
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
    setUpdatePriceModalIsOpen,
    setRowSelection,
    handlePriceUpdate,
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
  } = useProductsPage();

  return (
    <div>
      <h2 className="text-3xl font-bold">Gestión de Productos</h2>

      <div className="flex items-center justify-between gap-2 mt-6">
        <FilterProducts
          globalFilter={globalFilter}
          handleSearch={handleSearch}
        />

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handlePriceUpdate}>
            <DollarSignIcon className="size-5" />
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <DownloadIcon className="size-5" />
          </Button>
          <Button variant="default" onClick={handleAddProduct}>
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>

      <CustomTable
        data={data || []}
        columns={columns}
        isLoading={isLoading || deleteProductMutation.isPending}
        globalFilter={globalFilter}
        error={!!error}
        sorting={sorting}
        handleSorting={handleSorting}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        globalFilterFn={globalFilterFn}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        getRowId={(row) => row.id?.toString() || ""}
      />

      {deleteModalIsOpen && (
        <CustomAlertDialog
          title="Eliminar producto"
          description={`¿Estás seguro de querer eliminar el producto "${currentRow?.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText={
            deleteProductMutation.isPending ? "Eliminando..." : "Eliminar"
          }
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            if (!deleteProductMutation.isPending) {
              setDeleteModalIsOpen(false);
              setCurrentRow(null);
            }
          }}
        />
      )}

      {productModalIsOpen && (
        <ProductModal
          open={productModalIsOpen}
          closeModal={() => setProductModalIsOpen(false)}
          product={currentRow}
        />
      )}

      {updatePriceModalIsOpen && (
        <UpdatePriceModal
          open={updatePriceModalIsOpen}
          closeModal={() => setUpdatePriceModalIsOpen(false)}
          products={Object.keys(rowSelection).filter(
            (key) => rowSelection[key],
          )}
        />
      )}
    </div>
  );
};

export { ProductsPage };
