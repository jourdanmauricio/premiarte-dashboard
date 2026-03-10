import type z from "zod";
import { UseFormReturn } from "react-hook-form";

import { ProductFormSchema } from "@/shared/schemas";
import { generateSlug } from "@/shared/functions";
import { InputField } from "@/components/ui/custom/input-field";
import { TextareaField } from "@/components/ui/custom/textarea-field";
import BooleanCheckbox from "@/components/ui/custom/boolean-checkbox";
import InputNumberField from "@/components/ui/custom/input-number-field";

interface GeneralTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
  handlePriceChange: (
    fieldName: "retailPrice" | "wholesalePrice",
  ) => (value: string) => void;
}

const GeneralTab = ({ form, handlePriceChange }: GeneralTabProps) => {
  const variants = form.watch("variants");
  const hasVariants = Array.isArray(variants) && variants.length > 0;

  return (
    <div className="mt-4 grid grid-cols-2 gap-12">
      <InputField
        label="Nombre"
        name="name"
        placeholder="Nombre del producto"
        form={form}
        onBlur={(e) => {
          const value = e.target.value;
          form.setValue("slug", generateSlug(value));
        }}
      />
      <InputField label="Slug" name="slug" placeholder="Slug" form={form} />

      <div className="flex flex-col">
        <BooleanCheckbox label="Activo" name="isActive" form={form} />
        <BooleanCheckbox label="Recomendado" name="isFeatured" form={form} />
        <BooleanCheckbox
          label="Personalizable"
          name="isCustomizable"
          form={form}
        />
      </div>

      <TextareaField
        label="Descripción"
        name="description"
        placeholder="Descripción"
        form={form}
        rows={6}
        // className="col-span-2"
      />

      <InputField label="SKU" name="sku" placeholder="SKU" form={form} />

      {hasVariants ? (
        <p className="col-span-2 text-muted-foreground text-sm">
          Este producto tiene variaciones. El precio y el stock se gestionan
          desde la pestaña Variantes.
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export { GeneralTab };
