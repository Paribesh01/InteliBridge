import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(cors());
app.use(express.json());
const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;

    console.log(userId)
    console.log(zapId)
    console.log("Webhook is here man");

    try {
        const user = await client.user.findUnique({ where: { id: userId } });
        if (user) {
            const run = await client.webhookZap.create({
                data: {
                    zapId: zapId,
                },
            });
            console.log("Webhook received");
            console.log(run);
            res.json({ message: "Webhook received" });
        } else {
            console.log("Webhook received but user not found");
            res.status(401).send("User not found");
        }
    } catch (error) {
        console.log("Error processing webhook:", error);
        res.status(500).send("Internal server error");
    }
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
