import type z from "zod";

import BooleanCheckbox from "@/components/ui/custom/boolean-checkbox";
import { InputField } from "@/components/ui/custom/input-field";
import { TextareaField } from "@/components/ui/custom/textarea-field";
import { generateSlug } from "@/shared/functions";
import { ProductFormSchema } from "@/shared/schemas";
import { UseFormReturn } from "react-hook-form";

interface GeneralTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
  handlePriceChange: (
    fieldName: "retailPrice" | "wholesalePrice",
  ) => (value: string) => void;
}

const GeneralTab = ({ form, handlePriceChange }: GeneralTabProps) => {
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

      <TextareaField
        label="Descripción"
        name="description"
        placeholder="Descripción"
        form={form}
        className="col-span-2"
      />

      <div className="flex gap-4">
        <BooleanCheckbox label="Activo" name="isActive" form={form} />
        <BooleanCheckbox label="Recomendado" name="isFeatured" form={form} />
      </div>
    </div>
  );
};

export { GeneralTab };
