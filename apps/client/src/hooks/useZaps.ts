"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Zap } from "@/types";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";

interface ZapsResponse {
  zaps: Zap[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function useZaps(limit: number = 10) {
  const { data: session } = useSession();

  return useInfiniteQuery<ZapsResponse>({
    queryKey: ["zaps"],
    queryFn: async ({ pageParam }) => {
      if (!session) {
        throw new Error("Unauthorized: No valid session");
      }

      const params = new URLSearchParams();
      if (pageParam) params.set("cursor", pageParam as string);
      params.set("limit", limit.toString());

      const response = await api.get(`/zap/paged-zap?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.jwtToken}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to fetch zaps");
      }

      console.log(response.data);

      return response.data as ZapsResponse;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: null,
    enabled: !!session,
  });
}
