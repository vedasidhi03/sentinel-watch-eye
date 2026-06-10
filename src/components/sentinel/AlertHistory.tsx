import { History } from "lucide-react";
import { Panel } from "./Panel";
import { RiskBadge } from "./RiskBadge";
import { ALERT_HISTORY, riskColorVar } from "@/lib/sentinel";

export function AlertHistory() {
  return (
    <Panel title="Alert History" icon={<History className="h-4 w-4" />}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 pr-3 font-medium">Time</th>
              <th className="pb-2 pr-3 font-medium">Pair</th>
              <th className="pb-2 pr-3 font-medium">BAI</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ALERT_HISTORY.map((r, i) => (
              <tr
                key={i}
                className="border-b border-border/40 transition-colors hover:bg-accent/30"
              >
                <td className="py-2 pr-3 font-mono text-muted-foreground">{r.time}</td>
                <td className="py-2 pr-3 font-mono text-foreground/90">{r.pair}</td>
                <td
                  className="py-2 pr-3 font-mono font-bold"
                  style={{ color: riskColorVar(r.status) }}
                >
                  {r.bai}
                </td>
                <td className="py-2">
                  <RiskBadge level={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
