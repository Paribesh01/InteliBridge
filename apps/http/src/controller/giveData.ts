import express, { Request, Response } from "express"
import { appRegistry } from "../apps/file/app"




export const giveSubTriggers = (req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = appRegistry[app as string].triggers
        if(!data){
            res.send("app is not there")
            console.log("app is not there")
        }
        res.json({triggers:data})

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}

export const giveSubWokflows = (req:Request,res:Response)=>{

    const {app} = req.params

    try{

        const data = appRegistry[app as string].workflows

        res.json({workflows:data})

    }catch(e){
        console.log("error while giving a subtrigger")
        res.send("internel server error")
    }




}