import express from "express";
import { setSub } from "../controller/setSub";

const setSubRouter = express.Router();

setSubRouter.post("/:app", setSub);

export default setSubRouter;
