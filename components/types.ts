import type {
  CarbonCalculation,
  CarbonInput,
  EcoRecommendation
} from "@/lib/carbonCalculator";

export interface MonthlyRecord {
  month: string;
  footprint: number;
  score: number;
  goal: number;
}

export type DashboardInput = CarbonInput;
export type DashboardCalculation = CarbonCalculation;
export type DashboardRecommendation = EcoRecommendation;
