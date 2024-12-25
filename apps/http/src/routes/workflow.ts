import express from "express"
import { authenticateToken } from "../middleware/userAuth";
import { getAllWorkflow } from "../controller/workflowController";
import { callbackGithubApp, installGithubApp } from "../controller/githubZapCreation";


const WorkflowRouter = express.Router()


WorkflowRouter.get("/availableWorkflow", authenticateToken(), getAllWorkflow)
WorkflowRouter.get("/github/install", installGithubApp)
WorkflowRouter.post("/github/callback", callbackGithubApp)


export default WorkflowRouter;



