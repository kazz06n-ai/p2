import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the File out of formData to a Buffer
    const buffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);

    // Run Tesseract OCR
    const { data: { text } } = await Tesseract.recognize(
      nodeBuffer,
      'eng',
      {
        // Add logger if we want to stream progress, disabled for now
        // logger: m => console.log(m)
      }
    );

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to extract text from image" }, { status: 500 });
  }
}
