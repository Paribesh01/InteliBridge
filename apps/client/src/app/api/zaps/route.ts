import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.sub;
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Query for zaps with pagination
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

    return NextResponse.json({
      zaps,
      nextCursor,
      hasMore: zaps.length === limit,
    });
  } catch (error) {
    console.error("Error fetching zaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch zaps" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.sub;
    const data = await req.json();
    
    if (!data.name || !data.triggerId || !data.workflowIds || data.workflowIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate trigger exists
    const trigger = await prisma.availableTrigger.findUnique({
      where: { id: data.triggerId },
    });

    if (!trigger) {
      return NextResponse.json(
        { error: "Selected trigger not found" },
        { status: 400 }
      );
    }

    // Validate workflows exist
    const workflowCount = await prisma.availableWorkflow.count({
      where: {
        id: { in: data.workflowIds },
      },
    });

    if (workflowCount !== data.workflowIds.length) {
      return NextResponse.json(
        { error: "One or more selected workflows not found" },
        { status: 400 }
      );
    }

    // Create the Zap with trigger and workflows in a transaction
    const zap = await prisma.$transaction(async (tx) => {

      const newZap = await tx.zap.create({
        data: {
          name: data.name,
          description: data.description,
          userId,
        },
      });

      await tx.trigger.create({
        data: {
          triggerId: data.triggerId,
          zapId: newZap.id,
        },
      });

      await Promise.all(
        data.workflowIds.map((workflowId:string, index:number)=>
          tx.workflow.create({
            data: {
              workflowId,
              zapId: newZap.id,
              index,
            },
          })
        )
      );

      return tx.zap.findUnique({
        where: { id: newZap.id },
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
      });
    });

    return NextResponse.json(zap);
  } catch (error) {
    console.error("Error creating zap:", error);
    return NextResponse.json(
      { error: "Failed to create zap" },
      { status: 500 }
    );
  }
}
