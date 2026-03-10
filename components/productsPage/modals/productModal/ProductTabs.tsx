import type z from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

import { ProductFormSchema } from "@/shared/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagesTab } from "@/components/productsPage/modals/productModal/Tabs/ImagesTab";
import { GeneralTab } from "@/components/productsPage/modals/productModal/Tabs/GeneralTab";
import { VariantsTab } from "@/components/productsPage/modals/productModal/Tabs/VariantsTab";
import { CategoryTab } from "@/components/productsPage/modals/productModal/Tabs/CategoryTab";
import { RelatedProductTab } from "@/components/productsPage/modals/productModal/Tabs/RelatedProductTab";

interface ProductTabsProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
  handlePriceChange: (
    fieldName: "retailPrice" | "wholesalePrice",
  ) => (value: string) => void;
  className?: string;
}

type TabKey = "general" | "images" | "categories" | "related" | "variants";

const TAB_FIELDS: Record<TabKey, (keyof z.infer<typeof ProductFormSchema>)[]> =
  {
    general: [
      "name",
      "slug",
      "description",
      "sku",
      "stock",
      "retailPrice",
      "wholesalePrice",
    ],
    images: ["images"],
    categories: ["categories"],
    related: ["relatedProducts"],
    variants: ["variants"],
  };

const ProductTabs = ({
  form,
  handlePriceChange,
  className,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const handleChangeTab = async (nextTab: string) => {
    await form.trigger(TAB_FIELDS[activeTab]);
    setActiveTab(nextTab as TabKey);
  };

  const errors = form.formState.errors;

  const tabHasError: Record<TabKey, boolean> = {
    general: !!(
      errors.name ||
      errors.slug ||
      errors.description ||
      errors.sku ||
      errors.stock ||
      errors.retailPrice ||
      errors.wholesalePrice
    ),
    images: !!errors.images,
    categories: !!errors.categories,
    related: !!errors.relatedProducts,
    variants: !!errors.variants,
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleChangeTab}
      className={cn("mt-4 flex h-full min-h-0 flex-col", className)}
    >
      <TabsList>
        <TabsTrigger
          value="general"
          style={
            tabHasError.general ? { color: "rgb(239, 68, 68)" } : undefined
          }
        >
          General
        </TabsTrigger>
        <TabsTrigger
          value="images"
          style={tabHasError.images ? { color: "rgb(239, 68, 68)" } : undefined}
        >
          Imágenes
        </TabsTrigger>
        <TabsTrigger
          value="categories"
          style={
            tabHasError.categories ? { color: "rgb(239, 68, 68)" } : undefined
          }
        >
          Categorías
        </TabsTrigger>
        <TabsTrigger
          value="related"
          style={
            tabHasError.related ? { color: "rgb(239, 68, 68)" } : undefined
          }
        >
          Productos relacionados
        </TabsTrigger>
        <TabsTrigger
          value="variants"
          style={
            tabHasError.variants ? { color: "rgb(239, 68, 68)" } : undefined
          }
        >
          Variantes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralTab form={form} handlePriceChange={handlePriceChange} />
      </TabsContent>
      <TabsContent value="images">
        <ImagesTab form={form} />
      </TabsContent>
      <TabsContent value="categories">
        <CategoryTab form={form} />
      </TabsContent>
      <TabsContent value="related">
        <RelatedProductTab form={form} />
      </TabsContent>
      <TabsContent
        value="variants"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 max-h-[calc(90vh-18rem)] flex-1 overflow-y-auto">
          <VariantsTab form={form} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export { ProductTabs };
