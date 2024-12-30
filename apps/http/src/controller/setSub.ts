import { Request, Response } from "express";
import prisma from "../db";

export const setSub = async(req:Request,res:Response)=>{

    const {app}  = req.params
    const {subType,id}  =req.body    

    try{
        const workflow = await prisma.workflow.findUnique({where:{id}})

        if(!workflow){
            const trigger = await prisma.trigger.findUnique({where:{id}})

            if(!trigger){
                console.log("id is not matched")
                res.send("id is not matched")
            }else {
                const trigger = await prisma.trigger.update({where:{id},data:{
                    metaData:{subType:subType}
                }})
                res.send(trigger)
            }
        }else {
            const workflow = await prisma.workflow.update({where:{id},data:{
                metaData:{subType:subType}
            }})
            res.send(workflow)
        }
    }catch(e){
        console.log("Error while add sub",e)
        res.send("Internel server error")
    }






}