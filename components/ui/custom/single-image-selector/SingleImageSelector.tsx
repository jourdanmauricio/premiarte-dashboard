import { useState } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import type { Image as ImageType } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { useGetImages } from "@/hooks/use-media";
import { ImageSelector } from "@/components/ui/custom/single-image-selector/image-selector";
import Image from "next/image";

interface ImageSelectorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  defaultTag?: string;
}

const SingleImageSelector = <T extends FieldValues>({
  form,
  defaultTag,
}: ImageSelectorProps<T>) => {
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);

  const { data: images } = useGetImages();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageId = (form as UseFormReturn<any>).watch("imageId") as
    | number
    | undefined;
  const selectedImage = images?.find((img) => img.id === imageId);

  const handleImageSelection = (selectedImages: ImageType[]) => {
    if (selectedImages.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form as UseFormReturn<any>).setValue("imageId", selectedImages[0].id, {
        shouldDirty: true,
      });
    }
    setImageSelectorOpen(false);
  };

  return (
    <div className="space-y-2">
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

      <ImageSelector
        open={imageSelectorOpen}
        closeModal={() => setImageSelectorOpen(false)}
        onSelect={handleImageSelection}
        multipleSelect={false}
        selectedImages={selectedImage ? [selectedImage] : []}
        defaultTag={defaultTag}
      />
    </div>
  );
};

export { SingleImageSelector };
