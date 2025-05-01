"use client";

import { useQuery } from "@tanstack/react-query";
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

      if (!response.data) {
        throw new Error("Failed to fetch triggers");
      }

      console.log("triggers",response.data)

      return response.data as { triggers: AvailableTrigger[] };
    },
    enabled: !!session,
  });
}
