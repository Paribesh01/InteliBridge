"use client";

import { useQuery } from "@tanstack/react-query";
import { AvailableTrigger } from "@/types";

export function useTriggers() {
  return useQuery<{ triggers: AvailableTrigger[] }>({
    queryKey: ["triggers"],
    queryFn: async () => {
      const response = await fetch("/api/triggers");
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch triggers");
      }
      
      return response.json();
    },
  });
} 