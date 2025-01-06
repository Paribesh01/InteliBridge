import express from "express"
import { authenticateToken } from "../middleware/userAuth";
import { createZap, GetAllZap, GetOneZap, getTriggerDetails, getWorkflowDetails, updateZapTrigger, updateZapWorkflow } from "../controller/zapController";


const ZapRouter  = express.Router()


ZapRouter.post("/",authenticateToken(),createZap)
ZapRouter.get("/",authenticateToken(),GetAllZap)
ZapRouter.get("/:id",authenticateToken(),GetOneZap)
ZapRouter.post("/updateZapWorkflow/:zapid",authenticateToken(),updateZapWorkflow)
ZapRouter.post("/updateZapTrigger/:zapid",authenticateToken(),updateZapTrigger)
ZapRouter.get("/trigger/:id",authenticateToken(),getTriggerDetails)
ZapRouter.get("/workflow/:id",authenticateToken(),getWorkflowDetails)






export default ZapRouter;