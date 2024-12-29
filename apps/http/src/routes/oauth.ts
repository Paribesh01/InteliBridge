import express from "express";
import { authenticateToken } from "../middleware/userAuth";
import { getAllTrigger } from "../controller/triggerController";
import { callback, createWebhook, OAuth } from "../controller/OauthCreation";

const oauthRouter = express.Router();

oauthRouter.get("/oauth/:id/:app", OAuth);
oauthRouter.get("/:app/callback", callback);
oauthRouter.post("/webhook/:app", authenticateToken(),createWebhook);

export default oauthRouter;