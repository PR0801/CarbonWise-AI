"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardCalculation, MonthlyRecord } from "@/components/types";

interface AnalyticsDashboardProps {
  calculation: DashboardCalculation;
  history: MonthlyRecord[];
}

const tooltipStyle = {
  background: "rgba(8, 13, 19, 0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  color: "#f8fafc"
};

export function AnalyticsDashboard({ calculation, history }: AnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Monthly Analytics</CardTitle>
          <CardDescription>Saved locally and ready for Vercel deployment</CardDescription>
        </div>
        <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="footprintFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#e2e8f0" }} />
              <Area
                dataKey="footprint"
                name="tCO2e/year"
                stroke="#22d3ee"
                strokeWidth={3}
                fill="url(#footprintFill)"
                type="monotone"
              />
              <Area
                dataKey="goal"
                name="goal"
                stroke="#a3e635"
                strokeDasharray="5 5"
                strokeWidth={2}
                fill="transparent"
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="h-[132px] min-w-0 rounded-md border border-white/10 bg-white/[0.03] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculation.categories} layout="vertical" margin={{ left: 0, right: 12 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={82}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="monthlyKg" name="kg CO2e/month" radius={[0, 6, 6, 0]}>
                  {calculation.categories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-[132px] min-w-0 rounded-md border border-white/10 bg-white/[0.03] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Pie
                  data={calculation.categories}
                  dataKey="monthlyKg"
                  innerRadius={35}
                  outerRadius={54}
                  paddingAngle={4}
                >
                  {calculation.categories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
