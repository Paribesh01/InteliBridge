import useAvialableTrigger from "@/hooks/AvailableTrigger";
import axios from "axios";


export const AvailableTrigger = ({ zapId, setTriggerData }:any)=>{

    const triggers: any = useAvialableTrigger();
    console.log("Triggers:", triggers);


    const handleAddTrigger = async (triggerId: string) => {
        try {
          if (!zapId) {
            alert("Please create a Zap first!");
            return;
          }
          const res = await axios.post(
            `http://localhost:3000/api/v1/zap/updateZapTrigger/${zapId}`,
            { triggerId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setTriggerData(res.data)
    
          console.log("Trigger Added:", res.data);
        } catch (error) {
          console.error("Error adding Trigger:", error);
        }
      };


return(
    <>
    <h3>Triggers:</h3>
    {triggers.loading ? (
        <p>Loading triggers...</p>
    ) : triggers.data && triggers.data.triggers.length > 0 ? (
        <ul>
        {triggers.data.triggers.map((trigger: any) => (
            <li key={trigger.id} style={{ marginBottom: "16px" }}>
            <img
              src={trigger.image}
              alt={trigger.name}
              style={{ width: "50px", height: "50px", borderRadius: "8px" }}
              />
            <p>
              <strong>Name:</strong> {trigger.name}
            </p>
            <button onClick={() => handleAddTrigger(trigger.id)}>Add</button>
          </li>
        ))}
      </ul>
    ) : (
        <p>No triggers available</p>
    )}
    </>
    )
}