import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import type { Variation } from "@/shared/types";

type DataTableColumnsProps = {
  onEdit: (variant: Variation, index: number) => void;
  onDelete: (variant: Variation, index: number) => void;
};

export const getVariationColumns = ({
  onEdit,
  onDelete,
}: DataTableColumnsProps): ColumnDef<Variation>[] => [
  {
    accessorKey: "sku",
    header: "SKU",
    size: 200,
    minSize: 120,
    cell: ({ row }) => row.original.sku ?? "-",
  },
  {
    accessorKey: "retailPrice",
    header: "PRECIO DE VENTA",
    size: 200,
    minSize: 120,
    cell: ({ row }) => row.original.retailPrice ?? "-",
  },
  {
    accessorKey: "wholesalePrice",
    header: "PRECIO MAYORISTA",
    size: 200,
    minSize: 120,
    cell: ({ row }) => row.original.wholesalePrice ?? "-",
  },
  {
    accessorKey: "values",
    header: "VALORES",
    size: 300,
    minSize: 150,
    cell: ({ row }) => {
      const values = row.original.values;
      if (!values?.length) return "-";
      return values.map((v) => v.value).join(", ");
    },
  },
  {
    id: "actions",
    header: "ACCIONES",
    size: 120,
    minSize: 120,
    maxSize: 120,
    cell: ({ row }) => {
      const variant = row.original;
      const index = row.index;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(variant, index)}
            className="h-8 w-8 p-0 hover:bg-blue-50"
          >
            <EditIcon className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(variant, index)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
