import { NextRequest, NextResponse } from "next/server";
import {
  calculateCarbonFootprint,
  generateEcoRecommendations
} from "@/lib/carbonCalculator";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = body.input ?? body;
    const calculation = calculateCarbonFootprint(input);
    const recommendations = generateEcoRecommendations(input, calculation);

    return NextResponse.json({
      success: true,
      recommendations,
      insight: `${calculation.topCategory.name} is your highest-impact area this month. Focus there first for the fastest SDG 13 progress.`
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate recommendations. Check your input values."
      },
      { status: 400 }
    );
  }
}
