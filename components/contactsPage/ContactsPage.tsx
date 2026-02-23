"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Contact } from "@/shared/types";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import CustomAlertDialog from "@/components/ui/custom/custom-alert-dialog";
import type { Row, SortingState } from "@tanstack/react-table";
import { useDeleteContact, useGetContacts } from "@/hooks/use-contacts";
import { ContactFilter } from "@/components/contactsPage/table/ContactFilter";
import { getContactColumns } from "@/components/contactsPage/table/columns";
import { ContactModal } from "@/components/contactsPage/ContactModal";

const ContactsPage = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<{ search: string }>({
    search: "",
  });

  const { data, isLoading, error } = useGetContacts();
  const deleteContactMutation = useDeleteContact();

  const handleDeleteContact = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setDeleteModalIsOpen(true);
  }, []);

  const handleViewContact = useCallback((contact: Contact) => {
    setCurrentContact(contact);
    setContactModalIsOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (currentContact !== null) {
      deleteContactMutation.mutate(currentContact.id.toString());
    }
  }, [currentContact, deleteContactMutation]);

  const columns = useMemo(
    () =>
      getContactColumns({
        onDelete: handleDeleteContact,
        onView: handleViewContact,
      }),
    [handleDeleteContact, handleViewContact],
  );

  const handleDownload = () => {
    if (!data || data.length === 0) {
      toast.error("No hay contactos para descargar");
      return;
    }
    try {
      // Preparar datos para Excel (solo campos simples, sin categorías, imágenes ni descuentos)
      const excelData = data.map((contact) => ({
        Id: contact.id,
        Nombre: contact.name,
        Email: contact.email,
        Telefono: contact.phone,
        Mensaje: contact.message,
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
      XLSX.utils.book_append_sheet(wb, ws, "Contactos");

      // Generar archivo y descargar
      const fileName = `contactos-${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Clientes descargados exitosamente");
    } catch {
      toast.error("Error al descargar los clientes");
    }
  };

  const globalFilterFn = (row: Row<Contact>) => {
    const contact = row.original as Contact;
    if (Object.keys(globalFilter).length === 0) return true;

    if (Object.values(globalFilter).every((value) => value === "")) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesSearch = true;

    // Si hay filtro de búsqueda, verificar que coincida en nombre o SKU
    if (globalFilter.search && globalFilter.search !== "") {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm) ||
        contact.phone?.toLowerCase().includes(searchTerm) ||
        contact.message?.toLowerCase().includes(searchTerm) ||
        false;
    }

    // Solo retorna true si ambas condiciones se cumplen
    return matchesSearch;
  };

  return (
    <>
      <div className="rounded-lg shadow-md py-6 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold ">Gestión de Contactos</h2>

          <div className="flex items-center gap-4">
            <ContactFilter
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
          isLoading={isLoading || deleteContactMutation.isPending}
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
      {deleteModalIsOpen && currentContact !== null && (
        <CustomAlertDialog
          title="Eliminar contacto"
          description={`¿Estás seguro de querer eliminar el contacto "${currentContact.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          continueButtonText="Eliminar"
          onContinueClick={handleConfirmDelete}
          open={deleteModalIsOpen}
          onCloseDialog={() => {
            setDeleteModalIsOpen(false);
            setCurrentContact(null);
          }}
        />
      )}

      {contactModalIsOpen && currentContact !== null && (
        <ContactModal
          open={contactModalIsOpen}
          closeModal={() => {
            setContactModalIsOpen(false);
            setCurrentContact(null);
          }}
          contact={currentContact}
        />
      )}
    </>
  );
};

export { ContactsPage };
