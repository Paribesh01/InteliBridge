import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";

interface ConfirmSetupProps {
  onConfirm: () => void;
  selectedApp: { app: string; subtype: string; id: string };
}

export default function ConfirmSetup({ selectedApp, onConfirm }: ConfirmSetupProps) {
  const { id: zapid } = useParams(); 

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/o/webhook/${selectedApp.app}`,
        {
          id: selectedApp.id, 
          zapid, 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Setup confirmed successfully:", response.data);


      if (onConfirm) {
        onConfirm();
      }
    } catch (error: any) {

      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Error confirming setup:", error.message);
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Confirm Setup</h3>
      <p className="mb-4">Please review your configuration and click the button below to confirm.</p>
      <Button onClick={handleConfirm}>Confirm Setup</Button>
    </div>
  );
}
