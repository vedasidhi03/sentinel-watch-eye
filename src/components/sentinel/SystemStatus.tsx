import { Activity, Cpu } from "lucide-react";
import { Panel } from "./Panel";

const SYSTEMS = [
  { label: "Camera Status", value: "ONLINE" },
  { label: "Tracking Engine", value: "ACTIVE" },
  { label: "BAI Engine", value: "RUNNING" },
  { label: "Risk Escalation Engine", value: "ACTIVE" },
  { label: "Alert System", value: "ACTIVE" },
];

export function SystemStatus() {
  return (
    <Panel title="System Status" icon={<Cpu className="h-4 w-4" />}>
      <div className="space-y-2.5">
        {SYSTEMS.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 px-3 py-2"
          >
            <span className="text-xs text-foreground/85">{s.label}</span>
            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-risk-safe">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-risk-safe opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-risk-safe" />
              </span>
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Activity className="h-3.5 w-3.5 text-risk-safe" /> All subsystems nominal
      </div>
    </Panel>
  );
}
