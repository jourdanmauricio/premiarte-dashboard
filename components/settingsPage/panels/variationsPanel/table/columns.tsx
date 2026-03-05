import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import { TruncatedCell } from "@/components/ui/custom/truncatedCell";
import { Variation } from "@/shared/types";

type DataTableColumnsProps = {
  onEdit: (variation: Variation) => void;
  onDelete: (variation: Variation) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: DataTableColumnsProps): ColumnDef<Variation>[] => [
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
    accessorKey: "values",
    header: "VALORES",
    size: 0,
    minSize: 300,
    maxSize: 1000,
    cell: ({ row }) => {
      const variation = row.original;
      return (
        <TruncatedCell
          value={variation.values.map((value) => value.value).join(", ")}
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
      const variation = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(variation)}
            className="h-8 w-8 p-0 hover:bg-blue-50"
          >
            <EditIcon className="h-4 w-4 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(variation)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
