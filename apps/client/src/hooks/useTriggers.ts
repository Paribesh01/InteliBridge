"use client";

import { useQuery } from "@tanstack/react-query";
import { AvailableTrigger } from "@/types";
import { useSession } from "next-auth/react";
import api from "@/lib/axios_instance";

export function useTriggers() {
  return useQuery<{ triggers: AvailableTrigger[] }>({
    queryKey: ["triggers"],
    queryFn: async () => {
      const session = useSession();

      if (session.status !== "authenticated") {
        throw new Error("Unauthorized: No valid session");
      }

      const accessToken = session.data?.accessToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      const response = await api.get("/trigger/availableTrigger", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to fetch triggers");
      }

      return response.data as { triggers: AvailableTrigger[] };
    },
  });
}
