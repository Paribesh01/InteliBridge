import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";

interface SelectSubtypeProps {
  selectedSubtype: string;
  onSelectSubtype: (subtype: string) => void;
  type: string;
  selectedApp: { app: string; subtype: string; id: string };
}

export default function SelectSubtype({ type, selectedApp, selectedSubtype, onSelectSubtype }: SelectSubtypeProps) {
  const [subTypes, setSubTypes] = useState<string[]>([]);

  useEffect(() => {
    const getSubTypes = async () => {
      try {
        const res:any = await axios.get(
          `http://localhost:8000/api/v1/giveData/${type}/${selectedApp.app}`
        );
        console.log("Fetched subtypes for:", selectedApp.app, type);
        setSubTypes(res.data?.subTypes || []);
      } catch (error) {
        console.error("Error fetching subTypes:", error);
      }
    };

    getSubTypes();
  }, [selectedApp, type]);

  const handleAddSubType = async (subType: string) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/setSub/${selectedApp.app}`,
        { subType, id: selectedApp.id }, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log({ subType, id: selectedApp.id })
      console.log("SubType added successfully:", res.data);
      alert(`SubType "${subType}" added successfully.`);
      return res
    } catch (error) {
      console.error("Error adding subType:", error);
      alert(`Failed to add SubType "${subType}".`);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select a Subtype</h3>
      <Select onValueChange={async(value) => {
        
       const res:any =  await handleAddSubType(value)
        if(res.data){

            onSelectSubtype(value)
        }
        
        }}
         value={selectedSubtype}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a subtype" />
        </SelectTrigger>
        <SelectContent>
          {subTypes.map((subType, index) => (
            <SelectItem key={index} value={subType}>
              {subType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
