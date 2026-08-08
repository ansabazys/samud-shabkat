import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi, type CartResponse } from "@/lib/api/cart-api";
import { useCartStore } from "@/store/cart-store";

export function useCartQuery() {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => cartApi.addItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      setDrawerOpen(true);
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
}
