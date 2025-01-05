import axios from "axios";
import { useState } from "react";

export default function useSignup() {
  const [data, setData] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log("here 2");
  const signup = async (username: string, email: string, password: String) => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await axios.post(
        "http://localhost:8000/api/v1/auth/signup",
        { username, email, password }
      );
      console.log("here 3");
      setData(response.data);
      console.log(response.data);
    } catch (err) {
      const axiosError = err as any;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Login failed. Please try again."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, signup };
}
