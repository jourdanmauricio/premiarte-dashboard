"use client";

import { useCallback, useMemo, useState } from "react";

import { CustomTable } from "@/components/ui/custom/CustomTable";
import { useDeleteUser, useGetUsers } from "@/hooks/use-users";
import { User } from "@/shared/types";
import { getColumns } from "@/components/settingsPage/panels/usersPanel/table/columns";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Modal } from "@/components/settingsPage/panels/usersPanel/Modal";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import { ModalChangePassword } from "@/components/settingsPage/panels/usersPanel/ModalChangePassword";

const UsersPanel = () => {
  const { data: users, isLoading, error } = useGetUsers();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);

  const deleteUserMutation = useDeleteUser();

  const onEdit = useCallback((user: User) => {
    setCurrentUser(user);
    setModalIsOpen(true);
  }, []);

  const onDelete = useCallback((user: User) => {
    setCurrentUser(user);
    setDeleteModalIsOpen(true);
  }, []);

  const handleCreateUser = () => {
    setCurrentUser(null);
    setModalIsOpen(true);
  };

  const onChangePassword = useCallback((user: User) => {
    setCurrentUser(user);
    setPasswordModalIsOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
        onChangePassword,
      }),
    [onEdit, onDelete, onChangePassword],
  );

  const handleDialogConfirmation = async () => {
    if (currentUser) {
      await deleteUserMutation.mutateAsync(currentUser.id!);
      setDeleteModalIsOpen(false);
      setCurrentUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <Button
          className="ml-auto flex items-center gap-2"
          onClick={handleCreateUser}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </div>
      <CustomTable
        data={users || []}
        columns={columns}
        isLoading={isLoading || deleteUserMutation.isPending}
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
            setCurrentUser(null);
            setModalIsOpen(false);
          }}
          user={currentUser}
        />
      )}

      {passwordModalIsOpen && (
        <ModalChangePassword
          open={passwordModalIsOpen}
          closeModal={() => {
            setCurrentUser(null);
            setPasswordModalIsOpen(false);
          }}
          user={currentUser}
        />
      )}

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => {
          setCurrentUser(null);
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

export { UsersPanel };
