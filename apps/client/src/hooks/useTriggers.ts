"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AvailableTrigger } from "@/types";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";

export function useTriggers() {
  const { data: session } = useSession();

  return useQuery<{ triggers: AvailableTrigger[] }>({
    queryKey: ["triggers"],
    queryFn: async () => {
      if (!session) {
        throw new Error("Unauthorized: No valid session");
      }

      const response = await api.get("/trigger/availableTrigger", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.jwtToken}`,
        },
      });
      console.log("tjs tjs", response.data);

      if (!response.data) {
        throw new Error("Failed to fetch triggers");
      }

      console.log("triggers", response.data);

      return response.data as { triggers: AvailableTrigger[] };
    },
    enabled: !!session,
  });
}

interface UpdateZapTriggerInput {
  id: string;
  triggerId: string;
}

export function useUpdateZapTrigger() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({ id, triggerId }: UpdateZapTriggerInput) => {
      if (!session) {
        throw new Error("Unauthorized: No valid session");
      }
      const accessToken = session.user.jwtToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      const response = await api.post(
        `/zap/updateZapTrigger/${id}`,
        { triggerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
    },
  });
}
