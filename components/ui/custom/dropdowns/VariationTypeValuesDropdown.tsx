import { Suspense } from "react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

import Dropdown from "@/components/ui/custom/dropdown";
import DropdownLoadSkeleton from "@/components/ui/custom/skeletons/dropdown-load-skeleton";
import type { Variation, VariationValue } from "@/shared/types";
import { useGetVariations } from "@/hooks/use-variations";

type VariationTypeFilterProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string }) => void;
  label?: string;
  placeholder?: string;
  variationType: string;
};

const VariationTypeValuesDropdown = <T extends FieldValues>({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
  variationType,
}: VariationTypeFilterProps<T>) => {
  const labelName = label ?? "Categoría" + (required ? "*" : "");

  const { data } = useGetVariations();

  const values = data?.find(
    (variation: Variation) => variation.id?.toString() === variationType,
  )?.values;

  return (
    <Suspense
      fallback={
        <DropdownLoadSkeleton labelClassName={labelClassName} label={label} />
      }
    >
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || "Seleccione..."}
        list={
          values?.map((value: VariationValue) => ({
            id: value.id?.toString() || "",
            description: value.value,
          })) || []
        }
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
      />
    </Suspense>
  );
};

export { VariationTypeValuesDropdown };
