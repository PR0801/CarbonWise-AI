export type DietType = "plant-based" | "balanced" | "meat-heavy";
export type ShoppingHabit = "minimal" | "average" | "frequent";

export interface CarbonInput {
  carKmPerWeek: number;
  publicTransitKmPerWeek: number;
  flightsPerYear: number;
  electricityKwhPerMonth: number;
  renewablePercent: number;
  dietType: DietType;
  meatMealsPerWeek: number;
  homeMembers: number;
  recycling: boolean;
  shoppingHabit: ShoppingHabit;
}

export interface CarbonCategory {
  name: "Travel" | "Home Energy" | "Food" | "Lifestyle";
  monthlyKg: number;
  color: string;
}

export interface CarbonCalculation {
  monthlyKg: number;
  yearlyTons: number;
  score: number;
  sdg13Impact: number;
  categories: CarbonCategory[];
  benchmark: {
    globalAverageYearlyTons: number;
    sustainableTargetYearlyTons: number;
    status: "excellent" | "on-track" | "needs-action";
  };
  topCategory: CarbonCategory;
}

const round = (value: number, digits = 1) => {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const asNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(numeric, 0) : fallback;
};

export const defaultCarbonInput: CarbonInput = {
  carKmPerWeek: 110,
  publicTransitKmPerWeek: 35,
  flightsPerYear: 2,
  electricityKwhPerMonth: 260,
  renewablePercent: 15,
  dietType: "balanced",
  meatMealsPerWeek: 7,
  homeMembers: 3,
  recycling: true,
  shoppingHabit: "average"
};

export function normalizeCarbonInput(input: Partial<CarbonInput>): CarbonInput {
  const renewablePercent = clamp(asNumber(input.renewablePercent, 0), 0, 100);
  const homeMembers = Math.max(1, Math.round(asNumber(input.homeMembers, 1)));

  return {
    carKmPerWeek: asNumber(input.carKmPerWeek),
    publicTransitKmPerWeek: asNumber(input.publicTransitKmPerWeek),
    flightsPerYear: asNumber(input.flightsPerYear),
    electricityKwhPerMonth: asNumber(input.electricityKwhPerMonth),
    renewablePercent,
    dietType: input.dietType ?? "balanced",
    meatMealsPerWeek: asNumber(input.meatMealsPerWeek),
    homeMembers,
    recycling: Boolean(input.recycling),
    shoppingHabit: input.shoppingHabit ?? "average"
  };
}

export function calculateCarbonFootprint(
  rawInput: Partial<CarbonInput>
): CarbonCalculation {
  const input = normalizeCarbonInput(rawInput);

  const carMonthlyKg = input.carKmPerWeek * 4.345 * 0.192;
  const transitMonthlyKg = input.publicTransitKmPerWeek * 4.345 * 0.065;
  const flightsMonthlyKg = (input.flightsPerYear * 250) / 12;
  const travel = carMonthlyKg + transitMonthlyKg + flightsMonthlyKg;

  const gridElectricityKg =
    input.electricityKwhPerMonth * 0.42 * (1 - input.renewablePercent / 100);
  const homeEnergy = gridElectricityKg / input.homeMembers;

  const dietBase: Record<DietType, number> = {
    "plant-based": 95,
    balanced: 150,
    "meat-heavy": 225
  };
  const meatAdjustment = input.meatMealsPerWeek * 3.4;
  const food = dietBase[input.dietType] + meatAdjustment;

  const shoppingBase: Record<ShoppingHabit, number> = {
    minimal: 45,
    average: 82,
    frequent: 138
  };
  const recyclingReduction = input.recycling ? 18 : 0;
  const lifestyle = Math.max(24, shoppingBase[input.shoppingHabit] - recyclingReduction);

  const categories: CarbonCategory[] = [
    { name: "Travel", monthlyKg: round(travel), color: "#22d3ee" },
    { name: "Home Energy", monthlyKg: round(homeEnergy), color: "#2dd4bf" },
    { name: "Food", monthlyKg: round(food), color: "#f59e0b" },
    { name: "Lifestyle", monthlyKg: round(lifestyle), color: "#a3e635" }
  ];

  const monthlyKg = round(
    categories.reduce((total, item) => total + item.monthlyKg, 0)
  );
  const yearlyTons = round((monthlyKg * 12) / 1000, 2);
  const sustainableTargetYearlyTons = 2;
  const globalAverageYearlyTons = 4.7;
  const score = Math.round(clamp(100 - (yearlyTons / globalAverageYearlyTons) * 62, 0, 100));
  const sdg13Impact = Math.round(
    clamp(((globalAverageYearlyTons - yearlyTons) / globalAverageYearlyTons) * 100, 0, 100)
  );
  const topCategory = [...categories].sort((a, b) => b.monthlyKg - a.monthlyKg)[0];

  return {
    monthlyKg,
    yearlyTons,
    score,
    sdg13Impact,
    categories,
    benchmark: {
      globalAverageYearlyTons,
      sustainableTargetYearlyTons,
      status:
        yearlyTons <= sustainableTargetYearlyTons
          ? "excellent"
          : yearlyTons <= globalAverageYearlyTons
            ? "on-track"
            : "needs-action"
    },
    topCategory
  };
}

export interface EcoRecommendation {
  title: string;
  description: string;
  category: CarbonCategory["name"];
  estimatedMonthlySavingsKg: number;
  difficulty: "Easy" | "Medium" | "Advanced";
}

export function generateEcoRecommendations(
  input: Partial<CarbonInput>,
  calculation = calculateCarbonFootprint(input)
): EcoRecommendation[] {
  const normalized = normalizeCarbonInput(input);
  const recommendations: EcoRecommendation[] = [];

  if (normalized.carKmPerWeek > 80) {
    recommendations.push({
      title: "Replace two car trips each week",
      description:
        "Shift short commutes to public transit, cycling, or carpooling to reduce your largest travel emissions quickly.",
      category: "Travel",
      estimatedMonthlySavingsKg: round(normalized.carKmPerWeek * 0.18),
      difficulty: "Medium"
    });
  }

  if (normalized.flightsPerYear > 1) {
    recommendations.push({
      title: "Bundle flights into fewer trips",
      description:
        "Combine travel plans and choose direct routes when possible. Aviation is high-impact, so fewer flight legs matter.",
      category: "Travel",
      estimatedMonthlySavingsKg: round((normalized.flightsPerYear * 38) / 12),
      difficulty: "Advanced"
    });
  }

  if (normalized.renewablePercent < 60 || normalized.electricityKwhPerMonth > 220) {
    recommendations.push({
      title: "Move your home energy mix cleaner",
      description:
        "Use renewable electricity plans where available and schedule high-load appliances during efficient hours.",
      category: "Home Energy",
      estimatedMonthlySavingsKg: round(normalized.electricityKwhPerMonth * 0.12),
      difficulty: "Medium"
    });
  }

  if (normalized.meatMealsPerWeek > 4 || normalized.dietType === "meat-heavy") {
    recommendations.push({
      title: "Make three weekly meals plant-forward",
      description:
        "Swapping meat-heavy meals for legumes, grains, and seasonal vegetables lowers food emissions without changing every meal.",
      category: "Food",
      estimatedMonthlySavingsKg: round(Math.min(45, normalized.meatMealsPerWeek * 4.8)),
      difficulty: "Easy"
    });
  }

  if (!normalized.recycling || normalized.shoppingHabit !== "minimal") {
    recommendations.push({
      title: "Set a low-waste buying rhythm",
      description:
        "Plan purchases, repair before replacing, and keep recycling consistent to shrink lifestyle emissions.",
      category: "Lifestyle",
      estimatedMonthlySavingsKg: normalized.recycling ? 16 : 28,
      difficulty: "Easy"
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "Protect your strong baseline",
      description:
        "Your footprint is already competitive. Keep tracking monthly and tighten one habit at a time.",
      category: calculation.topCategory.name,
      estimatedMonthlySavingsKg: 10,
      difficulty: "Easy"
    });
  }

  return recommendations
    .sort((a, b) => b.estimatedMonthlySavingsKg - a.estimatedMonthlySavingsKg)
    .slice(0, 5);
}
