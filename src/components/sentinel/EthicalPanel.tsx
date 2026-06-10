import { ShieldCheck, Check, AlertCircle } from "lucide-react";
import { Panel } from "./Panel";

const GUARANTEES = [
  "No Facial Recognition",
  "No Identity Storage",
  "Anonymous Tracking IDs",
  "Human Verification Required",
  "Explainable Alerts",
  "Privacy-Preserving Edge AI",
];

export function EthicalPanel() {
  return (
    <Panel title="Ethical AI Design" icon={<ShieldCheck className="h-4 w-4" />}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {GUARANTEES.map((g) => (
          <div
            key={g}
            className="flex items-center gap-2 rounded-lg border border-risk-safe/25 bg-risk-safe/8 px-3 py-2"
          >
            <Check className="h-4 w-4 shrink-0 text-risk-safe" />
            <span className="text-xs text-foreground/90">{g}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-risk-high/35 bg-risk-high/10 px-3 py-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-risk-high" />
        <p className="text-xs leading-relaxed text-foreground/85">
          System does <span className="font-bold text-risk-high">NOT</span> automatically contact
          police. Human verification is mandatory before any intervention.
        </p>
      </div>
    </Panel>
  );
}
