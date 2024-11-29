


import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const app = express()

app.use(cors())

app.use(express.json())
const client  = new PrismaClient()

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;

        const user = await client.user.findUnique({where:{id:userId}})
        if(user){

            const run = await client.webhookZap.create({
                data: {
                    zapId: zapId,
                }
            });
        }else {
            res.send("User not found").status(401)
        }


    res.json({
        message: "Webhook received"
    })
})



app.listen(3001,()=>{
    console.log("Listiing on port 3000");
})