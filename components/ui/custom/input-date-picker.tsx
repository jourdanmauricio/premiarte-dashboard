'use client';

import * as React from 'react';
import { ChevronDownIcon, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerFieldProps = {
  label: string;
  name: string;
  form: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  enableClean?: boolean;
  errorClassName?: string;
  placeholder?: string;
  buttonClassName?: string;
  onChangeDatePickerField?: (e: any) => void;
  disabled?: boolean;
};

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function InputDatePicker({
  label,
  name,
  form,
  className,
  labelClassName,
  enableClean,
  errorClassName,
  placeholder = 'Seleccionar fecha',
  buttonClassName,
  onChangeDatePickerField,
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  // Configurar el rango de años para el dropdown
  // startMonth: define el año mínimo disponible en el dropdown
  // endMonth: define el año máximo disponible en el dropdown (hasta 2035)
  const startMonth = React.useMemo(() => {
    return new Date(2020, 0, 1); // 1 de enero del año actual
  }, []);

  const endMonth = React.useMemo(() => {
    return new Date(2035, 11, 31); // 31 de diciembre de 2035
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel className={`text-sm font-normal ${labelClassName}`}>{label}</FormLabel>
          {enableClean && field.value && (
            <div className='relative w-full'>
              <div
                className='absolute top-5 right-3 z-10 -translate-y-1/2 transform cursor-pointer'
                onClick={() => field.onChange(undefined)}
              >
                <X className='h-4 w-4 text-neutral-500' />
              </div>
            </div>
          )}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={disabled}
                  variant='outline'
                  className={cn(
                    'w-full justify-between font-normal',
                    !field.value && 'text-muted-foreground',
                    fieldState.invalid &&
                      'border-destructive text-destructive focus-visible:ring-destructive',
                    buttonClassName
                  )}
                >
                  {field.value ? formatDate(new Date(field.value)) : placeholder}
                  <ChevronDownIcon className='h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value ? new Date(field.value) : undefined}
                  captionLayout='dropdown'
                  startMonth={startMonth}
                  endMonth={endMonth}
                  onSelect={(date) => {
                    field.onChange(date);
                    onChangeDatePickerField?.(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <div
            className={cn(
              `relative transition-all duration-300 ease-in-out ${
                fieldState.invalid ? 'opacity-100' : 'opacity-0'
              }`,
              errorClassName
            )}
          >
            <FormMessage className='absolute top-0.5 font-normal' />
          </div>
        </FormItem>
      )}
    />
  );
}
