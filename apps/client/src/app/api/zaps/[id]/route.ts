import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.sub;
    const zapId = params.id;

    const zap = await prisma.zap.findFirst({
      where: {
        id: zapId,
        userId,
      },
    });

    if (!zap) {
      return NextResponse.json({ error: "Zap not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {

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

    return NextResponse.json(
      { message: "Zap successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting zap:", error);
    return NextResponse.json(
      { error: "Failed to delete zap" },
      { status: 500 }
    );
  }
} 