import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

type InputFieldSeachProps = {
  setGlobalFilter: (value: { search: string }) => void;
};

const InputFieldSeach = ({ setGlobalFilter }: InputFieldSeachProps) => {
  const [search, setSearch] = useState('');

  const onChangeSearch = (value: string) => {
    setSearch(value);
    setGlobalFilter({ search: value });
  };

  return (
    <div className='relative'>
      <Input
        name='search'
        placeholder='Buscar'
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
      <div className='absolute top-1/2 right-3 z-10 -translate-y-1/2 transform'>
        <SearchIcon className='text-primary h-4 w-4' />
      </div>
      {search && (
        <div
          className='absolute -top-3 right-0 z-10 -translate-y-1/2 transform cursor-pointer'
          onClick={() => onChangeSearch('')}
        >
          <XIcon className='h-4 w-4 text-neutral-500' />
        </div>
      )}
    </div>
  );
};

export { InputFieldSeach };
