
import express from "express";
import userRoute from "./user";
import ZapRouter from "./zap";
import TriggerRouter from "./trigger";
import WorkflowRouter from "./workflow";
import oauthRouter from "./oauth";
import setSubRouter from "./setSub";
import giveDataRouter from "./giveData";
import dymanicDataRouter from "./dynamicData";

const router = express.Router()


router.use("/auth",userRoute);
router.use("/zap",ZapRouter)
router.use("/trigger",TriggerRouter)
router.use("/workflow",WorkflowRouter)
router.use("/o",oauthRouter)
router.use("/setSub",setSubRouter)
router.use("/giveData",giveDataRouter)
router.use("/dynamicData",dymanicDataRouter)





export default router;