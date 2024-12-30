import express, { Request, Response } from "express"
import { appRegistry } from "../apps/file/app"
import { getSubTrigger } from "../helpers/getsubTriggers"
import { getSubWorkflows } from "../helpers/getsubWorkflows"




export const giveSubTriggers = (req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = getSubTrigger(app as string)
        if(!data){
            res.send("app is not there")
            console.log("app is not there")
        }
        res.json(data)

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}

export const giveSubWokflows = (req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = getSubWorkflows(app as string)

        res.json(data)

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}