import { Request, Response } from "express";
import prisma from "../db";

export const setSub = async (req: Request, res: Response) => {
  const { app } = req.params;
  const { subType, id } = req.body;

  if (!id || !subType) {
    res.status(400).send({ message: "Missing required fields: id or subType" });
  }

  try {
    const workflow = await prisma.workflow.findUnique({ where: { id } });

    if (workflow) {

      const updatedWorkflow = await prisma.workflow.update({
        where: { id },
        data: {
          metaData: {
            ...(workflow.metaData as object),
            subType: subType,
          },
        },
      });
      res.status(200).send(updatedWorkflow);
    } else {
      const trigger = await prisma.trigger.findUnique({ where: { id } });

      if (trigger) {

        const updatedTrigger = await prisma.trigger.update({
          where: { id },
          data: {
            metaData: {
              ...(trigger.metaData as object),
              subType: subType,
            },
          },
        });
        res.status(200).send(updatedTrigger);
      } else {

        console.log("ID is not matched");
        res.status(404).send({ message: "ID not found for workflow or trigger" });
      }
    }
  } catch (error) {
    console.error("Error while adding subType:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
