import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Panel } from "./Panel";
import { RiskBadge } from "./RiskBadge";
import { PAIRS, riskColorVar, riskFromBai } from "@/lib/sentinel";

export function BaiAnalysis() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <Panel title="Behavioral Attention Index Analysis" icon={<Users className="h-4 w-4" />}>
      <div className="space-y-4">
        {PAIRS.map((p) => {
          const level = riskFromBai(p.bai);
          const color = riskColorVar(level);
          return (
            <div key={p.id} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {p.a} <span className="text-muted-foreground">↔</span> {p.b}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold tabular-nums" style={{ color }}>
                    {p.bai}
                  </span>
                  <RiskBadge level={level} />
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background/60 ring-1 ring-border/60">
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-out"
                  style={{
                    width: mounted ? `${p.bai}%` : "0%",
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
