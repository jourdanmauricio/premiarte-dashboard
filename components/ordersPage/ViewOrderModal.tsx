import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orderStatusList } from "@/shared/constanst";
import type { OrderItem, OrderWithItems } from "@/shared/types";
import { useGetOrderById } from "@/hooks/use-orders";
import { Loader2 } from "lucide-react";

interface ViewOrderModalProps {
  open: boolean;
  closeModal: () => void;
  orderId: number | null;
}

const formatVariation = (item: OrderItem) => {
  if (item.variantId == null) return "-";
  if (item.values?.length) return item.values.join(", ");
  return "-";
};

const ViewOrderModal = ({ open, closeModal, orderId }: ViewOrderModalProps) => {
  const { data: order, isLoading } = useGetOrderById(
    orderId?.toString() ?? "",
    open && orderId != null,
  );

  if (!open) return null;

  const handlePrint = () => {
    if (!order) return;
    const statusLabel =
      orderStatusList.find((s) => s.id === order.status)?.description ?? "-";
    const content = `
Pedido #${order.id}
Nombre: ${order.customer?.name ?? order.name ?? "-"}
Email: ${order.customer?.email ?? order.email ?? "-"}
Teléfono: ${order.customer?.phone ?? order.phone ?? "-"}
Estado: ${statusLabel}
Tipo: ${order.type === "wholesale" ? "Mayorista" : "Minorista"}
Fecha de creación: ${new Date(order.createdAt).toLocaleDateString()}
Observación: ${order.observation || "-"}
${(order.items ?? [])
  .map(
    (item) => `
Producto: ${item.name ?? item.product?.name ?? "-"}
Variación: ${formatVariation(item)}
Cantidad: ${item.quantity}
Precio: ${item.price}
Total: ${item.amount}
Observación: ${item.observation || "-"}
`,
  )
  .join("\n")}
Total: ${order.totalAmount}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido-${order.id}-${order.customer?.name ?? order.name ?? "cliente"}-${new Date(order.createdAt).toLocaleDateString("es-ES").replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[95%] max-w-4xl sm:max-w-7xl overflow-y-auto overflow-x-hidden w-full"
      >
        <DialogHeader>
          <DialogTitle>
            {orderId != null ? `Pedido #${orderId}` : "Pedido"}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : order ? (
          <>
            <OrderInfoCard order={order} />
            <ItemsTable order={order} formatVariation={formatVariation} />
            <TotalCard order={order} />
            <div className="flex justify-end gap-8 pt-10">
              <Button
                type="button"
                onClick={closeModal}
                variant="outline"
                className="min-w-[150px]"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handlePrint}
                variant="default"
                className="min-w-[150px]"
              >
                Imprimir
              </Button>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground py-4">
            No se pudo cargar el pedido.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

function OrderInfoCard({ order }: { order: OrderWithItems }) {
  const statusLabel =
    orderStatusList.find((s) => s.id === order.status)?.description ?? "-";
  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        Nombre
        <span className="text-sm">
          {order.customer?.name ?? order.name ?? "-"}
        </span>
        Email
        <span className="text-sm">
          {order.customer?.email ?? order.email ?? "-"}
        </span>
        Teléfono
        <span className="text-sm">
          {order.customer?.phone ?? order.phone ?? "-"}
        </span>
        Estado
        <span className="text-sm">{statusLabel}</span>
        Tipo
        <span className="text-sm">
          {order.type === "wholesale" ? "Mayorista" : "Minorista"}
        </span>
        Fecha de creación
        <span className="text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
        Observación
        <span className="text-sm">{order.observation || "-"}</span>
      </div>
    </Card>
  );
}

function ItemsTable({
  order,
  formatVariation,
}: {
  order: OrderWithItems;
  formatVariation: (item: OrderItem) => string;
}) {
  const items = order.items ?? [];
  return (
    <Card className="p-4 overflow-hidden min-w-0">
      <div className="w-full overflow-hidden overflow-y-auto max-h-[min(50vh,400px)]">
        <Table className="table-fixed w-full">
          <TableHeader className="[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-card [&_th]:shadow-[0_1px_0_0_hsl(var(--border))]">
            <TableRow>
              <TableHead className="w-[35%]">Producto</TableHead>
              <TableHead className="w-[12%]">Variación</TableHead>
              <TableHead className="w-[8%]">Cantidad</TableHead>
              <TableHead className="w-[12%]">Precio</TableHead>
              <TableHead className="w-[12%]">Total</TableHead>
              <TableHead className="w-[21%]">Observación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[35%] whitespace-normal wrap-break-word align-top">
                  {item.name ?? item.product?.name ?? "-"}
                  {item.product?.description != null && (
                    <>
                      <br />
                      <span className="text-muted-foreground">
                        {item.product.description}
                      </span>
                    </>
                  )}
                  {item.customText != null && (
                    <>
                      <br />
                      <span className="text-muted-foreground">
                        Texto personalizado: {item.customText}
                      </span>
                    </>
                  )}
                </TableCell>
                <TableCell className="w-[12%] whitespace-normal wrap-break-word align-top">
                  {formatVariation(item)}
                </TableCell>
                <TableCell className="w-[8%] text-right">
                  {item.quantity}
                </TableCell>
                <TableCell className="w-[12%] text-right">
                  {item.price}
                </TableCell>
                <TableCell className="w-[12%] text-right">
                  {item.amount}
                </TableCell>
                <TableCell className="w-[21%]">
                  {item.observation || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function TotalCard({ order }: { order: OrderWithItems }) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <span className="text-sm">Total</span>
        <span className="text-sm">{order.totalAmount}</span>
      </div>
    </Card>
  );
}

export { ViewOrderModal };
