import { type UseFormReturn, useFormContext, FieldValues, Path } from "react-hook-form";

import { getColumns } from "./columns";
import { useGetCategories } from "@/hooks/use-categories";
import { CategorySelectorTable } from "./CategorySelectorTable";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

type CategorySelectorProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  className?: string;
  labelClassName?: string;
};

/**
 * Parámetros Opcionales
 *  - Filter: nomnbre del campo en el schema donde se almacena el estado del filtro
 **/
export default function CategorySelector<T extends FieldValues>({
  name,
  form,
  labelClassName,
}: CategorySelectorProps<T>) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  const { data, isLoading } = useGetCategories();

  const columns = getColumns();

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <CategorySelectorTable
            data={data || []}
            columns={columns}
            isLoading={isLoading}
            form={form}
            nameSchema={name}
            labelClassName={labelClassName}
          />
          <div
            className={`relative transition-all duration-300 ease-in-out ${fieldState.invalid ? "opacity-100" : "opacity-0"}`}
          >
            <FormMessage className="absolute -top-1 font-normal" />
          </div>
        </FormItem>
      )}
    />
  );
}
