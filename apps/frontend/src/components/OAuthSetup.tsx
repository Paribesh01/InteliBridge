import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

interface SelectAppProps {
  selectedApp: { app: string; subtype: string; id: string };
}

export default function OAuthSetup({ selectedApp }: SelectAppProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const handleOAuth = async () => {
    try {
      const { app, id } = selectedApp;
      const url = `http://localhost:8000/api/v1/o/oauth/${id}/${app}`;

      const response: any = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("OAuth Setup Successful:", response.data);

      if (response.data.redirectUrl) {
        // Open the redirect URL in a new tab or window
        window.open(response.data.redirectUrl, "_blank");
      } else {
        alert("OAuth setup completed successfully!");
      }
    } catch (error) {
      console.error("Error during OAuth setup:", error);
      alert("OAuth setup failed. Please try again.");
    }
  };
  const isAuthChecker = async () => {
    try {
      setCheckingStatus(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/o/isauth/${selectedApp.id}/${selectedApp.app}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCheckingStatus(false);
      console.log("isAuth", isAuth);
      if (res.data.isAuth) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (error) {
      console.error("Error during OAuth setup:", error);
      alert("OAuth setup failed. Please try again.");
    }
  };
  useEffect(() => {
    isAuthChecker();
  }, [selectedApp]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">OAuth Setup</h3>
      <p className="mb-4">
        Click the button below to authenticate with the selected app.
      </p>
      <Button disabled={isAuth} onClick={handleOAuth}>
        Authenticate
      </Button>
      {!isAuth && (
        <Button className="" onClick={isAuthChecker}>
          {" "}
          {checkingStatus ? "Checking Status..." : "Check Status"}
        </Button>
      )}

      {isAuth && (
        <p className="text-green-500 mt-2">Authentication successful!</p>
      )}
    </div>
  );
}
