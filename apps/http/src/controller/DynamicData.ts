import { Request, Response } from "express"
import prisma from "../db"
import { getDymanicDataforapp } from "../helpers/getDynamicdata"
import { Prisma } from '@prisma/client';






export const getDynamicData = async(req:Request,res:Response)=>{

    const {app,id} = req.params
   const usedId =  req.user?.userId
let token 
   try{
        const workflow = await prisma.workflow.findUnique({where:{id}})

        if(!workflow){
            const trigger = await prisma.trigger.findUnique({where:{id}})

            if(!trigger){
                console.log("id is not matched")
                res.send("id is not matched")
            }else {
                const trigger = await prisma.trigger.findUnique({where:{id}})
             token = trigger?.accessToken
            }
        }else {
            const workflow = await prisma.workflow.findUnique({where:{id}})
            token = workflow?.accessToken
        }

        const dynamicData = await getDymanicDataforapp(app as string,token as string)
        res.send({dynamicData})

    }catch(e){
        console.log("error while giving a dynamcidata")
        res.send("internel server error")
    }




}

export const saveDynamicData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {dynamicData} = req.body
    try {
        const workflow = await prisma.workflow.findUnique({ where: { id } });

        if (!workflow) {
            const trigger = await prisma.trigger.findUnique({ where: { id } });

            if (!trigger) {
                console.log("ID is not matched");
                res.status(404).send("ID is not matched");
            } else {

                const newData = { dynamicData:dynamicData }; 

                const updatedTrigger = await prisma.trigger.update({
                    where: { id },
                    data: {
                        metaData: {

                            
                                ...(trigger.metaData as Prisma.JsonObject || {}), 
                                ...newData, 
                            },
                        
                    },
                });

                console.log("Trigger updated:", updatedTrigger);
                 res.status(200).send("Trigger updated successfully");
            }
        } else {

            const newData = { dynamicData:dynamicData }; 

            const updatedWorkflow = await prisma.workflow.update({
                where: { id },
                data: {
                    metaData: {
                        set: {
                            ...(workflow.metaData as Prisma.JsonObject || {}),
                            ...newData, 
                        },
                    },
                },
            });

            console.log("Workflow updated:", updatedWorkflow);
             res.status(200).send("Workflow updated successfully");
        }
    } catch (e) {
        console.error("Error while saving dynamic data", e);
         res.status(500).send("Internal server error");
    }
};

