import { Request, Response } from "express";
import prisma from "../db";

export const createZap = async (req: Request, res: Response) => {
  const { name, workflows, triggerId } = req.body;
  try {
    if (!name || !workflows || !Array.isArray(workflows) || !triggerId) {
      return res.status(400).send("Invalid input data");
    }

    if (!req.user?.userId) {
      return res.status(401).send("Unauthorized");
    }

    const zap = await prisma.zap.create({
      data: {
        name,
        userId: req.user.userId, 
        workflows: {
          create: workflows.map((workflow: any, index: number) => ({
            workflowId: workflow.workflowId,
            index: index, 
          })),
        },
        trigger: {
          create: {
            triggerId,
          },
        },
      },
    });

    res.status(201).json(zap);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
  }
};
