import { useEffect, useState } from "react";
import axios from "axios";

interface dynamicDataProp {
  selectedApp: { app: string; subtype: string; id: string };
}

interface DynamicData {
  id: string;
  name: string;
  [key: string]: any; 
}

export default function SelectDynamicData({ selectedApp }: dynamicDataProp) {
  const [dynamicData, setDynamicData] = useState<DynamicData[]>([]);
  const [selectedData, setSelectedData] = useState<string>("");

  const fetchDynamicData = async () => {
    try {
      const response: any = await axios.get(
        `http://localhost:8000/api/v1/dynamicData/${selectedApp.id}/${selectedApp.app}`
      );
      setDynamicData(response.data.dynamicData); 
      console.log("this is the dynamic data", response.data);
    } catch (error) {
      console.error("Error fetching dynamic data:", error);
    }
  };

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedData(selectedValue);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/dynamicData/${selectedApp.id}`,
        { dynamicData: selectedValue }
      );
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting dynamic data:", error);
    }
  };

  useEffect(() => {
    fetchDynamicData();
  }, [selectedApp]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Dynamic Data</h3>
      <div className="space-y-2">
        {dynamicData.length > 0 ? (
          <select
            value={selectedData}
            onChange={handleSelectChange} 
            className="w-full border rounded-md p-2"
          >
            <option value="">Select an option</option>
            {dynamicData.map((data) => (
              <option key={data.id} value={data.name}>
                {data.name}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading dynamic data...</p>
        )}
      </div>
    </div>
  );
}
