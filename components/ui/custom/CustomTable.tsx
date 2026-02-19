import { useEffect } from "react";
import { ArrowDown, ArrowUp, LoaderIcon } from "lucide-react";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type FilterFn,
  getFilteredRowModel,
  getPaginationRowModel,
  type Table as TableType,
  RowSelectionState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PaginationClient } from "@/components/ui/custom/paginator-client";

type Props<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  globalFilter: string | { [key: string]: string };
  error: boolean;
  sorting: SortingState;
  pageIndex: number;
  globalFilterFn: FilterFn<TData>;
  rowSelection?: RowSelectionState;
  handleSorting: OnChangeFn<SortingState>;
  setPageIndex: (value: number) => void;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  getRowId?: (row: TData) => string;
  onTableInstanceReady?: (table: TableType<TData>) => void;
};

function CustomTable<TData, TValue>({
  data,
  columns,
  isLoading,
  globalFilter,
  error,
  sorting,
  pageIndex,
  rowSelection,
  handleSorting,
  setPageIndex,
  setRowSelection,
  globalFilterFn,
  getRowId,
  onTableInstanceReady,
}: Props<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFn,
    getRowId: getRowId,
    state: {
      rowSelection,
      sorting,
      globalFilter: globalFilter,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
  });

  // Exponer la instancia de la tabla al componente padre
  useEffect(() => {
    if (onTableInstanceReady) {
      onTableInstanceReady(table);
    }
  }, [table, onTableInstanceReady]);

  const hasData = table.getRowModel().rows?.length > 0;
  const hasError = Boolean(error);

  const height = Math.max(table.getRowModel().rows?.length * 48 + 45, 84);

  return (
    <>
      <div className="mt-8 flex min-h-[84px] w-full flex-col overflow-y-hidden">
        <ScrollArea
          className="m-0 w-full p-0"
          style={{ height: `${height}px` }}
          type="auto"
        >
          <Table className="m-0 w-full p-0" style={{ height: `${height}px` }}>
            <TableHeader className="bg-muted w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="flex h-[36px] w-full items-center"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size,
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                          flexGrow: !header.column.columnDef.size ? 1 : 0,
                        }}
                        className="flex w-full items-center px-4 text-xs font-bold"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "relative cursor-pointer select-none"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <span className="absolute top-0">
                              {{
                                asc: <ArrowUp className="h-4 w-4" />,
                                desc: <ArrowDown className="h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </span>
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow className="flex h-[48px] w-full">
                  <TableCell colSpan={columns.length} className="w-full">
                    <div className="flex h-full items-center justify-center pt-4">
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && hasError && (
                <TableRow className="flex h-[48px] w-full">
                  <TableCell colSpan={columns.length} className="mx-auto h-24">
                    <span className="text-xl font-medium">
                      Error al recuperar los datos
                    </span>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !hasError && !hasData && (
                <TableRow className="flex h-[48px] w-full">
                  <TableCell colSpan={columns.length} className="mx-auto h-24">
                    <span className="text-xl font-medium">Sin resultados</span>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !hasError &&
                hasData &&
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      className="flex h-[48px] w-full items-center"
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            className="flex w-full px-4 py-0 text-sm break-words whitespace-normal"
                            style={{
                              minWidth: cell.column.columnDef.minSize,
                              maxWidth: cell.column.columnDef.maxSize,
                              width: cell.column.columnDef.size,
                              flexGrow: !cell.column.columnDef.size ? 1 : 0,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {isLoading === false && data.length > 0 && (
          <div className="mt-4 ml-auto">
            <PaginationClient
              totalPages={table.getPageCount()}
              currentPage={pageIndex + 1}
              setPageIndex={(page) => setPageIndex(page - 1)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export { CustomTable };
