import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/custom/submit-button";
import type { OrderItemRow, Product } from "@/shared/types";
import type { Variant } from "@/shared/types/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { OrderItemFormSchema } from "@/shared/schemas";
import { TextareaField } from "@/components/ui/custom/textarea-field";
import ProductsCombobox from "@/components/ui/custom/combobox/products-combobox";
import InputNumberField from "@/components/ui/custom/input-number-field";
import { setPrices } from "@/shared/functions";
import { Image } from "@/shared/types/image";
import { ProductAttributeValuesDropdown } from "@/components/ui/custom/dropdowns/ProductAttributeValuesDropdown";

interface ItemModalProps {
  open: boolean;
  closeModal: () => void;
  item: OrderItemRow | null;
  type: "retail" | "wholesale";
  addItem: (item: OrderItemRow) => void;
  editItem: (item: OrderItemRow) => void;
}

const defaultValues = {
  productId: 0,
  name: "",
  slug: "",
  sku: "",
  retailPrice: "",
  wholesalePrice: "",
  price: "",
  quantity: "1",
  amount: "",
  observation: "",
  customText: "",
  variantId: null,
  attributes: null,
  values: null,
  productVariants: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/** Encuentra la variante que coincide exactamente con los valores seleccionados */
function findVariant(
  variants: Variant[],
  selectedValues: (string | null)[],
): Variant | null {
  if (selectedValues.some((v) => v == null)) return null;
  return (
    variants.find((v) =>
      v.values.every((val, i) => val === selectedValues[i]),
    ) ?? null
  );
}

const ItemModal = ({
  open,
  closeModal,
  item,
  type,
  addItem,
  editItem,
}: ItemModalProps) => {
  const mode = item ? "EDIT" : "CREATE";

  const form = useForm<z.infer<typeof OrderItemFormSchema>>({
    resolver: zodResolver(OrderItemFormSchema),
    defaultValues:
      mode === "EDIT" && item
        ? {
            id: item.id,
            productId: item.productId,
            variantId: item.variantId ?? null,
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            retailPrice: item.retailPrice,
            wholesalePrice: item.wholesalePrice,
            price: item.price,
            quantity: item.quantity.toString(),
            amount: item.amount,
            observation: item.observation || "",
            customText: item.customText || "",
            attributes: item.attributes ?? null,
            values: item.values ?? null,
            productVariants: item.productVariants ?? null,
          }
        : defaultValues,
  });

  const [productVariants, setProductVariants] = useState<Variant[] | null>(
    (item?.productVariants as Variant[]) ?? null,
  );

  const [selectedValues, setSelectedValues] = useState<(string | null)[]>(
    item?.values ?? [],
  );

  const watchName = useWatch({
    control: form.control,
    name: "name",
    defaultValue: "",
  });

  useEffect(() => {
    if (mode === "EDIT" && item) {
      form.reset({
        ...item,
        variantId: item.variantId ?? null,
        attributes: item.attributes ?? null,
        values: item.values ?? null,
        productVariants: item.productVariants ?? null,
      });
      queueMicrotask(() => {
        setProductVariants((item.productVariants as Variant[]) ?? null);
        setSelectedValues(item.values ?? []);
      });
    }
  }, [mode, item, form]);

  const handleAttributeValueChange = useCallback(
    (attrIndex: number, value: string) => {
      if (!productVariants) return;

      const newSelected = [...selectedValues];
      newSelected[attrIndex] = value;
      for (let i = attrIndex + 1; i < newSelected.length; i++) {
        newSelected[i] = null;
      }
      setSelectedValues(newSelected);

      const matched = findVariant(productVariants, newSelected);
      if (matched) {
        const variantRetailPrice = matched.retailPrice?.toString() ?? "0";
        const variantWholesalePrice = matched.wholesalePrice?.toString() ?? "0";
        const price =
          type === "retail" ? variantRetailPrice : variantWholesalePrice;

        form.setValue("variantId", matched.id ?? null, { shouldDirty: true });
        form.setValue("attributes", matched.attributes, { shouldDirty: true });
        form.setValue("values", matched.values, { shouldDirty: true });
        form.setValue("retailPrice", variantRetailPrice, { shouldDirty: true });
        form.setValue("wholesalePrice", variantWholesalePrice, {
          shouldDirty: true,
        });
        form.setValue("price", price, { shouldDirty: true });
        form.setValue(
          "amount",
          (+price * +form.getValues("quantity")).toString(),
          { shouldDirty: true },
        );
      } else {
        form.setValue("variantId", null, { shouldDirty: true });
        form.setValue("attributes", null, { shouldDirty: true });
        form.setValue("values", null, { shouldDirty: true });
      }
    },
    [productVariants, selectedValues, type, form],
  );

  const onSubmit = (data: z.infer<typeof OrderItemFormSchema>) => {
    if (mode === "CREATE") {
      addItem(data);
    } else {
      editItem(data);
    }
    closeModal();
  };

  const handleProductChange = (product: Product) => {
    const variants = (product.variants as Variant[]) ?? null;
    const hasVariants = variants && variants.length > 0;

    setProductVariants(variants);
    setSelectedValues(
      hasVariants ? new Array(variants[0].attributes.length).fill(null) : [],
    );

    form.setValue("variantId", null);
    form.setValue("attributes", null);
    form.setValue("values", null);
    form.setValue("productVariants", variants);
    form.setValue("id", item?.id);
    form.setValue("productId", product.id || 0);
    form.setValue("imageUrl", (product?.images as Image[])?.[0]?.url || "");
    form.setValue("imageAlt", (product?.images as Image[])?.[0]?.alt || "");
    form.setValue("name", product.name);
    form.setValue("slug", product.slug);
    form.setValue("sku", product.sku || "");
    form.setValue("observation", "", { shouldDirty: true });
    form.setValue("customText", "", { shouldDirty: true });

    if (!hasVariants) {
      const { price, retailPrice, wholesalePrice } = setPrices(type, product);
      form.setValue("price", price);
      form.setValue("wholesalePrice", wholesalePrice);
      form.setValue("retailPrice", retailPrice);
      form.setValue(
        "amount",
        (+price * +form.getValues("quantity")).toString(),
      );
    } else {
      form.setValue("price", "0");
      form.setValue("retailPrice", "0");
      form.setValue("wholesalePrice", "0");
      form.setValue("amount", "0");
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  const attributeNames =
    productVariants && productVariants.length > 0
      ? productVariants[0].attributes
      : [];
  const hasVariants = attributeNames.length > 0;

  const allVariantValuesSelected =
    !hasVariants || selectedValues.every((v) => v != null && v !== "");

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-h-[95%] max-w-xl sm:max-w-xl overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {mode === "CREATE"
              ? "Agregar producto"
              : `Editar producto ${watchName}`}
          </DialogTitle>
          <DialogDescription />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="mt-4 flex flex-col gap-6 w-full"
            >
              <ProductsCombobox<z.infer<typeof OrderItemFormSchema>>
                label="Producto"
                name="productId"
                placeholder="Seleccionar producto"
                form={form}
                className="w-full"
                onChange={handleProductChange}
              />

              {hasVariants && (
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-medium">Variación</span>
                  <div className="grid grid-cols-2 gap-4">
                    {attributeNames.map((attrName, i) => (
                      <ProductAttributeValuesDropdown
                        key={attrName}
                        label={attrName}
                        attrIndex={i}
                        variants={productVariants!}
                        selectedValues={selectedValues}
                        value={selectedValues[i] ?? null}
                        onChange={(value) =>
                          handleAttributeValueChange(i, value)
                        }
                        disabled={i > 0 && selectedValues[i - 1] == null}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-12 w-full">
                <InputNumberField
                  label="Cantidad"
                  name="quantity"
                  placeholder="Cantidad"
                  integerDigits={5}
                  form={form}
                  className="w-full"
                  onChangeInputNumberField={(e) => {
                    form.setValue(
                      "amount",
                      (+form.getValues("price") * +e.target.value).toString(),
                      { shouldDirty: true },
                    );
                  }}
                />

                <InputNumberField
                  label="Precio"
                  name="price"
                  placeholder="Precio"
                  integerDigits={10}
                  form={form}
                  className="w-full"
                  onChangeInputNumberField={(e) => {
                    form.setValue(
                      "amount",
                      (
                        +e.target.value * +form.getValues("quantity")
                      ).toString(),
                      { shouldDirty: true },
                    );
                    if (type === "retail") {
                      form.setValue("retailPrice", e.target.value, {
                        shouldDirty: true,
                      });
                    } else {
                      form.setValue("wholesalePrice", e.target.value, {
                        shouldDirty: true,
                      });
                    }
                  }}
                />
              </div>

              <InputNumberField
                label="Total"
                name="amount"
                placeholder="Total"
                integerDigits={9}
                decimalDigits={2}
                form={form}
                className="w-full"
              />

              <TextareaField
                label="Texto personalizado"
                name="customText"
                placeholder="Texto personalizado"
                form={form}
                className="w-full"
              />

              <TextareaField
                label="Observación"
                name="observation"
                placeholder="Observación"
                form={form}
                className="w-full"
              />

              <div className="flex justify-end gap-8 pt-10">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  Cancelar
                </Button>
                <SubmitButton
                  text={mode === "CREATE" ? "Agregar producto" : "Aceptar"}
                  className="min-w-[150px]"
                  isLoading={false}
                  disabled={
                    !form.formState.isDirty || !allVariantValuesSelected
                  }
                />
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { ItemModal };
