import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function New() {

  const navigate = useNavigate()
useEffect(()=>{



  const handleCreateZap = async () => {
    try {
      const res: any = await axios.post(
        "http://localhost:8000/api/v1/zap",
        { name: "random" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Zap Created:", res.data);
      navigate(`/zap/${res.data.id}`)
      
    } catch (error) {
      console.error("Error creating Zap:", error);
    }
  };
  handleCreateZap()
},[])


 

  

  return (
    <>
      
      loading......
      
     
      
    </>
  );
}
