import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;
    
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Step 1: Simulate context retrieval (RAG)
    // Fetch the user's recent notes to pretend we are feeding them to the LLM
    const user = await prisma.user.findFirst();
    let contextStr = "No context available.";
    if (user) {
      const recentNotes = await prisma.resource.findMany({
        where: { uploaderId: user.id },
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      if (recentNotes.length > 0) {
        contextStr = recentNotes.map(n => n.summaryText).join(' | ');
      }
    }

    // Step 2: MOCK LLM Response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple mocked logic to appear smart based on the user's message
    let aiResponse = "I'm BatchMind AI. Based on your uploaded notes, here is some study advice: Make sure to review the core formulas you recently summarized. How else can I help you study?";
    
    if (message.toLowerCase().includes("physics") || message.toLowerCase().includes("thermodynamics")) {
      aiResponse = "Based on your Physics 101 notes, remember that the ideal gas law is PV = nRT, and entropy always increases in an isolated system. Want me to generate a quick practice quiz on this?";
    } else if (message.toLowerCase().includes("quiz")) {
      aiResponse = "Sure! Question 1: What does 'R' represent in the ideal gas law? (A) Resistance (B) Universal Gas Constant (C) Radiation. Reply with your answer!";
    }

    return NextResponse.json({ 
      success: true, 
      reply: aiResponse,
      debugContextUsed: contextStr // Just for debugging the MVP
    });
  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}
