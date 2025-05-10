"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap } from "@/types";
import api from "@/lib/axios_instance";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CreateZapInput {
  name: string;
  description: string | undefined;
}

export function useCreateZap() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSession();

  return useMutation<Zap, Error, CreateZapInput>({
    mutationFn: async (data) => {
      if (!session) {
        throw new Error("Unauthorized: No valid session");
      }

      const accessToken = session?.user.jwtToken;
      if (!accessToken) {
        throw new Error("Unauthorized: No access token available");
      }

      try {
        console.log("token", session?.user.jwtToken);
        const response = await api.post("/zap", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.jwtToken}`,
          },
        });

        console.log("Zap response", response.data);

        return response.data as Zap;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to create zap");
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["zaps"] });
      router.push(`/zap/${data.id}`);
    },
  });
}
