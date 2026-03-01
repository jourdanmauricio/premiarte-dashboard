import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, KeyRound, Trash2Icon } from "lucide-react";
import { TruncatedCell } from "@/components/ui/custom/truncatedCell";
import { User } from "@/shared/types";

type DataTableColumnsProps = {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onChangePassword: (user: User) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
  onChangePassword,
}: DataTableColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "NOMBRE",
    size: 0,
    minSize: 300,
    maxSize: 400,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.name} linesMax={2} />;
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    size: 0,
    minSize: 300,
    maxSize: 1000,
    cell: ({ row }) => {
      const user = row.original;
      return <TruncatedCell value={user.email} linesMax={2} />;
    },
  },
  {
    id: "actions",
    header: "ACCIONES",
    size: 0,
    minSize: 150,
    maxSize: 150,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="h-8 w-8 p-0 hover:bg-blue-50"
          >
            <EditIcon className="h-4 w-4 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangePassword(user)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <KeyRound className="h-4 w-4 text-orange-300" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
