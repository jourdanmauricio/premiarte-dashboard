import { useState, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Image } from "@/shared/types";
import { imageTagsList } from "@/shared/constanst";
import { Button } from "@/components/ui/button";
import { ImageUploadTab } from "./tabs/ImageUploadTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageSelectorTab from "@/components/ui/custom/images-selector/Modal/tabs/ImageSelectorTab";

interface ImageSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (images: Image[]) => void;
  allImages: Image[];
  selectedImageIds: number[];
  maxImages: number;
  defaultTag: string;
}

interface ImageSelectorModalContentProps {
  onClose: () => void;
  onSelect: (images: Image[]) => void;
  allImages: Image[];
  selectedImageIds: number[];
  maxImages: number;
  defaultTag: string;
}

/** Contenido del modal con estado propio; al montarse solo cuando open=true, el estado siempre es fresco */
function ImageSelectorModalContent({
  onClose,
  onSelect,
  allImages,
  selectedImageIds,
  maxImages,
  defaultTag,
}: ImageSelectorModalContentProps) {
  const [activeTab, setActiveTab] = useState("select");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<Image[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const folderData = imageTagsList.map((folder) => {
    const count =
      folder.id === "Todas"
        ? allImages.length
        : allImages.filter(
            (img) =>
              img.tag === folder.id || (!img.tag && folder.id === "Otros"),
          ).length;
    return { ...folder, count };
  });

  const filteredImages = allImages.filter((image) => {
    let folderMatch = true;
    if (selectedFolder && selectedFolder !== "Todas") {
      if (selectedFolder === "Otros") {
        folderMatch = !image.tag || image.tag === "Otros";
      } else {
        folderMatch = image.tag === selectedFolder;
      }
    }
    const searchMatch =
      !searchTerm ||
      image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.tag && image.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return folderMatch && searchMatch;
  });

  const canSelectMore = () =>
    selectedImageIds.length + tempSelected.length < maxImages;

  const handleUploadSuccess = useCallback((newImages: Image[]) => {
    setActiveTab("select");
    setTempSelected(newImages);
  }, []);

  const handleConfirm = () => {
    onSelect(tempSelected);
    setTempSelected([]);
    setSearchTerm("");
    setSelectedFolder(null);
  };

  const handleCancel = () => {
    setTempSelected([]);
    setSearchTerm("");
    setSelectedFolder(null);
    onClose();
  };

  const getFolderIcon = (folderId: string) => {
    const icons: Record<string, string> = {
      Todas: "📁",
      Categorías: "📂",
      Productos: "📦",
      Páginas: "📄",
      Otros: "🗂️",
    };
    return icons[folderId] || "📁";
  };

  return (
    <>
      <DialogHeader className="w-full">
        <DialogTitle>Selector de Imágenes</DialogTitle>
        <DialogDescription>
          Selecciona hasta {maxImages} imágenes. Ya tienes{" "}
          {selectedImageIds.length} seleccionadas.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 flex flex-col min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="select">Seleccionar</TabsTrigger>
            <TabsTrigger value="upload">Subir</TabsTrigger>
          </TabsList>

          <TabsContent
            value="select"
            className="flex-1 mt-4 overflow-hidden flex flex-col"
          >
            <ImageSelectorTab
              tempSelected={tempSelected}
              canSelectMore={canSelectMore}
              selectedImageIds={selectedImageIds}
              maxImages={maxImages}
              selectedFolder={selectedFolder}
              folderData={folderData}
              setSelectedFolder={setSelectedFolder}
              getFolderIcon={getFolderIcon}
              filteredImages={filteredImages}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setTempSelected={setTempSelected}
            />
          </TabsContent>

          <TabsContent value="upload" className="flex-1 mt-4 overflow-auto">
            <ImageUploadTab
              onUploadSuccess={handleUploadSuccess}
              defaultTag={defaultTag}
            />
          </TabsContent>
        </Tabs>
      </div>

      {activeTab === "select" && (
        <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={tempSelected.length === 0}
          >
            Agregar {tempSelected.length} imagen
            {tempSelected.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="flex justify-end gap-3 pt-4 border-t shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      )}
    </>
  );
}

export function ImageSelectorModal({
  open,
  onClose,
  onSelect,
  allImages,
  selectedImageIds,
  maxImages,
  defaultTag,
}: ImageSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-6xl w-full max-h-[90vh] h-[90vh] flex flex-col">
        {open ? (
          <ImageSelectorModalContent
            onClose={onClose}
            onSelect={onSelect}
            allImages={allImages}
            selectedImageIds={selectedImageIds}
            maxImages={maxImages}
            defaultTag={defaultTag}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
