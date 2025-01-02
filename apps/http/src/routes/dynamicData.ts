import express from "express";
import { giveSubTriggers, giveSubWokflows } from "../controller/giveData";
import { getDynamicData, saveDynamicData } from "../controller/DynamicData";

const dymanicDataRouter = express.Router();

dymanicDataRouter.get("/:id/:app", getDynamicData);
dymanicDataRouter.post("/:id", saveDynamicData);



export default dymanicDataRouter;
