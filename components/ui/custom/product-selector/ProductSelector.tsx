import { type Path, type UseFormReturn, useFormContext } from "react-hook-form";
import { ProductSelectorTable } from "./ProductSelectorTable";
import { getColumns } from "./columns";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useGetProducts } from "@/hooks/use-products";
import { ProductFormSchema } from "@/shared/schemas";
import type z from "zod";

type ProductFormValues = z.infer<typeof ProductFormSchema>;

type ProductSelectorProps = {
  name: Path<ProductFormValues>;
  form: UseFormReturn<ProductFormValues>;
  className?: string;
  labelClassName?: string;
};

/**
 * Parámetros Opcionales
 *  - Filter: nombre del campo en el schema donde se almacena el estado del filtro
 **/
export default function ProductSelector({
  name,
  form,
  labelClassName,
  className,
}: ProductSelectorProps) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  const { data, isLoading } = useGetProducts();

  const columns = getColumns();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <ProductSelectorTable
            data={data || []}
            columns={columns}
            isLoading={isLoading}
            form={form}
            nameSchema={name}
            labelClassName={labelClassName}
            className={className}
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
