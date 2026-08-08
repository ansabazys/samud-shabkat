import { useQuery } from "@tanstack/react-query";
import { inventoryApi, type InventoryDetails } from "@/lib/api/inventory-api";

export function useInventoryQuery(productId: string) {
  return useQuery<InventoryDetails>({
    queryKey: ["inventory", productId],
    queryFn: () => inventoryApi.getProductInventory(productId),
    enabled: !!productId,
    staleTime: 1000 * 15, // 15 seconds
  });
}
