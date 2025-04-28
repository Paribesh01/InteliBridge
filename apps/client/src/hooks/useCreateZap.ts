"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap } from "@/types";

interface CreateZapInput {
  name: string;
  description?: string;
  triggerId: string;
  workflowIds: string[];
}

export function useCreateZap() {
  const queryClient = useQueryClient();
  
  return useMutation<Zap, Error, CreateZapInput>({
    mutationFn: async (data) => {
      const response = await fetch("/api/zaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create zap");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the zaps query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
} 