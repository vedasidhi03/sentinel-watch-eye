import { cn } from "@/lib/utils";
import { riskColorVar, type RiskLevel } from "@/lib/sentinel";

export function RiskBadge({
  level,
  className,
  pulse = false,
}: {
  level: RiskLevel;
  className?: string;
  pulse?: boolean;
}) {
  const color = riskColorVar(level);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider",
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 45%, transparent)`,
      }}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", pulse && "animate-pulse")}
        style={{ backgroundColor: color }}
      />
      {level}
    </span>
  );
}
