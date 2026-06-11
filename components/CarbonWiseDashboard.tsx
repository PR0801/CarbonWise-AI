"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CloudSun, Database, Leaf, ShieldCheck, TrendingDown } from "lucide-react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { CalculatorForm } from "@/components/CalculatorForm";
import { GoalTracker } from "@/components/GoalTracker";
import { ImpactMeter } from "@/components/ImpactMeter";
import { MetricCard } from "@/components/MetricCard";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calculateCarbonFootprint,
  defaultCarbonInput,
  generateEcoRecommendations
} from "@/lib/carbonCalculator";
import type {
  DashboardCalculation,
  DashboardInput,
  DashboardRecommendation,
  MonthlyRecord
} from "@/components/types";

const inputKey = "carbonwise.input";
const historyKey = "carbonwise.history";
const goalKey = "carbonwise.goal";
const defaultGoal = 2.8;

function parseStorage<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function monthLabel(offset = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  return date.toLocaleDateString("en", { month: "short" });
}

function buildHistory(calculation: DashboardCalculation, goal: number): MonthlyRecord[] {
  return Array.from({ length: 6 }, (_, index) => {
    const drift = (index - 5) * 0.09;
    const footprint = Math.max(0.6, calculation.yearlyTons + drift);
    return {
      month: monthLabel(index - 5),
      footprint: Number(footprint.toFixed(2)),
      score: Math.max(0, Math.min(100, calculation.score - (5 - index) * 2)),
      goal
    };
  });
}

function upsertHistory(
  records: MonthlyRecord[],
  calculation: DashboardCalculation,
  goal: number
) {
  const month = monthLabel();
  const nextRecord = {
    month,
    footprint: calculation.yearlyTons,
    score: calculation.score,
    goal
  };
  const withoutCurrent = records.filter((record) => record.month !== month);
  return [...withoutCurrent, nextRecord].slice(-6);
}

export function CarbonWiseDashboard() {
  const initialCalculation = useMemo(
    () => calculateCarbonFootprint(defaultCarbonInput),
    []
  );
  const [input, setInput] = useState<DashboardInput>(defaultCarbonInput);
  const [calculation, setCalculation] =
    useState<DashboardCalculation>(initialCalculation);
  const [recommendations, setRecommendations] = useState<DashboardRecommendation[]>(
    () => generateEcoRecommendations(defaultCarbonInput, initialCalculation)
  );
  const [history, setHistory] = useState<MonthlyRecord[]>(() =>
    buildHistory(initialCalculation, defaultGoal)
  );
  const [goal, setGoal] = useState(defaultGoal);
  const [insight, setInsight] = useState(
    "Your largest category is prioritized for quick, measurable climate action."
  );
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedInput = localStorage.getItem(inputKey);
    const savedHistory = localStorage.getItem(historyKey);
    const savedGoal = localStorage.getItem(goalKey);

    const nextGoal = savedGoal ? Number(savedGoal) : defaultGoal;
    const nextInput = {
      ...defaultCarbonInput,
      ...parseStorage<Partial<DashboardInput>>(savedInput, {})
    };
    const nextCalculation = calculateCarbonFootprint(nextInput);
    const safeGoal = Number.isFinite(nextGoal) ? nextGoal : defaultGoal;
    const fallbackHistory = buildHistory(nextCalculation, safeGoal);
    const nextHistory = parseStorage<MonthlyRecord[]>(savedHistory, fallbackHistory);

    setInput(nextInput);
    setCalculation(nextCalculation);
    setGoal(safeGoal);
    setRecommendations(generateEcoRecommendations(nextInput, nextCalculation));
    setHistory(Array.isArray(nextHistory) ? nextHistory : fallbackHistory);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(inputKey, JSON.stringify(input));
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(goalKey, String(goal));
  }, [goal, history, hydrated, input]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const [calculationResponse, recommendationsResponse] = await Promise.all([
        fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input })
        }),
        fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input })
        })
      ]);

      if (!calculationResponse.ok || !recommendationsResponse.ok) {
        throw new Error("API request failed");
      }

      const calculationData = (await calculationResponse.json()) as {
        calculation: DashboardCalculation;
      };
      const recommendationsData = (await recommendationsResponse.json()) as {
        recommendations: DashboardRecommendation[];
        insight: string;
      };

      setCalculation(calculationData.calculation);
      setRecommendations(recommendationsData.recommendations);
      setInsight(recommendationsData.insight);
      setHistory((records) => upsertHistory(records, calculationData.calculation, goal));
    } catch {
      const fallbackCalculation = calculateCarbonFootprint(input);
      setCalculation(fallbackCalculation);
      setRecommendations(generateEcoRecommendations(input, fallbackCalculation));
      setInsight(
        `${fallbackCalculation.topCategory.name} is your highest-impact area this month.`
      );
      setHistory((records) => upsertHistory(records, fallbackCalculation, goal));
    } finally {
      setLoading(false);
    }
  };

  const goalProgress = Math.max(0, calculation.yearlyTons - goal);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-panel backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="border-teal-300/25 bg-teal-300/10 text-teal-100">
                SDG 13 - Climate Action
              </Badge>
              <Badge>LocalStorage persistence</Badge>
              <Badge>Vercel serverless APIs</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              CarbonWise AI
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Personal Carbon Footprint Analyzer for tracking emissions, goals, monthly progress, and practical climate actions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2" type="button" onClick={handleCalculate}>
              <Activity className="h-4 w-4" aria-hidden="true" />
              Run Analysis
            </Button>
            <Button
              className="gap-2"
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.removeItem(inputKey);
                localStorage.removeItem(historyKey);
                localStorage.removeItem(goalKey);
                setInput(defaultCarbonInput);
                setGoal(defaultGoal);
                const resetCalculation = calculateCarbonFootprint(defaultCarbonInput);
                setCalculation(resetCalculation);
                setRecommendations(generateEcoRecommendations(defaultCarbonInput, resetCalculation));
                setHistory(buildHistory(resetCalculation, defaultGoal));
              }}
            >
              <Database className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            detail="Current calculated footprint"
            icon={CloudSun}
            title="Monthly emissions"
            tone="cyan"
            value={`${calculation.monthlyKg.toFixed(0)} kg`}
          />
          <MetricCard
            detail="Annualized personal total"
            icon={TrendingDown}
            title="Yearly footprint"
            tone="teal"
            value={`${calculation.yearlyTons.toFixed(2)} t`}
          />
          <MetricCard
            detail={goalProgress === 0 ? "Goal achieved" : `${goalProgress.toFixed(2)} t above goal`}
            icon={ShieldCheck}
            title="Goal gap"
            tone="lime"
            value={`${Math.max(goalProgress, 0).toFixed(2)} t`}
          />
          <MetricCard
            detail="Climate action alignment"
            icon={Leaf}
            title="SDG 13 impact"
            tone="amber"
            value={`${calculation.sdg13Impact}%`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
          <div className="space-y-6">
            <CalculatorForm
              input={input}
              loading={loading}
              onCalculate={handleCalculate}
              onChange={(patch) => setInput((current) => ({ ...current, ...patch }))}
            />
            <GoalTracker
              currentYearlyTons={calculation.yearlyTons}
              goalYearlyTons={goal}
              onGoalChange={(nextGoal) => {
                setGoal(nextGoal);
                setHistory((records) =>
                  records.map((record) => ({ ...record, goal: nextGoal }))
                );
              }}
            />
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ScoreGauge
                score={calculation.score}
                status={calculation.benchmark.status}
                yearlyTons={calculation.yearlyTons}
              />
              <ImpactMeter
                sdg13Impact={calculation.sdg13Impact}
                topCategory={calculation.topCategory.name}
              />
            </div>
            <AnalyticsDashboard calculation={calculation} history={history} />
            <RecommendationsPanel insight={insight} recommendations={recommendations} />
          </div>
        </section>
      </div>
       <footer className="mt-8 border-t border-white/10 py-4 text-center text-sm text-gray-400">
        Made by <span className="font-semibold text-white">Pratyush Raunak</span>
      </footer>
    </main>
  );
}
