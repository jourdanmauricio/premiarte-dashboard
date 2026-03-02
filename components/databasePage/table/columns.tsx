import { type ColumnDef } from "@tanstack/react-table";
import type { DatabaseBackup } from "@/shared/types";
import { format } from "date-fns";

export const getDatabaseBackupColumns = (): ColumnDef<DatabaseBackup>[] => [
  {
    accessorKey: "createdAt",
    header: "FECHA",
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const databaseBackup = row.original;
      return (
        <span>{format(new Date(databaseBackup.createdAt), "dd/MM/yyyy")}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "ESTADO",
    size: 100,
    minSize: 80,
    cell: ({ row }) => {
      const databaseBackup = row.original;
      return <span>{databaseBackup.status}</span>;
    },
  },
  {
    accessorKey: "triggeredBy",
    header: "TRIGGERED BY",
    size: 200,
    minSize: 150,
    cell: ({ row }) => {
      const databaseBackup = row.original;
      return <span>{databaseBackup.triggeredBy}</span>;
    },
  },
  {
    accessorKey: "message",
    header: "MENSAJE",
    size: 0,
    minSize: 200,
    maxSize: 500,
    cell: ({ row }) => {
      const databaseBackup = row.original;
      return <span>{databaseBackup.message}</span>;
    },
  },
];
