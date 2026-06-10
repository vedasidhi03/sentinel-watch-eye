import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAnimatedCounter } from "@/hooks/use-sentinel";
import { RiskBadge } from "./RiskBadge";
import { riskColorVar, type RiskLevel } from "@/lib/sentinel";

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  accent?: "default" | "critical";
}

export function StatCard({ label, value, description, icon, accent = "default" }: StatCardProps) {
  const count = useAnimatedCounter(value);
  const isCritical = accent === "critical";
  return (
    <div
      className={cn(
        "glass group relative overflow-hidden rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5",
        isCritical && "glow-critical",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={cn("text-muted-foreground", isCritical ? "text-risk-critical" : "text-primary")}>
          {icon}
        </span>
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-4xl font-bold tabular-nums",
          isCritical ? "text-risk-critical text-glow" : "text-foreground",
        )}
      >
        {count}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
    </div>
  );
}

export function AlertLevelCard({ level }: { level: RiskLevel }) {
  return (
    <div className="glass group relative overflow-hidden rounded-xl p-4 glow-critical">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Current Alert Level
        </span>
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-risk-critical opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-risk-critical" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight text-risk-critical text-glow">
        {level}
      </div>
      <div className="mt-2">
        <RiskBadge level={level} pulse />
      </div>
    </div>
  );
}
