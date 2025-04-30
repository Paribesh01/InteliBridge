"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap } from "@/types";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";

interface CreateZapInput {
  name: string;
  description?: string;
  triggerId: string;
  workflowIds: string[];
}

export function useCreateZap() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  return useMutation<Zap, Error, CreateZapInput>({
    mutationFn: async (data) => {
      if (status !== "authenticated") {
        throw new Error("Unauthorized: No valid session");
      }

      const accessToken = session?.accessToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      try {
        const response = await api.post("/zap", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return response.data as Zap;
      } catch (error) {
        console.log(error)
        throw new Error("Failed to create zap");
      }
    },
    onSuccess: () => {
      // Invalidate the zaps query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
}
