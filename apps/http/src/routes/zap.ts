import express from "express"
import { authenticateToken } from "../middleware/userAuth";
import { createZap, GetAllZap, GetOneZap, updateZapTrigger, updateZapWorkflow } from "../controller/zapController";


const ZapRouter  = express.Router()


ZapRouter.post("/",authenticateToken(),createZap)
ZapRouter.get("/",authenticateToken(),GetAllZap)
ZapRouter.get("/:id",authenticateToken(),GetOneZap)
ZapRouter.post("/updateZapWorkflow/:zapid",authenticateToken(),updateZapWorkflow)
ZapRouter.post("/updateZapTrigger/:zapid",authenticateToken(),updateZapTrigger)






export default ZapRouter;