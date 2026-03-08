import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Variant } from "@/shared/types";

interface ProductAttributeValuesDropdownProps {
  /** Nombre del atributo (ej: "Medida", "Color") */
  label: string;
  /** Índice del atributo dentro del array de atributos */
  attrIndex: number;
  /** Variantes del producto */
  variants: Variant[];
  /** Valores ya seleccionados en todos los atributos */
  selectedValues: (string | null)[];
  /** Valor actualmente seleccionado para este atributo */
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** Devuelve los valores disponibles para un atributo, filtrando por las selecciones previas */
function getAvailableValues(
  variants: Variant[],
  attrIndex: number,
  selectedValues: (string | null)[]
): string[] {
  const eligible = variants.filter((variant) =>
    selectedValues
      .slice(0, attrIndex)
      .every((selected, i) => selected == null || variant.values[i] === selected)
  );
  return [...new Set(eligible.map((v) => v.values[attrIndex]))];
}

function ProductAttributeValuesDropdown({
  label,
  attrIndex,
  variants,
  selectedValues,
  value,
  onChange,
  disabled = false,
}: ProductAttributeValuesDropdownProps) {
  const options = getAvailableValues(variants, attrIndex, selectedValues);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-normal">{label}</span>
      <Select
        value={value ?? ""}
        onValueChange={onChange}
        disabled={disabled || options.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Seleccionar ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { ProductAttributeValuesDropdown, getAvailableValues };
