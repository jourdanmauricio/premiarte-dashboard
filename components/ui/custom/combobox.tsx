import { cn } from "@/lib/utils";
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
} from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useRef, useEffect } from "react";

export type ComboboxFilter = {
  [key: string]: unknown;
};

export type ComboboxItem = {
  // label: string;
  // value: string | number;
  id: number;
  description: string;
};

interface ComboboxFormProps<
  T extends ComboboxItem = ComboboxItem,
  FV extends FieldValues = FieldValues,
> {
  form: UseFormReturn<FV>;
  name: Path<FV>;
  placeholder: string;
  field: FieldValues;
  deboundTime?: number;
  filters?: ComboboxFilter;
  data?: T[];
  onChange?: (item: T) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ComboboxForm<
  T extends ComboboxItem = ComboboxItem,
  FV extends FieldValues = FieldValues,
>({
  form,
  name,
  placeholder,
  field,
  data,
  onChange,
  isLoading = false,
  disabled = false,
}: ComboboxFormProps<T, FV>) {
  const [open, setOpen] = useState(false);
  const commandListRef = useRef<HTMLDivElement>(null);

  const filteredData = data || [];

  useEffect(() => {
    if (open) {
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        const scrollableElement =
          target.closest("[data-radix-scroll-area-viewport]") ||
          target.closest(".overflow-y-auto") ||
          target.closest("[cmdk-list]");

        if (scrollableElement) {
          e.preventDefault();
          scrollableElement.scrollTop += e.deltaY;
        }
      };

      document.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        document.removeEventListener("wheel", handleWheel);
      };
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !field.value && "text-muted-foreground",
          )}
        >
          {isLoading
            ? "Cargando..."
            : field.value
              ? data?.find(
                  (item) => item.id.toString() === field.value.toString(),
                )?.description
              : "Seleccionar"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) max-w-(--radix-popover-trigger-width) overflow-hidden p-0"
        align="start"
        side="bottom"
        sideOffset={4}
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxWidth: "var(--radix-popover-trigger-width)",
        }}
      >
        <Command className="max-h-[300px] w-full">
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList
            ref={commandListRef}
            className="max-h-[300px] w-full overflow-y-auto"
            tabIndex={0}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--border)) transparent",
              overscrollBehavior: "contain",
              scrollBehavior: "smooth",
            }}
          >
            {isLoading ? (
              <div className="text-muted-foreground py-6 text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  <span>Cargando opciones...</span>
                </div>
              </div>
            ) : (
              <>
                <CommandEmpty>No se encontraron resultados</CommandEmpty>
                <CommandGroup className="w-full">
                  {filteredData.map((item) => (
                    <CommandItem
                      value={item.description}
                      key={item.id}
                      onSelect={() => {
                        form.setValue(name, item.id as PathValue<FV, Path<FV>>);
                        setOpen(false);
                        if (onChange) {
                          onChange(item as T);
                        }
                      }}
                      className="flex w-full min-w-0 cursor-pointer items-center justify-between px-2 py-1.5"
                    >
                      <span className="min-w-0 flex-1 truncate text-left">
                        {item.description}
                      </span>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0",
                          item.id === field.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
