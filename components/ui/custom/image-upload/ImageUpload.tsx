import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

interface ImageUploadProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  form: UseFormReturn<T>;
}

const ImageUpload = <T extends FieldValues>({ label, name, form }: ImageUploadProps<T>) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [prevValue, setPrevValue] = useState<unknown>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentValue = form.watch(name);

  // Limpiar preview cuando el valor cambia a una URL (no es un File) - durante el render
  if (currentValue !== prevValue) {
    setPrevValue(currentValue);
    if ((typeof currentValue === 'string' && currentValue) || !currentValue) {
      setPreview(null);
    }
  }

  const displayImage =
    preview || (typeof currentValue === 'string' ? currentValue : null) || '/images/sin-imagen.png';

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        form.setValue(name, file as Parameters<typeof form.setValue>[1], { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    form.setValue(name, '' as Parameters<typeof form.setValue>[1], { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-normal'>{label}</label>
      <div
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleInputChange}
        />

        <div className='flex flex-col items-center justify-center gap-2'>
          <div
            className={`relative h-48 w-48 overflow-hidden rounded-lg ${
              displayImage === '/images/sin-imagen.png' ? 'bg-gray-100' : 'bg-transparent'
            }`}
          >
            <Image
              src={displayImage}
              alt='Preview'
              fill
              className='object-contain'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-property.png';
              }}
            />
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 text-sm text-gray-600'>
              <Upload className='h-4 w-4' />
              <span>{isDragging ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}</span>
            </div>
            <p className='mt-1 text-xs text-gray-500'>PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>

        {(preview || (currentValue && currentValue !== '/images/sin-imagen.png')) && (
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2'
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
