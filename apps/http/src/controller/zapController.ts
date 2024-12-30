import { Request, Response } from "express";
import prisma from "../db";
import { string } from "zod";


export const GetAllZap = async (req:Request,res:Response)=>{
    try{
        const zaps = await prisma.zap.findMany({where:{
            userId:req.user?.userId
        }})
        if(zaps){

            res.json({zaps:zaps})
        }else{
            res.json({error:"no zaps found"})
        }
    }catch(e){
        console.log(e)
        res.status(500).send("Something went wrong")
    }
}

export const GetOneZap  = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params
        const zap = await prisma.zap.findUnique({where:{
            userId:req.user?.userId,
            id
        }})
        if(zap){
            res.json({zap})
        }else{
            res.json({error:"no zap found"})
        }

    }catch(e){

        console.log(e)
        res.status(500).send("Something went wrong")
    }
}

export const createZap = async (req: Request, res: Response) => {
  const { name} = req.body;
  try {
    if (!name ) {
       res.status(400).send("Invalid input data");
    }

    if (!req.user?.userId) {
       res.status(401).send("Unauthorized");
    }

    const zap = await prisma.zap.create({
      data: {
        name,
        userId: req.user?.userId as string, 
       
      },
    });

    console.log(zap)

    if(zap){

      
      res.status(201).json(zap);
    }else{

      
      res.send(500).json({"error":"this is a error"})
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
  }
};



export const updateZapTrigger = async(req:Request,res:Response)=>{
  const {triggerId} = req.body
  const {zapid} = req.params

  try{

    
    const zap =  await prisma.zap.findUnique({where:{id:zapid}})
    if(zap){
      const newzap = await prisma.zap.update({where:{id:zapid},data:{
        trigger:{
          create:{
            triggerId:triggerId,
            
          }
        }
      }})
      res.send(newzap)
    }else{
      res.send("zap not found")
    }
    
  }catch(e){
    console.log("error while updaiting a zap",e)
    res.send("Internel server erro ").status(500)
  }




}
export const updateZapWorkflow = async (req:Request,res:Response) =>{


  const {workflowids} = req.body
  const {zapid} = req.params
  console.log(workflowids)

  try{

    
    const zap =  await prisma.zap.findUnique({where:{id:zapid}})
    if(zap){
      const newzap = await prisma.zap.update({
        where: { id: zapid },
        data: {
          workflows: {
            create: workflowids.map((workflowid: any, index: number) => {
      
              return {
                workflowId: workflowid.workflowId, 
              };
            })
          }
        }
      });
      
      res.send(newzap)
    }else{
      res.send("zap not found")
    }
    
  }catch(e){
    console.log("error while updaiting a zap",e)
    res.send("Internel server erro ").status(500)
  }



}
