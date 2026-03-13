import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentAttendance, requiredThreshold, examWeight, userId, subjectName } = body;

    if (!currentAttendance || !requiredThreshold || examWeight === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // "Risk Level" or rather "Safe-to-Skip Score"
    // Formula from blueprint: Current Attendance / Required Threshold * Upcoming Exam Weight
    // (If examWeight is high, score is higher; if attendance is high, score is higher)
    const score = (currentAttendance / requiredThreshold) * examWeight;
    
    // Normalize to a percentage of 0-100 for display
    const safePercentage = Math.min(Math.max((score / 2) * 100, 0), 100);

    // Save calculation to AttendanceLog if userId is provided
    if (userId && subjectName) {
      await prisma.attendanceLog.create({
        data: {
          userId,
          subjectName,
          status: "Predicted",
          skipSafeProbability: safePercentage,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      score,
      safePercentage,
      recommendation: safePercentage > 75 ? "Safe to Skip" : "Highly Recommended to Attend" 
    });
  } catch (error) {
    console.error("Predictor Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
