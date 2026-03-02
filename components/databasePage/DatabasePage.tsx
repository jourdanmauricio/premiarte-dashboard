"use client";
import { getDatabaseBackupColumns } from "@/components/databasePage/table/columns";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import {
  useCreateDatabaseBackup,
  useGetDatabaseBackup,
} from "@/hooks/use-database";
import { SortingState } from "@tanstack/react-table";
import { Loader2, LoaderIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

const DatabasePage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [confirmDatabaseBackupIsOpen, setConfirmDatabaseBackupIsOpen] =
    useState(false);

  const { data, isLoading, error } = useGetDatabaseBackup();
  const createDatabaseBackupMutation = useCreateDatabaseBackup();

  const handleCreateDatabaseBackup = () => {
    createDatabaseBackupMutation.mutate();
  };

  const handleConfirmCreateDatabaseBackup = () => {
    setConfirmDatabaseBackupIsOpen(true);
  };

  const columns = getDatabaseBackupColumns();

  return (
    <div>
      <h2 className="text-3xl font-bold">Gestión de Backups</h2>

      <div className="flex items-center justify-end gap-2 mt-6">
        <div className="flex items-center gap-4">
          <Button variant="default" onClick={handleConfirmCreateDatabaseBackup}>
            <PlusIcon className="size-5" />
          </Button>
        </div>
      </div>

      <CustomTable
        data={data || []}
        columns={columns}
        isLoading={isLoading || createDatabaseBackupMutation.isPending}
        globalFilter={{}}
        error={!!error}
        sorting={sorting}
        handleSorting={setSorting}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        globalFilterFn={() => true}
        setRowSelection={() => {}}
        rowSelection={{}}
        getRowId={(row) => row.id?.toString() || ""}
      />

      {/* Modal de confirmación de eliminación */}
      {confirmDatabaseBackupIsOpen && (
        <CustomAlertDialog
          title="Crear backup de la base de datos"
          description={`¿Estás seguro de querer crear un backup de la base de datos? Este proceso puede tardar varios minutos.`}
          cancelButtonText="Cancelar"
          continueButtonText="Crear"
          onContinueClick={handleCreateDatabaseBackup}
          open={confirmDatabaseBackupIsOpen}
          onCloseDialog={() => {
            setConfirmDatabaseBackupIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export { DatabasePage };
