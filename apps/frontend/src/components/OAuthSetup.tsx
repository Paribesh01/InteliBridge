import { Button } from "@/components/ui/button";
import axios from "axios";

interface SelectAppProps {
  selectedApp: { app: string; subtype: string; id: string };
}

export default function OAuthSetup({ selectedApp }: SelectAppProps) {
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">OAuth Setup</h3>
      <p className="mb-4">Click the button below to authenticate with the selected app.</p>
      <Button onClick={handleOAuth}>Authenticate</Button>
    </div>
  );
}
