import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { Panel } from "./Panel";
import { BAI_FACTORS } from "@/lib/sentinel";

const TOTAL = BAI_FACTORS.reduce((s, f) => s + f.value, 0);

export function ExplainablePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <Panel title="Why Was This Alert Generated?" icon={<Brain className="h-4 w-4" />}>
      <p className="mb-3 text-[11px] text-muted-foreground">
        Explainable AI — contributing behavioral factors
      </p>
      <div className="space-y-3">
        {BAI_FACTORS.map((f) => (
          <div key={f.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-foreground/90">{f.label}</span>
              <span className="font-mono font-bold text-primary">+{f.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60 ring-1 ring-border/60">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
                style={{
                  width: mounted ? `${(f.value / 40) * 100}%` : "0%",
                  boxShadow: "0 0 8px var(--primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-risk-critical/40 bg-risk-critical/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Total BAI
        </span>
        <span className="font-mono text-3xl font-extrabold text-risk-critical text-glow">{TOTAL}</span>
      </div>
    </Panel>
  );
}
