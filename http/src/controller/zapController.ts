import { Request, Response } from "express";
import prisma from "../db";


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
  const { name, workflows, triggerId } = req.body;
  try {
    if (!name || !workflows || !Array.isArray(workflows) || !triggerId) {
       res.status(400).send("Invalid input data");
    }

    if (!req.user?.userId) {
       res.status(401).send("Unauthorized");
    }

    const zap = await prisma.zap.create({
      data: {
        name,
        userId: req.user?.userId as string, 
        workflows: {
          create: workflows.map((workflow: any, index: number) => ({
            workflowId: workflow.workflowId,
            index: index, 
          })),
        },
        trigger: {
          create: {
            triggerId,
          },
        },
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
