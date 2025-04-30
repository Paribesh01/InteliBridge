"use client";

import { useQuery } from "@tanstack/react-query";
import { AvailableWorkflow } from "@/types";
import { useSession } from "next-auth/react";
import api from "@/lib/axios_instance";

export function useWorkflows() {
  return useQuery<{ workflows: AvailableWorkflow[] }>({
    queryKey: ["workflows"],
    queryFn: async () => {
      const session = useSession();

      if (session.status !== "authenticated") {
        throw new Error("Unauthorized: No valid session");
      }

      const accessToken = session.data?.accessToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      const response = await api.get("/workflow/availableWorkflow", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) {
        throw new Error("Failed to fetch workflows");
      }

      return response.data as { workflows: AvailableWorkflow[] };
    },
  });
}
