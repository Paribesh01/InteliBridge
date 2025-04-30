import { Response, Request } from "express";
import prisma from "../db";

export const getAllTrigger = async (req: Request, res: Response) => {
  try {
    const triggers = await prisma.availableTrigger.findMany({});
    res.json({ triggers });
  } catch (e) {
    console.log(e);
    res.status(500).send("somehthing went wrong");
  }
};
