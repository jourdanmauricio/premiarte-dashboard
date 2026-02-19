import { Suspense } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import Dropdown from "@/components/ui/custom/dropdown";
import DropdownLoadSkeleton from "@/components/ui/custom/skeletons/dropdown-load-skeleton";
// import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
//import { responsiblesService } from '@/lib/services/responsiblesService';
import type { Responsible } from "@/shared/types";
import { useGetResponsibles } from "@/hooks/use-responsibles";

type ResponsibilityDropdownProps<T extends FieldValues = FieldValues> = {
  name: string;
  form: UseFormReturn<T>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string }) => void;
};

function ResponsibilityDropdown<T extends FieldValues = FieldValues>({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
}: ResponsibilityDropdownProps<T>) {
  const label = "Responsable" + (required ? "*" : "");

  const { data } = useGetResponsibles();

  return (
    <Suspense
      fallback={
        <DropdownLoadSkeleton labelClassName={labelClassName} label={label} />
      }
    >
      <Dropdown
        name={name}
        label={label}
        placeholder={"Seleccione un responsable"}
        list={
          data?.map((responsible: Responsible) => ({
            id: responsible.id.toString(),
            description: responsible.name,
          })) || []
        }
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
      />
    </Suspense>
  );
}

export { ResponsibilityDropdown };
