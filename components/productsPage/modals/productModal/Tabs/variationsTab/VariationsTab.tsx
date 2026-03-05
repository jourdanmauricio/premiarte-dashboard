import type z from "zod";

import InputNumberField from "@/components/ui/custom/input-number-field";
import { InputField } from "@/components/ui/custom/input-field";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "@/shared/schemas";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import { getVariationColumns } from "@/components/productsPage/modals/productModal/Tabs/variationsTab/table/columns";
import { useCallback, useMemo, useState } from "react";
import type { Variation } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { VariationFormModal } from "@/components/productsPage/modals/productModal/Tabs/variationsTab/VariationFormModal";
import { CustomConfirmDialog } from "@/components/ui/custom/custom-confirm-dialog";

interface VariationsTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
  handlePriceChange: (
    fieldName: "retailPrice" | "wholesalePrice",
  ) => (value: string) => void;
}

type VariationFormItem = z.infer<typeof ProductFormSchema>["variants"][number];

const VariationsTab = ({ form, handlePriceChange }: VariationsTabProps) => {
  const variants = form.watch("variants") ?? [];

  console.log("variants", form.getValues());
  const data: Variation[] = variants.map((v: VariationFormItem) => ({
    id: v.id,
    sku: v.sku,
    retailPrice: v.retailPrice ? parseFloat(v.retailPrice) : undefined,
    wholesalePrice: v.wholesalePrice ? parseFloat(v.wholesalePrice) : undefined,
    values: v.values ?? [],
  }));

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variation | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<{
    variant: Variation;
    index: number;
  } | null>(null);

  const openCreate = useCallback(() => {
    setEditingVariant(null);
    setEditingIndex(null);
    setFormModalOpen(true);
  }, []);

  const onEdit = useCallback((variant: Variation, index: number) => {
    setEditingVariant(variant);
    setEditingIndex(index);
    setFormModalOpen(true);
  }, []);

  const onDelete = useCallback((variant: Variation, index: number) => {
    setVariantToDelete({ variant, index });
    setDeleteModalOpen(true);
  }, []);

  const handleSaveVariant = useCallback(
    (variant: Variation, editIndex: number | null) => {
      const current = form.getValues("variants") ?? [];
      const next: VariationFormItem[] = current.map((v: VariationFormItem) => ({
        id: v.id,
        sku: v.sku,
        // retailPrice: v.retailPrice ? parseFloat(v.retailPrice) : undefined,
        // wholesalePrice: v.wholesalePrice
        //   ? parseFloat(v.wholesalePrice)
        //   : undefined,
        values: v.values ?? [],
      }));
      if (editIndex !== null && editIndex >= 0 && editIndex < next.length) {
        next[editIndex] = {
          id: variant.id,
          sku: variant.sku,
          values: variant.values,
        };
      } else {
        next.push({
          id: variant.id,
          sku: variant.sku,
          values: variant.values,
        });
      }
      form.setValue("variants", next, { shouldDirty: true });
      setFormModalOpen(false);
      setEditingVariant(null);
      setEditingIndex(null);
    },
    [form],
  );

  const confirmDelete = useCallback(() => {
    if (variantToDelete === null) return;
    const current = form.getValues("variants") ?? [];
    const next = current.filter(
      (_: VariationFormItem, i: number) => i !== variantToDelete.index,
    );
    form.setValue("variants", next, { shouldDirty: true });
    setDeleteModalOpen(false);
    setVariantToDelete(null);
  }, [form, variantToDelete]);

  const columns = useMemo(
    () =>
      getVariationColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Variaciones del producto</h3>
        <Button type="button" variant="outline" size="sm" onClick={openCreate}>
          <PlusIcon className="size-4 mr-2" />
          Agregar variación
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={data}
        isLoading={false}
        globalFilter={{ search: "" }}
        error={false}
        sorting={[]}
        handleSorting={() => {}}
        pageIndex={0}
        setPageIndex={() => {}}
        globalFilterFn={() => true}
      />

      <VariationFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingVariant(null);
          setEditingIndex(null);
        }}
        variation={editingVariant}
        editIndex={editingIndex}
        onSave={handleSaveVariant}
      />

      <CustomConfirmDialog
        open={deleteModalOpen}
        onCloseDialog={() => {
          setDeleteModalOpen(false);
          setVariantToDelete(null);
        }}
        onContinueClick={confirmDelete}
        onCancelClick={() => {
          setDeleteModalOpen(false);
          setVariantToDelete(null);
        }}
        title="Eliminar variación"
        description={
          <p>
            ¿Seguro que deseas eliminar la variación
            {variantToDelete ? ` "${variantToDelete.variant.sku}"` : ""}?
          </p>
        }
        cancelButtonText="Cancelar"
        continueButtonText="Eliminar"
      />

      <div className="mt-4 grid grid-cols-2 gap-12">
        <InputField label="SKU" name="sku" placeholder="SKU" form={form} />

        <InputNumberField
          label="Stock"
          name="stock"
          placeholder="Stock"
          form={form}
          integerDigits={10}
        />

        <InputNumberField
          label="Precio de venta"
          name="retailPrice"
          placeholder="Precio de venta"
          form={form}
          integerDigits={10}
          decimalDigits={2}
          onChangeInputNumberField={(e) =>
            handlePriceChange("retailPrice")(e.target.value)
          }
        />

        <InputNumberField
          label="Precio mayorista"
          name="wholesalePrice"
          placeholder="Precio mayorista"
          form={form}
          integerDigits={10}
          decimalDigits={2}
          onChangeInputNumberField={(e) =>
            handlePriceChange("wholesalePrice")(e.target.value)
          }
        />
      </div>
    </div>
  );
};

export { VariationsTab };
