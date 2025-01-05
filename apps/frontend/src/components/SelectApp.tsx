import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAvialableTrigger from "@/hooks/AvailableTrigger";
import useAvialableWorkflow from "@/hooks/AvailableWorkflow";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface SelectAppProps {
  type: string;
  selectedApp:{app: string, subtype:string,id:string}
  onSelectApp: (app:{app: string, subtype:string,id:string} ) => void;
}

export default function SelectApp({ type, selectedApp, onSelectApp }: SelectAppProps) {
  const { id } = useParams();
  const [apps, setApps] = useState<any[]>([]); 
  const res:any = type === "trigger" ? useAvialableTrigger() : useAvialableWorkflow();


  const handleAdd = async (flowid: string) => {
    console.log("flod ud ",flowid)
    try {
      const url =
        type === "trigger"
          ? `http://localhost:8000/api/v1/zap/updateZapTrigger/${id}`
          : `http://localhost:8000/api/v1/zap/updateZapWorkflow/${id}`;
      const data =
        type === "trigger"
          ? { triggerId: flowid }
          : { workflowid: { workflowId: flowid } };

      const response:any = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(`${type === "trigger" ? "Trigger" : "Workflow"} Added:`, response.data);


      console.log(selectedApp)

      return response
    } catch (error) {
      console.error(`Error adding ${type === "trigger" ? "Trigger" : "Workflow"}:`, error);
    }
  };

  useEffect(() => {
    if (res && res.data && res.data.apps) {
      setApps(res.data.apps);
      console.log("Apps fetched:", res.data.apps);
    }
  }, [res]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select an App</h3>

      {res.loading ? (
        <p>Loading triggers...</p>
      ) : apps && apps.length > 0 ? (
        <Select
        onValueChange={async(value) => {
          console.log("Selected value:", value);
          const selectedApps = apps.find((app) => app.name === value);
          if (selectedApps) {
              
              const res = await handleAdd(selectedApps.id)
              const updatedApp = { ...selectedApp, app: value, id: res.data.id};
              console.log("Updated app object:", updatedApp);
            if(res.data)
            onSelectApp(updatedApp);
            
          }
        }}
        value={selectedApp.app || ''}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an app" />
        </SelectTrigger>
        <SelectContent>
          {apps.map((app: any) => (
            <SelectItem key={app.id} value={app.name}>
              {app.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      ) : (
        <p>No apps found</p>
      )}
    </div>
  );
}
