import express, { Request, Response } from "express";
import { appRegistry } from "../apps/file/app";
import { getSubTrigger } from "../helpers/getsubTriggers";
import { getSubWorkflows } from "../helpers/getsubWorkflows";
import prisma from "../db";

export const giveSub = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const trigger = await prisma.trigger.findUniqueOrThrow({
      where: { id },
      select: {
        type: true,
      },
    });

    if (!trigger) {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id },
        select: {
          type: true,
        },
      });

      if (!workflow) {
        res.status(404).json({ message: "app not found" });
      }
      const data = await getSubWorkflows(workflow.type.name);
      res.json(data);
    } else {
      const data = await getSubTrigger(trigger.type.name);
      res.json(data);
    }
  } catch (e) {
    console.log("error while giving a subtrigger");
    res.send("internel server error");
  }
};
