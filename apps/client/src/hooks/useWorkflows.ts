"use client";

import { useQuery } from "@tanstack/react-query";
import { AvailableWorkflow } from "@/types";

export function useWorkflows() {
  return useQuery<{ workflows: AvailableWorkflow[] }>({
    queryKey: ["workflows"],
    queryFn: async () => {
      const response = await fetch("/api/workflows");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch workflows");
      }
      
      return response.json();
    },
  });
} 