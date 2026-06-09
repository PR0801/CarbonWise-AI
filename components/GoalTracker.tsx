"use client";

import { Flag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalTrackerProps {
  currentYearlyTons: number;
  goalYearlyTons: number;
  onGoalChange: (goal: number) => void;
}

export function GoalTracker({
  currentYearlyTons,
  goalYearlyTons,
  onGoalChange
}: GoalTrackerProps) {
  const progress = Math.min((goalYearlyTons / Math.max(currentYearlyTons, 0.1)) * 100, 100);
  const gap = Math.max(currentYearlyTons - goalYearlyTons, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Goal Tracking</CardTitle>
          <CardDescription>Annual carbon target</CardDescription>
        </div>
        <Flag className="h-5 w-5 text-lime-300" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            aria-label="Decrease goal"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => onGoalChange(Math.max(0.5, Number((goalYearlyTons - 0.1).toFixed(1))))}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="min-w-0 text-center">
            <p className="text-3xl font-semibold tracking-normal text-white">{goalYearlyTons.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">tCO2e/year goal</p>
          </div>
          <Button
            aria-label="Increase goal"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => onGoalChange(Number((goalYearlyTons + 0.1).toFixed(1)))}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div>
          <div className="mb-2 flex justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Goal coverage</span>
            <span className="text-white">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="[&>div]:bg-lime-300" />
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
          {gap === 0 ? (
            <span className="text-lime-200">You are within your annual target.</span>
          ) : (
            <span>
              Reduce about <span className="font-medium text-white">{gap.toFixed(2)} tCO2e</span> per year to hit this goal.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
