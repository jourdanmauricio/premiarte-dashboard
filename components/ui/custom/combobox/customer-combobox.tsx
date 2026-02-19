import { ComboboxFilter, ComboboxForm } from "@/components/ui/custom/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetCustomers } from "@/hooks/use-customers";
import type { Customer } from "@/shared/types";

import {
  FieldValues,
  Path,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

type DropdownProps<T extends FieldValues = FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder: string;
  form: UseFormReturn<T>;
  className?: string;
  onChange?: (value: Customer) => void;
  labelClassName?: string;
  disabled?: boolean;
  setDefaultValue?: "last" | "first" | null;
  filterIds?: number[];
  queryParams?: unknown;
};

export function CustomersCombobox<T extends FieldValues = FieldValues>({
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

  const { data, isLoading } = useGetCustomers();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className={`font-normal ${labelClassName}`}>
            {label}
          </FormLabel>
          <ComboboxForm
            form={form}
            name={name}
            placeholder={isLoading ? "Cargando..." : placeholder}
            field={field}
            filters={queryParams as unknown as ComboboxFilter}
            data={
              data?.map((customer: Customer) => ({
                id: customer.id || 0,
                description: customer.name,
                value: customer.id || 0,
                name: customer.name,
                email: customer.email || "",
                phone: customer.phone || "",
                type: customer.type || "retail",
              })) || []
            }
            onChange={(item) => {
              if (onChange && item.id) {
                onChange(item as unknown as Customer);
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
