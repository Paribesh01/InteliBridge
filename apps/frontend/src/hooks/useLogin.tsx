import { useState } from "react";
import axios from "axios";

function useLogin() {
  const [data, setData] = useState<{ token: string; success: boolean } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        { email, password }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setData(response.data);
      console.log(data);
    } catch (err) {
      const axiosError = err as any;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Login failed. Please try again."
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, login };
}

export default useLogin;
