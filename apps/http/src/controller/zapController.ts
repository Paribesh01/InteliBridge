import { Request, Response } from "express";
import prisma from "../db";

export const GetAllZap = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const zaps = await prisma.zap.findMany({
      where: {
        userId: req.user.userId,
      },
    });

    if (zaps && zaps.length > 0) {
      res.json({ zaps });
      return;
    } else {
      res.status(404).json({ error: "No zaps found" });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
    return;
  }
};

export const getAllZapsWithPagination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt((req.query.limit as string) || "10", 10);

    const zaps = await prisma.zap.findMany({
      where: { userId },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        trigger: {
          include: {
            type: true,
          },
        },
        workflows: {
          include: {
            type: true,
          },

          orderBy: {
            index: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get the last item for next cursor
    const lastZap = zaps[zaps.length - 1];
    const nextCursor = lastZap?.id;

    res.json({
      zaps,
      nextCursor,
      hasMore: zaps.length === limit,
    });
    return;
  } catch (error) {
    console.error("Error fetching zaps:", error);
    res.status(500).json({ error: "Failed to fetch zaps" });
    return;
  }
};

export const GetOneZap = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const zap = await prisma.zap.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      select: {
        id: true,
        workflows: {
          select: {
            id: true,
            type: {
              select: {
                name: true,
              },
            },
            metaData: true,
          },
        },
        trigger: {
          select: {
            id: true,
            type: {
              select: {
                name: true,
              },
            },
            metaData: true,
          },
        },
      },
    });

    if (zap) {
      res.json({ zap });

      return;
    } else {
      res.status(404).json({ error: "No zap found" });
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
    return;
  }
};

interface CreateZapInput {
  name: string;
  description?: string;
  triggerId: string;
  workflowIds: string[];
}

export const createZap = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const userId = req.user?.userId;

  try {
    if (!name) {
      res.status(400).send("Invalid input data");
      return;
    }

    const zap = await prisma.zap.create({
      data: {
        name,
        userId,
        description,
      },
    });

    res.status(201).json(zap);
  } catch (e) {
    console.error(e);
    res.status(500).send("Something went wrong");
  }
};

export const updateZapTrigger = async (req: Request, res: Response) => {
  const { triggerId } = req.body;
  const { zapid } = req.params;

  try {
    if (!triggerId) {
      res.status(400).send("Missing trigger ID");
    }

    const zap = await prisma.zap.findUnique({ where: { id: zapid } });

    if (!zap) {
      res.status(404).send("Zap not found");
    }

    const existingTrigger = await prisma.trigger.findFirst({
      where: { zapId: zapid },
    });

    let trigger;
    if (existingTrigger) {
      trigger = await prisma.trigger.update({
        where: { id: existingTrigger.id },
        data: { triggerId },
      });
    } else {
      trigger = await prisma.trigger.create({
        data: {
          triggerId,
          zapId: zapid as string,
        },
      });
    }

    res.status(200).json(trigger);
  } catch (e) {
    console.error("Error while updating a zap trigger:", e);
    res.status(500).send("Internal server error");
  }
};

export const updateZapWorkflow = async (req: Request, res: Response) => {
  const { workflowid } = req.body;
  const { zapid } = req.params;

  try {
    if (!workflowid) {
      res.status(400).send("Missing workflow ID");
    }

    const zap = await prisma.zap.findUnique({ where: { id: zapid } });
    if (!zap) {
      res.status(404).send("Zap not found");
    }

    const maxIndexWorkflow = await prisma.workflow.findFirst({
      where: { zapId: zapid },
      orderBy: { index: "desc" },
    });

    let newIndex = 0;
    if (maxIndexWorkflow) {
      newIndex = maxIndexWorkflow.index + 1;
    }

    const workflow = await prisma.workflow.create({
      data: {
        workflowId: workflowid.workflowId,
        zapId: zapid as string,
        index: newIndex,
      },
    });

    res.status(200).json(workflow);
  } catch (e) {
    console.error("Error while updating a zap workflow:", e);
    res.status(500).send("Internal server error");
  }
};

export const getTriggerDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const trigger = await prisma.trigger.findUnique({
      where: { id },
      select: {
        id: true,
        accessToken: true,
        metaData: true,
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!trigger) {
      res.status(404).json({ error: "Trigger not found" });
    } else {
      res.json({
        trigger: {
          ...trigger,
          auth: trigger?.accessToken ? true : false,
          accessToken: "",
        },
      });
    }
  } catch (e) {
    console.error("Error fetching trigger details:", e);
    res.status(500).send("Internal server error");
  }
};

export const getWorkflowDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      select: {
        id: true,
        accessToken: true,
        metaData: true,
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!workflow) {
      res.status(404).json({ error: "Workflow not found" });
    } else {
      res.json({
        workflow: {
          ...workflow,
          auth: workflow?.accessToken ? true : false,
          accessToken: "",
        },
      });
    }
  } catch (e) {
    console.error("Error fetching workflow details:", e);
    res.status(500).send("Internal server error");
  }
};

export const deleteZap = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const zapId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!zapId) {
      res.status(400).json({ error: "Zap ID is required" });
      return;
    }

    const zap = await prisma.zap.findFirst({
      where: {
        id: zapId,
        userId,
      },
    });

    if (!zap) {
      res.status(500).json({ error: "Zap not found" });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.webhookZap.deleteMany({
        where: { zapId },
      });

      await tx.workflow.deleteMany({
        where: { zapId },
      });

      await tx.trigger.deleteMany({
        where: { zapId },
      });

      await tx.zap.delete({
        where: { id: zapId },
      });
    });

    res.status(200).json({ message: "Zap successfully deleted" });
    return;
  } catch (error) {
    console.error("Error deleting zap:", error);
    return res.status(500).json({ error: "Failed to delete zap" });
  }
};
