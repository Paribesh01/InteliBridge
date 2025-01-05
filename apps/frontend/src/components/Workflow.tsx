import useAvialableWorkflow from "@/hooks/AvailableWorkflow";
import axios from "axios";


export const AvailableWorkflow = ({ zapId, setTriggerData }:any) => { 


  const workflow: any = useAvialableWorkflow();


const handleAddWorkflow = async (workflowId: string) => {
    try {
      if (!zapId) {
        alert("Please create a Zap first!");
        return;
      }
      const res = await axios.post(
        `http://localhost:3000/api/v1/zap/updateZapWorkflow/${zapId}`,
        { workflowids:[  { workflowId:workflowId }] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTriggerData(res.data)
      console.log("Workflow Added:", res.data);
    } catch (error) {
      console.error("Error adding Workflow:", error);
    }
  };

  console.log("Workflows:", workflow);
    return (
        <>
        <h3>Workflows:</h3>
      {workflow.loading ? (
        <p>Loading workflows...</p>
      ) : workflow.data && workflow.data.workflows.length > 0 ? (
        <ul>
          {workflow.data.workflows.map((flow: any) => (
            <li key={flow.id} style={{ marginBottom: "16px" }}>
              <p>
                <strong>Name:</strong> {flow.name}
              </p>
              <button onClick={() => handleAddWorkflow(flow.id)}>Add</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workflows available</p>
      )}
        </>
    )
}