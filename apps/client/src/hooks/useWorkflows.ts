"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/axios_instance";
import { AvailableWorkflow } from "@/types";

export function useWorkflows() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      if (!session) throw new Error("Unauthorized");

      const response = await api.get("/workflow/availableWorkflow", {
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
        },
      });

      console.log(response.data)

      return response.data as { workflows: AvailableWorkflow[] };
    },
    enabled: !!session, // only run if session is available
  });
}
