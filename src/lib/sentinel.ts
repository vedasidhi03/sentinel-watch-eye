export type RiskLevel = "SAFE" | "LOW" | "HIGH" | "CRITICAL";

export interface PairData {
  id: string;
  a: string;
  b: string;
  bai: number;
}

export interface AlertRow {
  time: string;
  pair: string;
  bai: number;
  status: RiskLevel;
}

export interface LogEvent {
  id: number;
  time: string;
  message: string;
  level: "info" | "track" | "warn" | "critical";
}

export function riskFromBai(bai: number): RiskLevel {
  if (bai >= 91) return "CRITICAL";
  if (bai >= 71) return "HIGH";
  if (bai >= 41) return "LOW";
  return "SAFE";
}

/** Returns a CSS color value (semantic risk token) for a level. */
export function riskColorVar(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "var(--risk-critical)";
    case "HIGH":
      return "var(--risk-high)";
    case "LOW":
      return "var(--risk-low)";
    default:
      return "var(--risk-safe)";
  }
}

export function riskTextClass(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "text-risk-critical";
    case "HIGH":
      return "text-risk-high";
    case "LOW":
      return "text-risk-low";
    default:
      return "text-risk-safe";
  }
}

export const PAIRS: PairData[] = [
  { id: "p1", a: "P001", b: "P002", bai: 94 },
  { id: "p2", a: "P004", b: "P005", bai: 76 },
  { id: "p3", a: "P006", b: "P007", bai: 58 },
  { id: "p4", a: "P008", b: "P009", bai: 32 },
];

export const ALERT_HISTORY: AlertRow[] = [
  { time: "23:11", pair: "P001-P002", bai: 94, status: "CRITICAL" },
  { time: "23:08", pair: "P004-P005", bai: 76, status: "HIGH" },
  { time: "23:02", pair: "P006-P007", bai: 58, status: "LOW" },
  { time: "22:54", pair: "P003-P010", bai: 81, status: "HIGH" },
  { time: "22:47", pair: "P008-P009", bai: 32, status: "SAFE" },
];

export const BAI_FACTORS = [
  { label: "Persistent Following", value: 40 },
  { label: "Trajectory Similarity", value: 30 },
  { label: "Repeated Presence", value: 15 },
  { label: "Close Distance Tracking", value: 9 },
];

export const RISK_BANDS: { level: RiskLevel; range: string; min: number; max: number }[] = [
  { level: "SAFE", range: "0–40", min: 0, max: 40 },
  { level: "LOW", range: "41–70", min: 41, max: 70 },
  { level: "HIGH", range: "71–90", min: 71, max: 90 },
  { level: "CRITICAL", range: "91–100", min: 91, max: 100 },
];

const LOG_TEMPLATES: { message: string; level: LogEvent["level"] }[] = [
  { message: "Person Detected", level: "info" },
  { message: "Tracking Initialized", level: "track" },
  { message: "Trajectory Updated", level: "track" },
  { message: "DeepSORT re-identification confirmed", level: "track" },
  { message: "BAI Recalculated", level: "info" },
  { message: "Path mirroring detected", level: "warn" },
  { message: "Proximity threshold breached", level: "warn" },
  { message: "Risk Level Increased", level: "warn" },
  { message: "CRITICAL ALERT GENERATED", level: "critical" },
  { message: "Human verification requested", level: "info" },
  { message: "YOLOv8 frame processed", level: "info" },
];

let logCounter = 1000;
export function nextLogEvent(): LogEvent {
  const t = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  return { id: logCounter++, time, message: t.message, level: t.level };
}

export function seedLog(): LogEvent[] {
  return [
    { id: 1, time: "23:11:02", message: "Person Detected", level: "info" },
    { id: 2, time: "23:11:05", message: "Tracking Initialized", level: "track" },
    { id: 3, time: "23:11:10", message: "Trajectory Updated", level: "track" },
    { id: 4, time: "23:11:12", message: "BAI Recalculated", level: "info" },
    { id: 5, time: "23:11:14", message: "Risk Level Increased", level: "warn" },
    { id: 6, time: "23:11:15", message: "CRITICAL ALERT GENERATED", level: "critical" },
  ];
}
