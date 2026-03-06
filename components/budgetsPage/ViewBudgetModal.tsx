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
import { Budget } from "@/shared/types/budget";

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
        className="max-h-[95%] max-w-4xl sm:max-w-7xl overflow-y-auto w-full"
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
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Observación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product.name}
                    <br />
                    {item.product.description}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.observation || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
