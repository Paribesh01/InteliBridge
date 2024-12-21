import { Response, Request } from "express";
import prisma from "../db";

export const getAllTrigger = async (req: Request, res: Response) => {
  try {
    const Triggers = await prisma.availableTrigger.findMany({});
    res.json({ triggers: Triggers });
  } catch (e) {
    console.log(e);
    res.status(500).send("somehthing went wrong");
  }
};
