import { Suspense } from "react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

import Dropdown from "@/components/ui/custom/dropdown";
import DropdownLoadSkeleton from "@/components/ui/custom/skeletons/dropdown-load-skeleton";
import type { Category } from "@/shared/types";
import { useGetCategories } from "@/hooks/use-categories";

type CategoriesFilterProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string }) => void;
  label?: string;
  placeholder?: string;
};

const CategoriesDropdown = <T extends FieldValues>({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
}: CategoriesFilterProps<T>) => {
  const labelName = label ?? "Categoría" + (required ? "*" : "");

  const { data } = useGetCategories();

  const categories = data?.map((category: Category) => ({
    id: category.id?.toString() || "",
    description: category.name,
  }));

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
        list={categories || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
        enableClean
      />
    </Suspense>
  );
};

export { CategoriesDropdown };
