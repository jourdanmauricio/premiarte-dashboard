import type z from "zod";

import ProductSelector from "@/components/ui/custom/product-selector/ProductSelector";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "@/shared/schemas";

interface RelatedProductTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
}

const RelatedProductTab = ({ form }: RelatedProductTabProps) => {
  return (
    <ProductSelector name="relatedProducts" form={form} className="h-full" />
  );
};

export { RelatedProductTab };
