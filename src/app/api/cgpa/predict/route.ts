import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentCGPA, totalCreditsCompleted, targetCGPA, upcomingCredits } = body;

    if (
      currentCGPA === undefined || 
      totalCreditsCompleted === undefined || 
      targetCGPA === undefined || 
      upcomingCredits === undefined
    ) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (upcomingCredits === 0) {
      return NextResponse.json({ error: "Upcoming credits cannot be 0" }, { status: 400 });
    }

    // Formula: Target CGPA = ( (Current CGPA * Total Credits) + (Required GPA * Upcoming Credits) ) / (Total Credits + Upcoming Credits)
    // Therefore: Required GPA = [ Target CGPA * (Total Credits + Upcoming Credits) - (Current CGPA * Total Credits) ] / Upcoming Credits

    const totalFutureCredits = totalCreditsCompleted + upcomingCredits;
    const requiredGPA = ((targetCGPA * totalFutureCredits) - (currentCGPA * totalCreditsCompleted)) / upcomingCredits;

    // Cap at a theoretical max GPA of 10.0
    let isPossible = requiredGPA <= 10.0;
    
    // If it's less than 0, it means the target is already achieved unconditionally
    const safeRequiredGPA = Math.max(requiredGPA, 0);

    let message = `You need a GPA of ${safeRequiredGPA.toFixed(2)} in your upcoming ${upcomingCredits} credits to hit your target of ${targetCGPA}.`;
    
    if (!isPossible) {
      message = `Unfortunately, even a perfect 10.0 GPA in your next ${upcomingCredits} credits won't bring you up to a ${targetCGPA}. You would top out at ${(((currentCGPA * totalCreditsCompleted) + (10.0 * upcomingCredits)) / totalFutureCredits).toFixed(2)}.`;
    } else if (requiredGPA <= 0) {
      message = `Great news! Even with a 0.0 GPA, you will remain above your target of ${targetCGPA}.`;
      isPossible = true;
    }

    return NextResponse.json({ 
      success: true, 
      requiredGPA: safeRequiredGPA,
      isPossible,
      message 
    });
  } catch (error) {
    console.error("CGPA Predictor Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
