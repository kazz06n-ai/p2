import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const university = searchParams.get('university');

    const notes = await prisma.resource.findMany({
      where: university ? { university } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        uploader: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Fetch Notes Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
