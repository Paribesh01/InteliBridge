import express from "express";
import { giveSubTriggers, giveSubWokflows } from "../controller/giveData";
import { setSub } from "../controller/setSub";

const setSubRouter = express.Router();

setSubRouter.post("/:app", setSub);



export default setSubRouter;
