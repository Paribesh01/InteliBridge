
import { Response,Request } from "express"
import prisma from "../db"


export const getAllWorkflow = async (req:Request,res:Response)=>{
    try{
            const workflows = await prisma.availableWorkflow.findMany({})
            res.json({apps:workflows})
    }catch(e){
        console.log(e)
        res.status(500).send("somehthing went wrong")
    }
    
}