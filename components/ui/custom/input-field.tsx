import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { type InputHTMLAttributes } from "react";
import {
  FieldValues,
  useFormContext,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type BaseInputFieldProps<T extends FieldValues = FieldValues> = {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  className?: string; // TO-DO: renombrar a formItemClassName
  labelClassName?: string;
  enableClean?: boolean;
  errorClassName?: string;
  icon?: React.ReactNode;
  iconOnClick?: () => void;
};

type InputFieldProps<T extends FieldValues = FieldValues> =
  BaseInputFieldProps<T> &
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputFieldProps<T>>;

const InputField = <T extends FieldValues = FieldValues>({
  label,
  name,
  form,
  className,
  labelClassName,
  enableClean,
  errorClassName,
  icon,
  iconOnClick,
  ...props
}: InputFieldProps<T>) => {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          <FormLabel className={`text-sm font-normal ${labelClassName}`}>
            {label}
          </FormLabel>
          {enableClean && field.value && (
            <div className="absolute -top-2 right-3 -translate-y-1/2 transform cursor-pointer">
              <X
                className="h-4 w-4 text-neutral-500"
                onClick={() => field.onChange("")}
              />
            </div>
          )}
          <FormControl>
            <div className="relative">
              {icon && (
                <div
                  className="absolute top-1/2 right-3 z-10 -translate-y-1/2 transform"
                  onClick={iconOnClick}
                >
                  {icon}
                </div>
              )}
              <Input
                type={props.type ?? "text"}
                tabIndex={props.readOnly ? -1 : 0}
                className={`${
                  fieldState.invalid
                    ? "border-destructive text-destructive placeholder:text-destructive focus-visible:ring-destructive border"
                    : ""
                }`}
                {...field}
                onChange={(e) => {
                  if (props.onChange) {
                    field.onChange(props.onChange(e));
                  } else {
                    field.onChange(e);
                  }
                }}
                {...props}
              />
            </div>
          </FormControl>
          <div
            className={cn(
              `relative transition-all duration-300 ease-in-out ${
                fieldState.invalid ? "opacity-100" : "opacity-0"
              }`,
              errorClassName,
            )}
          >
            <FormMessage className="absolute -top-1 font-normal" />
          </div>
        </FormItem>
      )}
    />
  );
};

export { InputField };
