import { Shield, Radio } from "lucide-react";
import { useClock } from "@/hooks/use-sentinel";

export function Header() {
  const now = useClock();
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <header className="glass sticky top-0 z-30 rounded-xl px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <Shield className="h-6 w-6 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-risk-safe shadow-[0_0_8px_var(--risk-safe)]" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl">
              Sentinel<span className="text-primary">Her</span>
            </h1>
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              Behavioral Attention Index Monitoring System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-risk-safe/12 px-3 py-1.5 ring-1 ring-risk-safe/30">
            <Radio className="h-3.5 w-3.5 text-risk-safe animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-risk-safe">
              SYSTEM ACTIVE
            </span>
          </div>
          <div className="text-right">
            <div
              suppressHydrationWarning
              className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg"
            >
              {time}
            </div>
            <div suppressHydrationWarning className="text-[11px] text-muted-foreground">
              {date}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
