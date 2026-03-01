"use client";

import { PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Responsible } from "@/shared/types";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { ResponsibleModal } from "@/components/settingsPage/panels/responsiblesPanel/ResponsibleModal";
import { getResponsibleColumns } from "@/components/settingsPage/panels/responsiblesPanel/table/columns";
import {
  useDeleteResponsible,
  useGetResponsibles,
} from "@/hooks/use-responsibles";

const ResponsiblesPanel = () => {
  const [currentResponsible, setCurrentResponsible] =
    useState<Responsible | null>(null);
  const [responsibleModalIsOpen, setResponsibleModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { data, error, isLoading } = useGetResponsibles();
  const deleteResponsibleMutation = useDeleteResponsible();

  const handleAddResponsible = () => {
    setCurrentResponsible(null);
    setResponsibleModalIsOpen(true);
  };

  const onEdit = useCallback((responsible: Responsible) => {
    setCurrentResponsible(responsible);
    setResponsibleModalIsOpen(true);
  }, []);

  const onDelete = useCallback((responsible: Responsible) => {
    setCurrentResponsible(responsible);
    setDeleteModalIsOpen(true);
  }, []);

  const handleConfirmDeleteResponsible = () => {
    if (currentResponsible?.id) {
      deleteResponsibleMutation.mutate(currentResponsible.id.toString());
    }
  };

  const columns = useMemo(
    () =>
      getResponsibleColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Responsables</h2>
        <Button variant="default" onClick={handleAddResponsible}>
          <PlusIcon className="size-5" />
        </Button>
      </div>
      <CustomTable
        data={data || []}
        columns={columns}
        isLoading={isLoading || deleteResponsibleMutation.isPending}
        globalFilter={""}
        error={!!error}
        sorting={[]}
        pageIndex={0}
        globalFilterFn={() => true}
        handleSorting={() => {}}
        setPageIndex={() => {}}
      />

      {responsibleModalIsOpen && (
        <ResponsibleModal
          open={responsibleModalIsOpen}
          closeModal={() => setResponsibleModalIsOpen(false)}
          responsible={currentResponsible}
        />
      )}
      {deleteModalIsOpen && (
        <CustomAlertDialog
          title="Eliminar responsable"
          description={`¿Estás seguro de querer eliminar el responsable "${currentResponsible?.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText={
            deleteResponsibleMutation.isPending ? "Eliminando..." : "Eliminar"
          }
          onContinueClick={handleConfirmDeleteResponsible}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            if (!deleteResponsibleMutation.isPending) {
              setDeleteModalIsOpen(false);
              setCurrentResponsible(null);
            }
          }}
        />
      )}
    </div>
  );
};

export { ResponsiblesPanel };
