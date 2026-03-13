import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, university } = body;
    
    if (!text) {
      return NextResponse.json({ error: "No text provided for summarization" }, { status: 400 });
    }

    // MOCK LLM Summary
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockSummary = "Here is the AI-generated summary of your uploaded notes. " +
                        "Topics covered include the key formulas, important concepts, " +
                        "and highlights from the provided text.";

    // Save to Database
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.resource.create({
        data: {
          uploaderId: user.id,
          fileType: "Photo/PDF",
          summaryText: mockSummary,
          university: university || "Shoolini University",
        }
      });
    }

    return NextResponse.json({ success: true, summary: mockSummary });
  } catch (error) {
    console.error("Summarize Error:", error);
    return NextResponse.json({ error: "Failed to summarize text" }, { status: 500 });
  }
}

