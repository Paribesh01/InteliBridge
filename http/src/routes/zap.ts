import express from "express"
import { authenticateToken } from "../middleware/userAuth";
import { createZap, GetAllZap, GetOneZap } from "../controller/zapController";


const ZapRouter  = express.Router()


ZapRouter.post("/",authenticateToken(),createZap)
ZapRouter.get("/",authenticateToken(),GetAllZap)
ZapRouter.get("/:id",authenticateToken(),GetOneZap)


export default ZapRouter;