"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Zap } from "@/types";
import { useSession } from "next-auth/react";
import api from "@/lib/axios_instance";

interface ZapsResponse {
  zaps: Zap[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function useZaps(limit: number = 10) {
  return useInfiniteQuery<ZapsResponse>({
    queryKey: ["zaps"],
    queryFn: async ({ pageParam }) => {
      const session = useSession();

      if (session.status !== "authenticated") {
        throw new Error("Unauthorized: No valid session");
      }

      const accessToken = session.data?.accessToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }
      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam as string);
      params.set("limit", limit.toString());

      const response = await api.get(`/zaps?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to fetch zaps");
      }

      return response.data as ZapsResponse;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
  });
}
