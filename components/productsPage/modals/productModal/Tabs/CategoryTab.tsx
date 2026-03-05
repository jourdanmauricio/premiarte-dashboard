import type z from "zod";

import CategorySelector from "@/components/ui/custom/category-selector/CategorySelector";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "@/shared/schemas";

interface CategoryTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
}

const CategoryTab = ({ form }: CategoryTabProps) => {
  return <CategorySelector name="categories" form={form} className="h-full" />;
};

export { CategoryTab };
