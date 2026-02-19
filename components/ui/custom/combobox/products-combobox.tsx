import { ComboboxFilter, ComboboxForm } from "@/components/ui/custom/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetProducts } from "@/hooks/use-products";
import type { Product } from "@/shared/types";

import {
  FieldValues,
  useFormContext,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

type DropdownProps<T extends FieldValues = FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder: string;
  form: UseFormReturn<T>;
  className?: string;
  onChange?: (value: Product) => void;
  labelClassName?: string;
  disabled?: boolean;
  setDefaultValue?: "last" | "first" | null;
  filterIds?: number[];
  queryParams?: unknown;
};

export default function ProductsCombobox<T extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  form,
  className,
  onChange,
  labelClassName,
  // disabled,
  // setDefaultValue,
  // filterIds,
  queryParams,
}: DropdownProps<T>) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  const { data, isLoading } = useGetProducts();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className={`text-[1rem] font-normal ${labelClassName}`}>
            {label}
          </FormLabel>
          <ComboboxForm
            form={form}
            name={name}
            placeholder={isLoading ? "Cargando..." : placeholder}
            field={field}
            filters={queryParams as unknown as ComboboxFilter}
            data={
              data?.map((product: Product) => ({
                id: product.id || 0,
                description: product.name,
                value: product.id || 0,
                name: product.name,
                slug: product.slug,
                sku: product.sku || "",
                retailPrice: product.retailPrice?.toString() || "",
                wholesalePrice: product.wholesalePrice?.toString() || "",
                images: product.images || [],
                // imageUrl: product.images?.[0]?.url || "",
                // imageAlt: product.images?.[0]?.alt || "",
              })) || []
            }
            onChange={(item) => {
              if (onChange && item.id) {
                onChange(item as unknown as Product);
              }
            }}
            isLoading={isLoading}
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
