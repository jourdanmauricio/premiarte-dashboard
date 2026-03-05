import type z from "zod";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

import { GeneralTab } from "@/components/productsPage/modals/productModal/Tabs/GeneralTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductFormSchema } from "@/shared/schemas";
import { useState } from "react";
import { ImagesTab } from "@/components/productsPage/modals/productModal/Tabs/ImagesTab";
import { CategoryTab } from "@/components/productsPage/modals/productModal/Tabs/CategoryTab";
import { RelatedProductTab } from "@/components/productsPage/modals/productModal/Tabs/RelatedProductTab";
import { VariationsTab } from "@/components/productsPage/modals/productModal/Tabs/variationsTab/VariationsTab";

interface ProductTabsProps {
  form: UseFormReturn<z.infer<typeof ProductFormSchema>>;
  handlePriceChange: (
    fieldName: "retailPrice" | "wholesalePrice",
  ) => (value: string) => void;
  className?: string;
}

const ProductTabs = ({
  form,
  handlePriceChange,
  className,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("mt-4 h-full", className)}
    >
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="images">Imágenes</TabsTrigger>
        <TabsTrigger value="categories">Categorías</TabsTrigger>
        <TabsTrigger value="related">Productos relacionados</TabsTrigger>
        <TabsTrigger value="pricing">Variantes</TabsTrigger>
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
      <TabsContent value="pricing">
        <VariationsTab form={form} handlePriceChange={handlePriceChange} />
      </TabsContent>
    </Tabs>
  );
};

export { ProductTabs };
