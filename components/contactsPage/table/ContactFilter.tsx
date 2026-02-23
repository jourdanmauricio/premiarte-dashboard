import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/ui/custom/input-field";

const SEARCH_DEBOUNCE_MS = 350;

const ContactFilterSchema = z.object({
  search: z.string().optional(),
});

interface ContactFilterProps {
  globalFilter: { search: string };
  handleSearch: (key: string, value: string) => void;
}

const ContactFilter = ({ globalFilter, handleSearch }: ContactFilterProps) => {
  const form = useForm({
    resolver: zodResolver(ContactFilterSchema),
    defaultValues: globalFilter,
  });

  const searchValue = useWatch({ control: form.control, name: "search", defaultValue: "" });
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchRef = useRef(handleSearch);

  useEffect(() => {
    handleSearchRef.current = handleSearch;
  }, [handleSearch]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      handleSearchRef.current("search", searchValue ?? "");
      searchTimeoutRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchValue]);

  return (
    <Form {...form}>
      <form>
        <div className="flex items-center gap-4">
          <InputField
            label=""
            name="search"
            className="min-w-[250px]"
            placeholder="Buscar contacto"
            form={form}
            enableClean
            icon={<SearchIcon className="size-4" />}
          />
        </div>
      </form>
    </Form>
  );
};

export { ContactFilter };
