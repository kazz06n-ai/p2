import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // For MVP, we get the first user to simulate an authenticated session
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const notes = await prisma.resource.findMany({
      where: { uploaderId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error("Fetch My Notes Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
