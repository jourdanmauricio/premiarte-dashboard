"use client";

import { useCallback, useMemo, useState } from "react";

import { CustomTable } from "@/components/ui/custom/CustomTable";
import { Variation } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Modal } from "@/components/settingsPage/panels/variationsPanel/Modal";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { useDeleteVariation, useGetVariations } from "@/hooks/use-variations";
import { getColumns } from "@/components/settingsPage/panels/variationsPanel/table/columns";

const VariationsPanel = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentVariation, setCurrentVariation] = useState<Variation | null>(
    null,
  );
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { data: variations, isLoading, error } = useGetVariations();
  const deleteVariationMutation = useDeleteVariation();

  console.log("variations", variations);

  const onEdit = useCallback((variation: Variation) => {
    setCurrentVariation(variation);
    setModalIsOpen(true);
  }, []);

  const onDelete = useCallback((variation: Variation) => {
    setCurrentVariation(variation);
    setDeleteModalIsOpen(true);
  }, []);

  const handleCreateVariant = () => {
    setCurrentVariation(null);
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
    if (currentVariation) {
      await deleteVariationMutation.mutateAsync(
        currentVariation.id!.toString(),
      );
      setDeleteModalIsOpen(false);
      setCurrentVariation(null);
    }
  };

  return (
    <div className="space-y-6 mt-20">
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
        data={variations || []}
        columns={columns}
        isLoading={isLoading || deleteVariationMutation.isPending}
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
            setCurrentVariation(null);
            setModalIsOpen(false);
          }}
          variation={currentVariation}
        />
      )}

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => {
          setCurrentVariation(null);
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

export { VariationsPanel };
