import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import { Panel } from "./Panel";
import { nextLogEvent, seedLog, type LogEvent } from "@/lib/sentinel";

const LEVEL_COLOR: Record<LogEvent["level"], string> = {
  info: "var(--primary)",
  track: "var(--risk-safe)",
  warn: "var(--risk-high)",
  critical: "var(--risk-critical)",
};

export function EventLog() {
  const [events, setEvents] = useState<LogEvent[]>(() => seedLog());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => [...prev.slice(-40), nextLogEvent()]);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events]);

  return (
    <Panel title="Live Event Log" icon={<Terminal className="h-4 w-4" />}>
      <div
        ref={scrollRef}
        className="h-56 space-y-1 overflow-y-auto pr-1 font-mono text-xs"
      >
        {events.map((e) => {
          const color = LEVEL_COLOR[e.level];
          return (
            <div
              key={e.id}
              className="flex items-start gap-2 rounded px-1.5 py-1 transition-colors hover:bg-accent/40 animate-fade-in"
            >
              <span className="shrink-0 text-muted-foreground">{e.time}</span>
              <span className="shrink-0" style={{ color }}>
                ▸
              </span>
              <span
                className={e.level === "critical" ? "font-bold" : "text-foreground/85"}
                style={e.level === "critical" ? { color } : undefined}
              >
                {e.message}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
