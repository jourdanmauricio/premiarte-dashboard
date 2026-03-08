import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { OrderFormSchema } from "@/shared/schemas";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getOrderItemColumns } from "./table/orderItemsColumns";
import type {
  Order,
  OrderItem,
  OrderItemRow,
  OrderWithItems,
} from "@/shared/types";
import {
  useCreateOrder,
  useGetOrderById,
  useUpdateOrder,
} from "@/hooks/use-orders";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  type: "retail" as "retail" | "wholesale",
  createdAt: new Date(),
  expiresAt: new Date(new Date().setDate(new Date().getDate() + 15)),
  status: "pending" as "pending" | "delivered" | "cancelled",
  observation: "",
  totalAmount: "",
  items: [],
};

export const useOrderForm = () => {
  const [currentItem, setCurrentItem] = useState<OrderItemRow | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [customerModalIsOpen, setCustomerModalIsOpen] = useState(false);

  const { id } = useParams();
  const mode = id === "new" ? "CREATE" : "EDIT";

  const { data: order, isLoading } = useGetOrderById(
    id?.toString() || "",
    mode === "EDIT" ? true : false,
  );
  const updateOrder = useUpdateOrder();
  const createOrder = useCreateOrder();

  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (mode === "EDIT" && order) {
      setTimeout(() => {
        const orderData = {
          ...order,
          customerId: order.customerId,
          name: order.customer?.name || "",
          email: order.customer?.email || "",
          phone: order.customer?.phone || "",
          items: order.items?.map((item: OrderItem) => ({
            ...item,
            name: item.product.name,
            sku: item.product.sku || "",
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
            attributes: item.attributes ?? null,
            values: item.values ?? null,
            productVariants: item.product.variants ?? null,
          })),
          observation: order.observation ?? "",
          totalAmount: order.totalAmount ? order.totalAmount.toString() : "0",
          type: order.type || "retail",
          status: order.status as "pending" | "delivered" | "cancelled",
          createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
        };
        form.reset(orderData as unknown as z.infer<typeof OrderFormSchema>);
      }, 0);
    }
  }, [mode, order, form]);

  const handleDeleteOrder = useCallback((item: OrderItemRow) => {
    setCurrentItem(item);
    setDeleteModalIsOpen(true);
  }, []);

  const handleEditOrder = useCallback((item: OrderItemRow) => {
    setCurrentItem(item);
    setShowItemModal(true);
  }, []);

  const itemColumns = useMemo(
    () =>
      getOrderItemColumns({
        onDelete: handleDeleteOrder,
        onEdit: handleEditOrder,
      }),
    [handleDeleteOrder, handleEditOrder],
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
      // Retornar un nuevo objeto item con los valores actualizados
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
    handleCalculateTotal();
  }, [watchType, order, handleCalculateTotal]);

  const handleShowItemModal = () => {
    setCurrentItem(null);
    setShowItemModal(true);
  };

  const handleAddItem = (item: OrderItemRow) => {
    form.setValue("items", [...form.getValues("items"), item], {
      shouldDirty: true,
    });
    handleCalculateTotal();
  };

  const handleEditItem = (item: OrderItemRow) => {
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

  const onSubmit = (data: z.infer<typeof OrderFormSchema>) => {
    const basePayload = {
      customerId: data.customerId || 0,
      observation: data.observation || "",
      type: data.type || "retail",
      totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : 0,
      status:
        data.status || ("pending" as "pending" | "delivered" | "cancelled"),
      products: data.items.map((item) => ({
        productId: item.productId || 0,
        variantId: item.variantId ?? null,
        price: item.price ? parseFloat(item.price) : 0,
        retailPrice: item.retailPrice ? parseFloat(item.retailPrice) : 0,
        wholesalePrice: item.wholesalePrice
          ? parseFloat(item.wholesalePrice)
          : 0,
        quantity: item.quantity ? parseInt(item.quantity) : 0,
        amount: item.amount ? parseFloat(item.amount) : 0,
        observation: item.observation || "",
        attributes: item.attributes ?? null,
        values: item.values ?? null,
      })),
    };

    if (mode === "EDIT" && order?.id) {
      // El backend no acepta totalAmount en PUT (lo calcula desde items)
      console.log("order", basePayload);
      updateOrder.mutate({
        id: order.id.toString(),
        data: basePayload as unknown as Order,
      });
    } else {
      createOrder.mutate({
        ...basePayload,
        totalAmount: data.totalAmount ? parseFloat(data.totalAmount) : 0,
      } as unknown as Order);
    }
  };

  const onError = () => console.log("errors", form.formState.errors);

  return {
    order,
    form,
    isLoading,
    mode,
    itemColumns,
    currentItem,
    showItemModal,
    deleteModalIsOpen,
    isPending: updateOrder.isPending || createOrder.isPending,
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
