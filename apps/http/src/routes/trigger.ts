
import express from "express"
import { authenticateToken } from "../middleware/userAuth"
import { getAllTrigger } from "../controller/triggerController"

const TriggerRouter = express.Router()


TriggerRouter.get("/availableTrigger",authenticateToken(),getAllTrigger);




export default TriggerRouter