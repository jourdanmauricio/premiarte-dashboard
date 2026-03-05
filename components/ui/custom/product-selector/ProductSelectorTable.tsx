import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  type RowSelectionState,
  type Updater,
  useReactTable,
} from "@tanstack/react-table";
import { LoaderIcon } from "lucide-react";
import {
  useFormContext,
  type UseFormReturn,
  FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

import type { Product } from "@/shared/types";
import { cn } from "@/lib/utils";

interface ProductSelectorTableProps<TData extends FieldValues, TValue> {
  data: Product[];
  columns: ColumnDef<Product, TValue>[];
  isLoading: boolean;
  form: UseFormReturn<TData>;
  nameSchema: Path<TData>;
  labelClassName?: string;
  className?: string;
}

export function ProductSelectorTable<TData extends FieldValues, TValue>({
  data,
  columns,
  isLoading,
  form,
  nameSchema,
  className,
}: ProductSelectorTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(nameSchema, formState);

  const globalFilterFn: FilterFn<Product> = (row, columnId, filterValue) => {
    const value = filterValue as string;

    if (typeof value !== "string" || value.length === 0) {
      return true;
    }

    const cellValue = row.getValue(columnId);

    return cellValue != null && columnId === "canPrint"
      ? value === "-99"
        ? true
        : cellValue.toString() === value
      : false;
  };

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id?.toString() || "",
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection:
        form
          .getValues(nameSchema)
          ?.reduce((acc: { [key: string]: boolean }, id: string) => {
            acc[id] = true;
            return acc;
          }, {}) || {},
      columnVisibility: {
        canPrint: false,
      },
    },
    globalFilterFn,
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      setRowSelection(updater); // Actualiza el estado de selección de filas

      const newRowSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      const selectedIds = Object.keys(newRowSelection)
        .filter((id) => newRowSelection[id])
        .map((id) => parseInt(id, 10)); // Convertir strings a numbers

      form.setValue(nameSchema, selectedIds as PathValue<TData, Path<TData>>, {
        shouldDirty: true,
      });
      form.clearErrors(nameSchema);
      if (form.formState.isSubmitted) form.trigger(nameSchema);
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const initialSelectedIds = form.getValues(nameSchema) || [];
      const initialRowSelection = initialSelectedIds.reduce(
        (acc: { [key: string]: boolean }, id: string) => {
          acc[id] = true;
          return acc;
        },
        {},
      );
      setRowSelection(initialRowSelection);
    }
  }, [form]);

  const { rows } = table.getRowModel();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 25,
    getScrollElement: () => tableContainerRef.current,
    overscan: 3,
  });

  return (
    <div
      className={cn(
        `relative mt-4 h-full rounded-md border ${!fieldState.invalid ? "border-neutral-50" : "border-destructive"}`,
        className,
      )}
    >
      {/* Header fijo */}
      <div className="sticky top-0 z-10 rounded-t-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="flex h-[32px]! items-center text-base"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>

      {/* Body con scroll */}
      <div
        className="overflow-auto"
        style={{ height: 400, willChange: "transform" }}
        ref={tableContainerRef}
      >
        <Table>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="absolute flex w-[90%] justify-center pt-4">
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody
              className="relative"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().length > 0 ? (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index] as Row<Product>;
                  return (
                    <TableRow
                      key={row.id}
                      className="absolute flex h-[25px]! w-full border-y-0 bg-transparent"
                      style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="flex h-[25px]! items-center text-base py-1"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="absolute flex w-full">
                  <TableCell colSpan={2} className="w-full text-center">
                    Sin resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}
