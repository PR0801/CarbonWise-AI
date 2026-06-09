import { NextRequest, NextResponse } from "next/server";
import { calculateCarbonFootprint } from "@/lib/carbonCalculator";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const calculation = calculateCarbonFootprint(body.input ?? body);

    return NextResponse.json({
      success: true,
      calculation
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to calculate carbon footprint. Check your input values."
      },
      { status: 400 }
    );
  }
}
