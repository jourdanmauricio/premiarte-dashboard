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
import { Budget, BudgetItem } from "@/shared/types/budget";

interface ViewBudgetModalProps {
  open: boolean;
  closeModal: () => void;
  budget: Budget;
}

const ViewBudgetModal = ({
  open,
  closeModal,
  budget,
}: ViewBudgetModalProps) => {
  if (!budget) return null;

  const formatVariation = (item: BudgetItem) => {
    if (item.variantId == null) return "-";
    if (item.values?.length) return item.values.join(", ");
    return "-";
  };

  const handlePrint = () => {
    // window.print();
    // Megustaria imprimir el presupuesto en un txt con el contenido del presupuesto

    const content = `
    Nombre: ${budget.customer?.name}
    Email: ${budget.customer?.email || "-"}
    Telefono: ${budget.customer?.phone || "-"}
    Fecha de creación: ${new Date(budget.createdAt).toLocaleDateString()}
    Observación: ${budget.observation || "-"}
    ${budget.items
      ?.map(
        (item) => `
    Producto: ${item.product.name}
    Variación: ${formatVariation(item)}
    Cantidad: ${item.quantity}
    Precio: ${item.price}
    Total: ${item.amount}
    Observación: ${item.observation || "-"}
    `,
      )
      .join("\n")}
    
    Total: ${budget.totalAmount}
    `;

    console.log(content);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presupuesto-${budget.number}-${budget.customer?.name}-${new Date(budget.createdAt).toLocaleDateString("es-ES").replace(/\//g, "-")}.txt`;
    a.click();
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
          <DialogTitle>Presupuesto {budget.number}</DialogTitle>
        </DialogHeader>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            Nombre
            <span className="text-sm">{budget.customer?.name}</span>
            Email
            <span className="text-sm">{budget.customer?.email || "-"}</span>
            Telefono
            <span className="text-sm">{budget.customer?.phone || "-"}</span>
            Fecha de creación
            <span className="text-sm">
              {new Date(budget.createdAt).toLocaleDateString()}
            </span>
            Observación
            <span className="text-sm">{budget.observation || "-"}</span>
          </div>
        </Card>
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
                {budget.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-[35%] whitespace-normal wrap-break-word align-top">
                      {item.product.name}
                      <br />
                      <span className="text-muted-foreground">
                        {item.product.description}
                      </span>
                    </TableCell>
                    <TableCell className="w-[12%] whitespace-normal wrap-break-word align-top">
                      {formatVariation(item)}
                    </TableCell>
                    <TableCell className="w-[8%] text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="w-[12%] text-right">{item.price}</TableCell>
                    <TableCell className="w-[12%] text-right">{item.amount}</TableCell>
                    <TableCell className="w-[21%]">{item.observation || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <span className="text-sm">Total</span>
            <span className="text-sm">{budget.totalAmount}</span>
          </div>
        </Card>

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
            onClick={() => handlePrint()}
            variant="default"
            className="min-w-[150px]"
          >
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewBudgetModal };
