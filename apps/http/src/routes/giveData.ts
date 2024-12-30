import express from "express";
import { giveSubTriggers, giveSubWokflows } from "../controller/giveData";

const giveDataRouter = express.Router();

giveDataRouter.get("/trigger/:app", giveSubTriggers);
giveDataRouter.get("/workflow/:app", giveSubWokflows);



export default giveDataRouter;
