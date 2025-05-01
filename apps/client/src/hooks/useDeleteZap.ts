"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";

export function useDeleteZap() {
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (zapId: string) => {
      if (!session) {
        throw Error("Not a valid session");
      }

      const response = await api.delete(`/zap/${zapId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.jwtToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
}
