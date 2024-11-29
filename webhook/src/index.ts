


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
    const body = req.body;


        const run = await client.webhookZap.create({
            data: {
                zapId: zapId,
            }
        });;

       

    res.json({
        message: "Webhook received"
    })
})



app.listen(3001,()=>{
    console.log("Listiing on port 3000");
})