import { Leaf, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ImpactMeterProps {
  sdg13Impact: number;
  topCategory: string;
}

export function ImpactMeter({ sdg13Impact, topCategory }: ImpactMeterProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>SDG 13 Impact</CardTitle>
          <CardDescription>Climate action alignment</CardDescription>
        </div>
        <Target className="h-5 w-5 text-cyan-300" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-end justify-between gap-3">
            <span className="text-4xl font-semibold tracking-normal text-white">{sdg13Impact}%</span>
            <span className="text-right text-xs text-muted-foreground">Compared with global average</span>
          </div>
          <Progress value={sdg13Impact} />
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-200">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            Highest leverage area
          </div>
          <p className="text-sm text-muted-foreground">
            Prioritize <span className="font-medium text-white">{topCategory}</span> this month to make the fastest measurable progress.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
