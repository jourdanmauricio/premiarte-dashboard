import type z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type UseFormReturn } from "react-hook-form";

import type { Image as ImageType } from "@/shared/types";
import { SettingsFormSchema } from "@/shared/schemas";
import { InputField } from "@/components/ui/custom/input-field";
import { ImageSelector } from "@/components/ui/custom/single-image-selector/image-selector";
import Image from "next/image";

interface MenuPanelProps {
  form: UseFormReturn<z.infer<typeof SettingsFormSchema>>;
  images: ImageType[];
}

const MenuPanel = ({ form, images }: MenuPanelProps) => {
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);

  const selectedImage = images?.find(
    (img) => img.id === form.watch("home.menu.logoId"),
  );

  const handleImageSelection = (selectedImages: ImageType[]) => {
    if (selectedImages.length > 0) {
      form.setValue("home.menu.logoId", selectedImages[0].id as number, {
        shouldDirty: true,
      });
    }
    setImageSelectorOpen(false);
  };

  return (
    <>
      <h2 className="text-xl font-bold">Menu</h2>
      <div className="flex gap-12 items-center p-6">
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">Imagen</label>
          <div className="flex items-center gap-4">
            {selectedImage ? (
              <div className="flex items-center gap-4">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="w-16 h-16 object-cover rounded-md border"
                  width={64}
                  height={64}
                />
                <div>
                  <p className="text-sm font-medium">{selectedImage.alt}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setImageSelectorOpen(true)}
                  >
                    Cambiar imagen
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setImageSelectorOpen(true)}
              >
                Seleccionar imagen
              </Button>
            )}
          </div>
        </div>
        <div className="w-full">
          <InputField
            label="Nombre del sitio"
            name="home.menu.siteName"
            form={form}
            placeholder="Nombre del sitio"
          />
        </div>
      </div>

      {imageSelectorOpen && (
        <ImageSelector
          open={imageSelectorOpen}
          closeModal={() => setImageSelectorOpen(false)}
          onSelect={handleImageSelection}
          multipleSelect={false}
          selectedImages={selectedImage ? [selectedImage] : []}
        />
      )}
    </>
  );
};

export { MenuPanel };
