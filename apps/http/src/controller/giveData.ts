import express, { Request, Response } from "express"
import { appRegistry } from "../apps/file/app"
import { getSubTrigger } from "../helpers/getsubTriggers"
import { getSubWorkflows } from "../helpers/getsubWorkflows"




export const giveSubTriggers = async(req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = await getSubTrigger(app as string)
        if(!data){
            res.send("app is not there")
            console.log("app is not there")
        }

        console.log("this is for trigger",data)
        res.json(data)

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}

export const giveSubWokflows =async (req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = await getSubWorkflows(app as string)
        console.log("this is for workflow",data)

        res.json(data)

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}