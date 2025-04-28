"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Zap } from "@/types";

interface ZapsResponse {
  zaps: Zap[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function useZaps(limit: number = 10) {
  return useInfiniteQuery<ZapsResponse>({
    queryKey: ["zaps"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam as string);
      params.set("limit", limit.toString());
      
      const response = await fetch(`/api/zaps?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch zaps");
      }
      
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });
} 