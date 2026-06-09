import { Gauge } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreGaugeProps {
  score: number;
  yearlyTons: number;
  status: "excellent" | "on-track" | "needs-action";
}

const statusCopy = {
  excellent: "Excellent",
  "on-track": "On track",
  "needs-action": "Needs action"
};

export function ScoreGauge({ score, yearlyTons, status }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 72;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Carbon Score</CardTitle>
          <CardDescription>Personal sustainability rating</CardDescription>
        </div>
        <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto flex aspect-square max-w-[230px] items-center justify-center">
          <div className="absolute inset-6 rounded-full border border-primary/20 animate-pulse-ring" />
          <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180" role="img">
            <circle
              cx="90"
              cy="90"
              r="72"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="14"
            />
            <circle
              cx="90"
              cy="90"
              r="72"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeLinecap="round"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="20" y1="20" x2="160" y2="160">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className="text-5xl font-semibold tracking-normal text-white">{score}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">out of 100</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Badge className="border-primary/30 bg-primary/10 text-primary">{statusCopy[status]}</Badge>
          <Badge>{yearlyTons.toFixed(2)} tCO2e/year</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
