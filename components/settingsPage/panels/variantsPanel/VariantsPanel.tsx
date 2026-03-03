"use client";

import { useCallback, useMemo, useState } from "react";

import { CustomTable } from "@/components/ui/custom/CustomTable";
import { Variant } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/settingsPage/panels/variantsPanel/Modal";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { useDeleteVariant, useGetVariants } from "@/hooks/use-variants";
import { getColumns } from "@/components/settingsPage/panels/variantsPanel/table/columns";

const VariantsPanel = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { data: variants, isLoading, error } = useGetVariants();
  const deleteVariantMutation = useDeleteVariant();

  const onEdit = useCallback((variant: Variant) => {
    setCurrentVariant(variant);
    setModalIsOpen(true);
  }, []);

  const onDelete = useCallback((variant: Variant) => {
    setCurrentVariant(variant);
    setDeleteModalIsOpen(true);
  }, []);

  const handleCreateVariant = () => {
    setCurrentVariant(null);
    setModalIsOpen(true);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  const handleDialogConfirmation = async () => {
    if (currentVariant) {
      await deleteVariantMutation.mutateAsync(currentVariant.id!.toString());
      setDeleteModalIsOpen(false);
      setCurrentVariant(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Variantes</h2>
        <Button
          className="ml-auto flex items-center gap-2"
          onClick={handleCreateVariant}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <CustomTable
        data={variants || []}
        columns={columns}
        isLoading={isLoading || deleteVariantMutation.isPending}
        globalFilter={{ search: "" }}
        error={!!error}
        sorting={[]}
        handleSorting={() => {}}
        pageIndex={0}
        setPageIndex={() => {}}
        globalFilterFn={() => true}
      />

      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          closeModal={() => {
            setCurrentVariant(null);
            setModalIsOpen(false);
          }}
          variant={currentVariant}
        />
      )}

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => {
          setCurrentVariant(null);
          setDeleteModalIsOpen(false);
        }}
        onContinueClick={handleDialogConfirmation}
        title={"¿Estás seguro de eliminar este usuario?"}
        description={"Esta acción no se puede deshacer."}
        cancelButtonText={"Cancelar"}
        continueButtonText={"Eliminar"}
      />
    </div>
  );
};

export { VariantsPanel };
