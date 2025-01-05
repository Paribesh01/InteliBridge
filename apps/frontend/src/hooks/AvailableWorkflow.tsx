import { useState, useEffect } from "react";
import axios from "axios";

function useAvialableWorkflow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log("token in fetch");
      console.log(localStorage.getItem("token"));

      try {
        const response: any = await axios.get(
          "http://localhost:8000/api/v1/workflow/availableWorkflow",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        const axiosError = err as any;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
}

export default useAvialableWorkflow;
