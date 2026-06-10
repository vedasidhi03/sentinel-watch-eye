import { Gauge } from "lucide-react";
import { Panel } from "./Panel";
import { RISK_BANDS, riskColorVar, riskFromBai } from "@/lib/sentinel";

const CURRENT_BAI = 94;

export function RiskEscalation() {
  const level = riskFromBai(CURRENT_BAI);
  return (
    <Panel title="Intelligent Risk Escalation Engine" icon={<Gauge className="h-4 w-4" />}>
      {/* Gradient meter */}
      <div className="relative mt-2">
        <div
          className="h-3 w-full rounded-full"
          style={{
            background:
              "linear-gradient(to right, var(--risk-safe) 0%, var(--risk-safe) 40%, var(--risk-low) 41%, var(--risk-low) 70%, var(--risk-high) 71%, var(--risk-high) 90%, var(--risk-critical) 91%, var(--risk-critical) 100%)",
          }}
        />
        {/* Marker */}
        <div
          className="absolute -top-1 -translate-x-1/2"
          style={{ left: `${CURRENT_BAI}%`, color: riskColorVar(level) }}
        >
          <div className="h-5 w-5 animate-marker-glow rounded-full border-2 border-background bg-current" />
        </div>
      </div>

      {/* Band legend */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RISK_BANDS.map((b) => {
          const color = riskColorVar(b.level);
          const active = CURRENT_BAI >= b.min && CURRENT_BAI <= b.max;
          return (
            <div
              key={b.level}
              className="rounded-lg border px-3 py-2 transition"
              style={{
                borderColor: active ? color : "var(--border)",
                backgroundColor: active ? `color-mix(in oklab, ${color} 14%, transparent)` : "transparent",
                boxShadow: active ? `0 0 18px -4px ${color}` : "none",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold tracking-wide" style={{ color }}>
                  {b.level}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{b.range}</div>
            </div>
          );
        })}
      </div>

      {/* Current readout */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-risk-critical/40 bg-risk-critical/10 px-4 py-3 glow-critical">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current BAI</div>
          <div className="font-mono text-2xl font-bold text-risk-critical text-glow">{CURRENT_BAI}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current Status</div>
          <div className="text-lg font-extrabold tracking-tight text-risk-critical text-glow">{level}</div>
        </div>
      </div>
    </Panel>
  );
}
