"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteZap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (zapId: string) => {
      const response = await fetch(`/api/zaps/${zapId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete zap");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the zaps query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
} 