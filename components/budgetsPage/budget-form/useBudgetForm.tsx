import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { BudgetFormSchema } from "@/shared/schemas";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getBudgetItemColumns } from "./table/budgetItemsColumns";
import type {
  BudgetItemRow,
  BudgetStatus,
  BudgetItem,
  Budget,
  UpdateBudgetData,
} from "@/shared/types";

import {
  useCreateBudget,
  useGetBudgetById,
  useUpdateBudget,
} from "@/hooks/use-budgets";
import { useGetResponsibles } from "@/hooks/use-responsibles";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  type: "retail" as "retail" | "wholesale",
  createdAt: new Date(),
  expiresAt: new Date(new Date().setDate(new Date().getDate() + 15)),
  status: "pending" as BudgetStatus,
  showCuit: false,
  observation: "",
  totalAmount: "",
  items: [],
  responsibleId: "",
};

export const useBudgetForm = () => {
  const [currentItem, setCurrentItem] = useState<BudgetItemRow | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [customerModalIsOpen, setCustomerModalIsOpen] = useState(false);

  const { id } = useParams();
  const mode = id === "new" ? "CREATE" : "EDIT";

  const { data: budget, isLoading: isBudgetLoading } = useGetBudgetById(
    id?.toString() || "",
    mode === "EDIT" ? true : false,
  );

  const { isLoading: isResponsiblesLoading } = useGetResponsibles();
  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();

  const isLoading =
    mode === "EDIT"
      ? isBudgetLoading || isResponsiblesLoading
      : isBudgetLoading;

  const form = useForm<z.infer<typeof BudgetFormSchema>>({
    resolver: zodResolver(BudgetFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (mode === "EDIT" && budget) {
      setTimeout(() => {
        const budgetData = {
          ...budget,
          name: budget.customer?.name,
          email: budget.customer?.email,
          phone: budget.customer?.phone,
          customerId: budget.customerId,
          responsibleId:
            budget.responsibleId && budget.responsibleId.toString(),
          items: budget.items?.map((item: BudgetItem) => ({
            ...item,
            name: item.product.name,
            sku: item.product.sku,
            productId: item.productId,
            variantId: item.variantId ?? null,
            slug: item.product.slug,
            imageUrl: item.product.images?.[0]?.url ?? "",
            imageAlt: item.product.images?.[0].alt ?? "",
            quantity: item.quantity.toString(),
            price: item.price ? item.price.toString() : "0",
            amount: item.amount ? item.amount.toString() : "0",
            retailPrice: item.retailPrice ? item.retailPrice.toString() : "0",
            wholesalePrice: item.wholesalePrice
              ? item.wholesalePrice.toString()
              : "0",
            observation: item.observation ?? "",
            customText: item.customText || "",
            attributes: item.attributes ?? null,
            values: item.values ?? null,
            productVariants: item.product.variants ?? null,
          })),
          observation: budget.observation ?? "",
          totalAmount: budget.totalAmount ? budget.totalAmount.toString() : "0",
          type: budget.type || "retail",
          status: budget.status as BudgetStatus,
          showCuit: budget.showCuit ?? false,
          createdAt: budget.createdAt ? new Date(budget.createdAt) : undefined,
          expiresAt: budget.expiresAt ? new Date(budget.expiresAt) : undefined,
          approvedAt: budget.approvedAt
            ? new Date(budget.approvedAt)
            : undefined,
          rejectedAt: budget.rejectedAt
            ? new Date(budget.rejectedAt)
            : undefined,
        };
        form.reset(budgetData as unknown as z.infer<typeof BudgetFormSchema>);
      }, 0);
    }
  }, [mode, budget, form]);

  const handleDeleteBudget = useCallback((item: BudgetItemRow) => {
    setCurrentItem(item);
    setDeleteModalIsOpen(true);
  }, []);

  const handleEditBudget = useCallback((item: BudgetItemRow) => {
    setCurrentItem(item);
    setShowItemModal(true);
  }, []);

  const itemColumns = useMemo(
    () =>
      getBudgetItemColumns({
        onDelete: handleDeleteBudget,
        onEdit: handleEditBudget,
      }),
    [handleDeleteBudget, handleEditBudget],
  );

  const watchType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: defaultValues.type,
  });

  const handleCalculateTotal = useCallback(() => {
    let totalAmount = 0;
    const items = form.getValues("items")!;
    const updatedItems = items.map((item) => {
      const price =
        watchType === "retail"
          ? item.retailPrice
            ? item.retailPrice.toString()
            : "0"
          : item.wholesalePrice
            ? item.wholesalePrice.toString()
            : "0";
      const amount = +price * +item.quantity;
      totalAmount += amount;
      return {
        ...item,
        price: price.toString(),
        amount: amount.toString(),
      };
    });
    form.setValue("items", updatedItems);
    form.setValue("totalAmount", totalAmount.toString());
  }, [form, watchType]);

  useEffect(() => {
    if (budget) {
      handleCalculateTotal();
    }
  }, [watchType, budget, handleCalculateTotal]);

  const handleShowItemModal = () => {
    setCurrentItem(null);
    setShowItemModal(true);
  };

  const handleAddItem = (item: BudgetItemRow) => {
    form.setValue("items", [...form.getValues("items"), item], {
      shouldDirty: true,
    });
    handleCalculateTotal();
  };

  const handleEditItem = (item: BudgetItemRow) => {
    const items = form.getValues("items")!;
    const updatedItems = items.map((i) => (i.id === item.id ? item : i));
    form.setValue("items", updatedItems, {
      shouldDirty: true,
    });
    handleCalculateTotal();
  };

  const handleConfirmDelete = () => {
    const items = form.getValues("items")!;
    const updatedItems = items.filter((i) => i.id !== currentItem?.id);
    form.setValue("items", updatedItems, {
      shouldDirty: true,
    });
    handleCalculateTotal();
  };

  const onSubmit = async (data: z.infer<typeof BudgetFormSchema>) => {
    const budgetData = {
      customerId: data.customerId || 0,
      responsibleId: Number(data.responsibleId),
      observation: data.observation || "",
      showCuit: data.showCuit ?? false,
      expiresAt: data.expiresAt?.toISOString() || undefined,
      type: data.type || "retail",
      totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : 0,
      status: data.status || ("pending" as BudgetStatus),
      products: data.items.map((item) => ({
        id: item.productId || 0,
        variantId: item.variantId ?? null,
        name: item.name,
        slug: item.slug,
        image: item.imageUrl || "",
        price: item.price ? parseFloat(item.price) : 0,
        quantity: item.quantity ? parseInt(item.quantity) : 0,
        amount: item.amount ? parseFloat(item.amount) : 0,
        observation: item.observation || "",
        customText: item.customText || "",
        attributes: item.attributes ?? null,
        values: item.values ?? null,
      })),
    };

    if (mode === "CREATE") {
      await createBudgetMutation.mutateAsync(budgetData as unknown as Budget);
    } else {
      await updateBudgetMutation.mutateAsync({
        id: id?.toString() || "",
        data: budgetData as unknown as UpdateBudgetData,
      });
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  return {
    budget,
    form,
    isLoading,
    mode,
    itemColumns,
    currentItem,
    showItemModal,
    deleteModalIsOpen,
    isPending: createBudgetMutation.isPending || updateBudgetMutation.isPending,
    customerModalIsOpen,
    setCustomerModalIsOpen,
    setDeleteModalIsOpen,
    handleConfirmDelete,
    handleShowItemModal,
    setShowItemModal,
    setCurrentItem,
    handleEditItem,
    handleAddItem,
    onSubmit,
    onError,
  };
};
