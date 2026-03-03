import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import { TruncatedCell } from "@/components/ui/custom/truncatedCell";
import { Variant } from "@/shared/types";

type DataTableColumnsProps = {
  onEdit: (variant: Variant) => void;
  onDelete: (variant: Variant) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: DataTableColumnsProps): ColumnDef<Variant>[] => [
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
    accessorKey: "options",
    header: "OPCIONES",
    size: 0,
    minSize: 300,
    maxSize: 1000,
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <TruncatedCell
          value={variant.values.map((value) => value.value).join(", ")}
          linesMax={2}
        />
      );
    },
  },
  {
    id: "actions",
    header: "ACCIONES",
    size: 0,
    minSize: 150,
    maxSize: 150,
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(variant)}
            className="h-8 w-8 p-0 hover:bg-blue-50"
          >
            <EditIcon className="h-4 w-4 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(variant)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
