import { useState } from "react";
import type z from "zod";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ProductFormSchema } from "@/shared/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

interface VariantsTabProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
}

interface AttributeDefinition {
  name: string;
}

const VariantsTab = ({ form }: VariantsTabProps) => {
  const baseSku = form.watch("sku");

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // Derivar atributos definidos desde las variantes existentes o desde estado local
  const existingAttributes: AttributeDefinition[] =
    fields.length > 0 ? fields[0].attributes.map((name) => ({ name })) : [];

  const [attributes, setAttributes] =
    useState<AttributeDefinition[]>(existingAttributes);

  const [openVariant, setOpenVariant] = useState<string | undefined>(undefined);
  const [newAttributeName, setNewAttributeName] = useState("");

  const canAddVariant =
    attributes.length > 0 && attributes.every((a) => a.name.trim() !== "");

  const generateSkuSuffix = (values: string[]) =>
    values.map((v) => v.toLowerCase().replace(/\s+/g, "-")).join("-");

  const valuesSignature = (values: string[]) =>
    values.map((v) => v.trim().toLowerCase()).join("|");

  const isDuplicateValues = (
    variantIndex: number,
    newValues: string[],
  ): boolean => {
    if (!newValues.every((v) => v.trim() !== "")) return false;
    const sig = valuesSignature(newValues);
    return fields.some(
      (f, i) => i !== variantIndex && valuesSignature(f.values) === sig,
    );
  };

  const handleAddAttribute = () => {
    const trimmed = newAttributeName.trim();
    if (!trimmed) return;
    if (
      attributes.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("El atributo ya existe");
      return;
    }

    const updatedAttributes = [...attributes, { name: trimmed }];
    setAttributes(updatedAttributes);
    setNewAttributeName("");

    // Agregar el nuevo atributo a todas las variantes existentes con valor vacío
    fields.forEach((field, index) => {
      update(index, {
        ...field,
        attributes: [...field.attributes, trimmed],
        values: [...field.values, ""],
      });
    });
  };

  const handleRemoveAttribute = (attrIndex: number) => {
    const updated = attributes.filter((_, i) => i !== attrIndex);
    setAttributes(updated);

    // Remover el atributo y su valor de todas las variantes y actualizar SKU
    fields.forEach((field, variantIndex) => {
      const newAttrs = field.attributes.filter((_, i) => i !== attrIndex);
      const newVals = field.values.filter((_, i) => i !== attrIndex);
      const allFilled = newVals.every((v) => v.trim() !== "");
      const newSku =
        allFilled && baseSku
          ? `${baseSku}-${generateSkuSuffix(newVals)}`
          : field.sku;
      update(variantIndex, {
        ...field,
        attributes: newAttrs,
        values: newVals,
        sku: newSku,
      });
    });
  };

  const handleAddVariant = () => {
    const attrNames = attributes.map((a) => a.name);
    append({
      sku: baseSku
        ? `${baseSku}-${generateSkuSuffix(Array(attrNames.length).fill("nuevo"))}`
        : "",
      retailPrice: undefined,
      wholesalePrice: undefined,
      stock: undefined,
      attributes: attrNames,
      values: Array(attrNames.length).fill(""),
    });
  };

  const handleValueChange = (
    variantIndex: number,
    valueIndex: number,
    newValue: string,
  ) => {
    const field = fields[variantIndex];
    const newValues = [...field.values];
    newValues[valueIndex] = newValue;

    if (isDuplicateValues(variantIndex, newValues)) {
      toast.error(
        "Ya existe una variante con estos valores. Cada combinación de atributos debe ser única.",
      );
      return;
    }

    // Regenerar SKU automáticamente si todos los valores están completos
    const allFilled = newValues.every((v) => v.trim() !== "");
    const newSku =
      allFilled && baseSku
        ? `${baseSku}-${generateSkuSuffix(newValues)}`
        : field.sku;

    update(variantIndex, { ...field, values: newValues, sku: newSku });
  };

  const handleSkuChange = (variantIndex: number, newSku: string) => {
    const field = fields[variantIndex];
    update(variantIndex, { ...field, sku: newSku });
  };

  const handlePriceChange = (
    variantIndex: number,
    field_name: "retailPrice" | "wholesalePrice" | "stock",
    value: string,
  ) => {
    const field = fields[variantIndex];
    const parsed = value === "" ? undefined : parseFloat(value);
    update(variantIndex, {
      ...field,
      [field_name]: isNaN(parsed as number) ? undefined : parsed,
    });
  };

  const getVariantLabel = (variant: {
    attributes: string[];
    values: string[];
    sku: string;
  }) => {
    const parts = variant.attributes
      .map((attr, i) => `${attr}: ${variant.values[i] || "—"}`)
      .join(" · ");
    return parts || variant.sku || "Nueva variante";
  };

  const hasIncompleteVariants = fields.some((f) =>
    f.values.some((v) => v.trim() === ""),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Sección de atributos */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Atributos</h2>
        </div>

        {attributes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attributes.map((attr, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
              >
                {attr.name}
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(i)}
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Ej: Color, Medida, Talle…"
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAttribute();
              }
            }}
            className="max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddAttribute}
            disabled={!newAttributeName.trim()}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar atributo
          </Button>
        </div>
      </div>

      {/* Sección de variantes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Variantes
            {hasIncompleteVariants && (
              <span className="ml-2 text-xs text-amber-500 font-normal">
                ⚠ Hay variantes con atributos sin completar
              </span>
            )}
          </h2>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAddVariant}
            disabled={!canAddVariant}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Nueva variante
          </Button>
        </div>

        {!canAddVariant && attributes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Definí al menos un atributo para poder agregar variantes.
          </p>
        )}

        {fields.length === 0 && attributes.length > 0 && (
          <p className="text-sm text-muted-foreground">
            No hay variantes aún. Hacé clic en &quot;Nueva variante&quot; para
            agregar una.
          </p>
        )}

        {fields.length > 0 && (
          <Accordion
            type="single"
            collapsible
            value={openVariant}
            onValueChange={setOpenVariant}
            className="flex flex-col gap-2"
          >
            {fields.map((field, variantIndex) => {
              const isIncomplete = field.values.some((v) => v.trim() === "");
              const accordionValue = String(variantIndex);
              return (
                <AccordionItem
                  key={variantIndex}
                  value={accordionValue}
                  className="rounded-md border px-4"
                >
                  <div className="flex items-center gap-2">
                    <AccordionTrigger className="flex-1 hover:no-underline py-3">
                      <span className="flex items-center gap-2 text-sm">
                        {isIncomplete && (
                          <span className="text-amber-500">⚠</span>
                        )}
                        <span className="font-mono text-xs text-muted-foreground">
                          {field.sku || "sin SKU"}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span>{getVariantLabel(field)}</span>
                        {field.retailPrice !== undefined && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-xs">
                              ${field.retailPrice}
                            </span>
                          </>
                        )}
                      </span>
                    </AccordionTrigger>
                    <button
                      type="button"
                      onClick={() => {
                        remove(variantIndex);
                        setOpenVariant(undefined);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>

                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Valores de atributos */}
                      {field.attributes.map((attrName, valueIndex) => (
                        <div key={valueIndex} className="flex flex-col gap-1">
                          <Label className="text-xs">{attrName}</Label>
                          <Input
                            value={field.values[valueIndex] ?? ""}
                            onChange={(e) =>
                              handleValueChange(
                                variantIndex,
                                valueIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Valor de ${attrName}`}
                          />
                        </div>
                      ))}

                      {/* SKU */}
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          value={field.sku}
                          onChange={(e) =>
                            handleSkuChange(variantIndex, e.target.value)
                          }
                          placeholder="SKU de la variante"
                        />
                      </div>

                      {/* Precio minorista */}
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Precio minorista</Label>
                        <Input
                          type="number"
                          value={field.retailPrice ?? ""}
                          onChange={(e) =>
                            handlePriceChange(
                              variantIndex,
                              "retailPrice",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                        />
                      </div>

                      {/* Precio mayorista */}
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Precio mayorista</Label>
                        <Input
                          type="number"
                          value={field.wholesalePrice ?? ""}
                          onChange={(e) =>
                            handlePriceChange(
                              variantIndex,
                              "wholesalePrice",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                        />
                      </div>

                      {/* Stock */}
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="number"
                          value={field.stock ?? ""}
                          onChange={(e) =>
                            handlePriceChange(
                              variantIndex,
                              "stock",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export { VariantsTab };
