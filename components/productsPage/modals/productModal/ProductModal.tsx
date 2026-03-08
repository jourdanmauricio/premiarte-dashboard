import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { Product } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import useProductModal from "@/components/productsPage/modals/productModal/useProductModal";
import { ProductTabs } from "@/components/productsPage/modals/productModal/ProductTabs";

interface ProductModalProps {
  open: boolean;
  closeModal: () => void;
  product: Product | null;
}

const ProductModal = ({ open, closeModal, product }: ProductModalProps) => {
  const {
    mode,
    form,
    createProductMutation,
    updateProductMutation,
    onSubmit,
    onError,
    handlePriceChange,
  } = useProductModal(product, closeModal);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="h-[90vh]"
        style={{
          minWidth: "600px",
          maxWidth: "900px",
        }}
      >
        <div
          style={{ minWidth: "600px" }}
          className="flex h-full min-h-0 flex-col overflow-hidden"
        >
          <DialogHeader className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <DialogTitle className="dialog-title">
              {mode === "CREATE"
                ? "Nuevo producto"
                : `Editar producto ${form.watch("name")}`}
            </DialogTitle>
            <DialogDescription />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <ProductTabs
                  form={form}
                  handlePriceChange={handlePriceChange}
                  className="flex-1"
                />

                <div className="col-span-2 mt-auto flex shrink-0 justify-end gap-8 pt-10">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                    className="min-w-[150px]"
                  >
                    Cancelar
                  </Button>
                  <SubmitButton
                    text={mode === "CREATE" ? "Crear producto" : "Guardar"}
                    className="min-w-[150px]"
                    isLoading={
                      createProductMutation.isPending ||
                      updateProductMutation.isPending
                    }
                    disabled={
                      createProductMutation.isPending ||
                      updateProductMutation.isPending ||
                      !form.formState.isDirty
                    }
                  />
                </div>
              </form>
            </Form>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ProductModal };
