import { z } from "zod";
import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";

import { Form } from "@/components/ui/form";
import { customerTypeList } from "@/shared/constanst";
import Dropdown from "@/components/ui/custom/dropdown";
import { InputField } from "@/components/ui/custom/input-field";

const SEARCH_DEBOUNCE_MS = 350;

const CustomerFilterSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
});

interface CustomerFilterProps {
  globalFilter: { search: string; type: string };
  handleSearch: (key: string, value: string) => void;
}

const CustomerFilter = ({
  globalFilter,
  handleSearch,
}: CustomerFilterProps) => {
  const form = useForm({
    resolver: zodResolver(CustomerFilterSchema),
    defaultValues: globalFilter,
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "search") {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
          handleSearch("search", value.search || "");
          searchTimeoutRef.current = null;
        }, SEARCH_DEBOUNCE_MS);
      }
      if (name === "type") {
        handleSearch("type", value.type || "");
      }
    });
    return () => {
      subscription.unsubscribe();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [form, handleSearch]);

  return (
    <Form {...form}>
      <form>
        <div className="flex items-center gap-4">
          <InputField
            label=""
            name="search"
            className="min-w-[250px]"
            placeholder="Buscar cliente"
            form={form}
            enableClean
            icon={<SearchIcon className="size-4" />}
          />
          <Dropdown
            label=""
            name="type"
            placeholder="Tipo de cliente"
            form={form}
            list={customerTypeList}
            className="min-w-[250px]"
            enableClean
          />
        </div>
      </form>
    </Form>
  );
};

export default CustomerFilter;
