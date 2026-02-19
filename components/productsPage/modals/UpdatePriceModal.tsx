import z from "zod";
import { useForm } from "react-hook-form";
import { PercentIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { operationsList } from "@/shared/constanst";
import Dropdown from "@/components/ui/custom/dropdown";
import InputNumberField from "@/components/ui/custom/input-number-field";
import { toast } from "sonner";
// import { productsService } from "@/lib/services/productsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import { useUpdatePricesProduct } from "@/hooks/use-products";

interface UpdatePriceModalProps {
  open: boolean;
  closeModal: () => void;
  products: string[];
}

const ProductFromSchema = z.object({
  percentage: z.string().min(1, { message: "Requerido" }),
  products: z.array(z.string()),
  operation: z.enum(["add", "subtract"], {
    message: "Requerido",
  }),
});

const UpdatePriceModal = ({
  open,
  closeModal,
  products,
}: UpdatePriceModalProps) => {
  const form = useForm<z.infer<typeof ProductFromSchema>>({
    resolver: zodResolver(ProductFromSchema),
    defaultValues: {
      percentage: "",
      products,
      operation: "add",
    },
  });

  const updatePricesProductMutation = useUpdatePricesProduct();

  const onSubmit = async (data: z.infer<typeof ProductFromSchema>) => {
    const productData = {
      products: data.products.map((product) => parseInt(product)),
      percentage: parseInt(data.percentage),
      operation: data.operation,
    };

    await updatePricesProductMutation.mutateAsync(productData);
    closeModal();
  };

  const onError = () => console.log("errors", form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Actualizar precios</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
              <div className="grid grid-cols-2 gap-4">
                <InputNumberField
                  label="Porcentaje"
                  name="percentage"
                  placeholder="Porcentaje"
                  form={form}
                  integerDigits={3}
                  icon={<PercentIcon className="h-4 w-4 text-neutral-500" />}
                  className="gap-0"
                />
                <Dropdown
                  label="Operación"
                  name="operation"
                  placeholder="Seleccione..."
                  form={form}
                  list={operationsList}
                />
              </div>

              <div className="flex justify-end gap-8 pt-10">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[150px]"
                  onClick={closeModal}
                  disabled={updatePricesProductMutation.isPending}
                >
                  Cancelar
                </Button>
                <SubmitButton
                  className="min-w-[150px]"
                  type="submit"
                  text="Actualizar precios"
                  disabled={updatePricesProductMutation.isPending}
                  isLoading={updatePricesProductMutation.isPending}
                >
                  {updatePricesProductMutation.isPending
                    ? "Actualizando..."
                    : "Actualizar precios"}
                </SubmitButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { UpdatePriceModal };
