import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardRecommendation } from "@/components/types";

interface RecommendationsPanelProps {
  recommendations: DashboardRecommendation[];
  insight: string;
}

export function RecommendationsPanel({
  recommendations,
  insight
}: RecommendationsPanelProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>AI Eco Recommendations</CardTitle>
          <CardDescription>{insight}</CardDescription>
        </div>
        <Sparkles className="h-5 w-5 text-amber-300" aria-hidden="true" />
      </CardHeader>
      <CardContent className="grid gap-3">
        {recommendations.map((recommendation) => (
          <article
            className="rounded-md border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]"
            key={`${recommendation.category}-${recommendation.title}`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="mr-auto min-w-0 text-sm font-semibold text-white">{recommendation.title}</h4>
              <Badge>{recommendation.difficulty}</Badge>
              <Badge className="border-primary/25 bg-primary/10 text-primary">
                -{recommendation.estimatedMonthlySavingsKg} kg/mo
              </Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{recommendation.description}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
