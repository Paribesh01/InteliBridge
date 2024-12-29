
import express from "express";
import userRoute from "./user";
import ZapRouter from "./zap";
import TriggerRouter from "./trigger";
import WorkflowRouter from "./workflow";
import oauthRouter from "./oauth";

const router = express.Router()


router.use("/auth",userRoute);
router.use("/zap",ZapRouter)
router.use("/trigger",TriggerRouter)
router.use("/workflow",WorkflowRouter)
router.use("/o",oauthRouter)





export default router;