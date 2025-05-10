import express from "express";
import { giveSub } from "../controller/giveData";

const giveDataRouter = express.Router();

giveDataRouter.get("/:id", giveSub);

export default giveDataRouter;
