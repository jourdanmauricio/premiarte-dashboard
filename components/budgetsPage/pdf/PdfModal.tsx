import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { PDF } from "./PDF";
import type { Budget, Responsible } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useGetCustomerById } from "@/hooks/use-customers";
import { useGetResponsibleById } from "@/hooks/use-responsibles";

interface PdfModalProps {
  open: boolean;
  closeModal: () => void;
  budget: Budget;
}

const PdfModal = ({ open, closeModal, budget }: PdfModalProps) => {
  const { data: responsible } = useGetResponsibleById(budget.responsibleId);
  const { data: customerData } = useGetCustomerById(
    budget.customerId.toString(),
  );

  if (!budget || !responsible || !customerData) return null;

  // Generar nombre del archivo personalizado
  const fileName = `Presupuesto_${budget.name}_${new Date(budget.createdAt).toLocaleDateString("es-ES").replace(/\//g, "-")}.pdf`;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="max-h-[95%] sm:max-w-7xl h-full overflow-y-auto w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="dialog-title">{`Presupuesto: ${budget.customer?.name}`}</DialogTitle>
          <DialogDescription />

          <PDFViewer className="h-full" showToolbar={false}>
            <PDF
              budget={budget}
              responsible={responsible as unknown as Responsible}
              customerData={customerData}
            />
          </PDFViewer>
          <div className="flex justify-end gap-8 mt-8">
            <PDFDownloadLink
              document={
                <PDF
                  budget={budget}
                  responsible={responsible as unknown as Responsible}
                  customerData={customerData}
                />
              }
              fileName={fileName}
            >
              {({ loading }) => (
                <Button disabled={loading} className="gap-2">
                  <Download className="h-4 w-4" />
                  {loading ? "Generando PDF..." : "Descargar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button variant="default" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { PdfModal };
