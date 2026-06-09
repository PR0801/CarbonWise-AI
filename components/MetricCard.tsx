import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "teal" | "cyan" | "amber" | "lime";
}

const tones = {
  teal: "from-teal-400/20 text-teal-200 border-teal-300/20",
  cyan: "from-cyan-400/20 text-cyan-200 border-cyan-300/20",
  amber: "from-amber-400/20 text-amber-200 border-amber-300/20",
  lime: "from-lime-400/20 text-lime-200 border-lime-300/20"
};

export function MetricCard({ title, value, detail, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card className="animate-fade-up overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-normal text-white">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border bg-gradient-to-br to-transparent",
              tones[tone]
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
