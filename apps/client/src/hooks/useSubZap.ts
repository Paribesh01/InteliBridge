import api from "@/lib/axios_instance";
import { useMutation } from "@tanstack/react-query";

export const useGetSubZap = () => {
  const {
    mutate: getSub,
    data,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.get(`/getSub/${id}`);
      return response.data;
    },
  });

  return { getSub, data, isPending, error };
};
