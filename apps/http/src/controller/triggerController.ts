import { Response, Request } from "express";
import prisma from "../db";

export const getAllTrigger = async (req: Request, res: Response) => {
  try {
    const triggers = await prisma.availableTrigger.findMany({
      include:{
        triggers:true
      }
    });
    
    console.log("triggers", triggers);
    res.json({ triggers });
  } catch (e) {
    console.log(e);
    res.status(500).send("somehthing went wrong");
  }
};

// need to handle this classification