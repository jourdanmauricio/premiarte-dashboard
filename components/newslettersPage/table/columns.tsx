import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { TruncatedCell } from "@/components/ui/custom/truncatedCell";
import type { Newsletter } from "@/shared/types";

type DataTableColumnsProps = {
  onDelete: (newsletter: Newsletter) => void;
};

export const getNewsletterColumns = ({
  onDelete,
}: DataTableColumnsProps): ColumnDef<Newsletter>[] => [
  {
    accessorKey: "name",
    header: "NOMBRE",
    size: 0,
    minSize: 200,
    cell: ({ row }) => {
      const contact = row.original;
      return <TruncatedCell value={contact.name} linesMax={2} />;
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    size: 0,
    minSize: 250,
    cell: ({ row }) => (
      <TruncatedCell value={row.original.email} linesMax={2} />
    ),
  },

  {
    id: "actions",
    header: "ACCIONES",
    size: 120,
    minSize: 120,
    maxSize: 120,
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
