"use client";

import type { ChangeEvent, ReactNode } from "react";
import { Calculator, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DashboardInput } from "@/components/types";
import { cn } from "@/lib/utils";

interface CalculatorFormProps {
  input: DashboardInput;
  loading: boolean;
  onChange: (patch: Partial<DashboardInput>) => void;
  onCalculate: () => void;
}

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-white/[0.04] px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CalculatorForm({
  input,
  loading,
  onChange,
  onCalculate
}: CalculatorFormProps) {
  const numberChange =
    (key: keyof DashboardInput) => (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ [key]: Number(event.target.value) } as Partial<DashboardInput>);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Footprint Calculator</CardTitle>
        <CardDescription>Travel, home energy, food, and lifestyle inputs</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Car travel" suffix="km/week">
              <Input value={input.carKmPerWeek} min={0} type="number" onChange={numberChange("carKmPerWeek")} />
            </Field>
            <Field label="Public transit" suffix="km/week">
              <Input value={input.publicTransitKmPerWeek} min={0} type="number" onChange={numberChange("publicTransitKmPerWeek")} />
            </Field>
            <Field label="Flights" suffix="per year">
              <Input value={input.flightsPerYear} min={0} type="number" onChange={numberChange("flightsPerYear")} />
            </Field>
            <Field label="Electricity" suffix="kWh/month">
              <Input value={input.electricityKwhPerMonth} min={0} type="number" onChange={numberChange("electricityKwhPerMonth")} />
            </Field>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="renewable">Renewable energy</Label>
              <span className="text-sm text-primary">{input.renewablePercent}%</span>
            </div>
            <input
              id="renewable"
              className="h-2 w-full cursor-pointer accent-teal-400"
              min={0}
              max={100}
              type="range"
              value={input.renewablePercent}
              onChange={numberChange("renewablePercent")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Diet type">
              <select
                className={selectClass}
                value={input.dietType}
                onChange={(event) => onChange({ dietType: event.target.value as DashboardInput["dietType"] })}
              >
                <option value="plant-based">Plant-based</option>
                <option value="balanced">Balanced</option>
                <option value="meat-heavy">Meat-heavy</option>
              </select>
            </Field>
            <Field label="Meat meals" suffix="per week">
              <Input value={input.meatMealsPerWeek} min={0} type="number" onChange={numberChange("meatMealsPerWeek")} />
            </Field>
            <Field label="Home members">
              <Input value={input.homeMembers} min={1} type="number" onChange={numberChange("homeMembers")} />
            </Field>
            <Field label="Shopping">
              <select
                className={selectClass}
                value={input.shoppingHabit}
                onChange={(event) => onChange({ shoppingHabit: event.target.value as DashboardInput["shoppingHabit"] })}
              >
                <option value="minimal">Minimal</option>
                <option value="average">Average</option>
                <option value="frequent">Frequent</option>
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200">
            <input
              checked={input.recycling}
              className="h-4 w-4 accent-teal-400"
              type="checkbox"
              onChange={(event) => onChange({ recycling: event.target.checked })}
            />
            Recycling and low-waste habits are active
          </label>

          <Button className="mt-1 w-full gap-2" disabled={loading} type="submit">
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Calculator className="h-4 w-4" aria-hidden="true" />
            )}
            {loading ? "Analyzing" : "Calculate Footprint"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  suffix,
  children
}: {
  label: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex min-h-4 items-center justify-between gap-2">
        <Label>{label}</Label>
        {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
      <div className={cn("min-w-0")}>{children}</div>
    </div>
  );
}
