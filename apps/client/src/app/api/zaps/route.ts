import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import prisma from '@/lib/prisma';

// Function to get zaps with cursor-based pagination
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req: req as any, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub;
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // Query for zaps with pagination
    const zaps = await prisma.zap.findMany({
      where: { userId },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        trigger: {
          include: {
            type: true
          }
        },
        workflows: {
          include: {
            type: true
          },
          orderBy: {
            index: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get the last item for next cursor
    const lastZap = zaps[zaps.length - 1];
    const nextCursor = lastZap?.id;

    return NextResponse.json({
      zaps,
      nextCursor,
      hasMore: zaps.length === limit
    });
  } catch (error) {
    console.error('Error fetching zaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zaps' },
      { status: 500 }
    );
  }
} 