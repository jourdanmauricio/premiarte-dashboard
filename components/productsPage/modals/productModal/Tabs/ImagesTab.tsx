import type z from "zod";

import ImagesSelector from "@/components/ui/custom/images-selector/ImagesSelector";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "@/shared/schemas";

interface ImagesTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
}

const ImagesTab = ({ form }: ImagesTabProps) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-12">
      <ImagesSelector
        label="Imágenes del producto"
        name="images"
        form={form}
        maxImages={5}
        className="col-span-2"
        defaultTag="Productos"
      />
    </div>
  );
};

export { ImagesTab };
