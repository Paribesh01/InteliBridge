"use client";

import { useQuery } from "@tanstack/react-query";
import { Zap } from "@/types";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";

export function useZap(id: string) {
  const { data: session } = useSession();

  return useQuery<Zap, Error>({
    queryKey: ["zap", id],
    queryFn: async () => {
      if (!session) throw new Error("Unauthorized: No valid session");
      const accessToken = session.user.jwtToken;
      if (!accessToken)
        throw new Error("Unauthorized: No access token available");

      const response: any = await api.get(`/zap/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.zap as Zap;
    },
    enabled: !!id && !!session,
  });
}
