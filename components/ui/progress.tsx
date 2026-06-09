import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className
}: {
  value?: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-700"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
