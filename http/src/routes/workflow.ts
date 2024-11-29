import express from "express"
import { authenticateToken } from "../middleware/userAuth";
import { getAllWorkflow } from "../controller/workflowController";


const WorkflowRouter = express.Router()


WorkflowRouter.get("/availableWorkflow",authenticateToken(),getAllWorkflow)


export default WorkflowRouter;



