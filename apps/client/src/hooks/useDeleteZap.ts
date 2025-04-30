"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/axios_instance";

export function useDeleteZap() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  return useMutation({
    mutationFn: async (zapId: string) => {

      if (status !== "authenticated" || !session) {
        throw new Error("Unauthorized: No valid session");
      }


      const accessToken = session.accessToken;

      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      const response = await api.delete(`/zap/${zapId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
}
