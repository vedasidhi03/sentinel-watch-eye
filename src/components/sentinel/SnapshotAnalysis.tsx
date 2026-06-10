import { useRef } from "react";
import { Camera, Upload, AlertTriangle, Crosshair, ScanLine } from "lucide-react";
import { Panel } from "./Panel";
import { RiskBadge } from "./RiskBadge";
import { useClock } from "@/hooks/use-sentinel";
import { useScenes } from "./SceneContext";
import { riskColorVar, riskFromBai, riskTextClass } from "@/lib/sentinel";

export function SnapshotAnalysis() {
  const { scenes, index, setIndex, active, addUploads } = useScenes();
  const fileRef = useRef<HTMLInputElement>(null);
  const now = useClock();
  const ts = now.toLocaleTimeString("en-GB", { hour12: false });

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addUploads(e.target.files);
  };

  const risk = riskFromBai(active.bai);
  const baiColor = riskColorVar(risk);

  return (
    <Panel
      title="Suspicious Snapshot Analysis"
      icon={<Crosshair className="h-4 w-4" />}
      action={
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30 transition hover:bg-primary/25"
        >
          <Upload className="h-3.5 w-3.5" /> Upload
        </button>
      }
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onUpload}
      />

      <div className="relative overflow-hidden rounded-lg border border-border bg-black">
        {/* CCTV image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            key={active.image}
            src={active.image}
            alt="Surveillance snapshot under behavioral analysis"
            className="h-full w-full origin-center object-cover animate-kenburns"
          />
          <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />

          {/* Moving scan line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70 shadow-[0_0_12px_2px_var(--primary)] animate-scan-move" />

          {/* SVG overlays: trajectory trails */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 56"
            preserveAspectRatio="none"
          >
            <polyline
              points="20,14 30,28 42,46 50,72"
              fill="none"
              stroke="var(--risk-safe)"
              strokeWidth="0.5"
              strokeDasharray="2 1.5"
              opacity="0.85"
            />
            <polyline
              points="70,18 64,30 60,44 56,70"
              fill="none"
              stroke={baiColor}
              strokeWidth="0.5"
              strokeDasharray="2 1.5"
              opacity="0.9"
            />
            <line
              x1="48"
              y1="58"
              x2="60"
              y2="56"
              stroke="var(--risk-high)"
              strokeWidth="0.4"
              strokeDasharray="1 1"
            />
          </svg>

          {/* Bounding boxes — the grid of persons for this frame */}
          {active.boxes.map((b, i) => (
            <BBox
              key={`${active.id}-${i}`}
              style={{ left: b.left, top: b.top, width: b.width, height: b.height }}
              label={b.label}
              color={
                b.kind === "suspect"
                  ? baiColor
                  : b.kind === "target"
                    ? "var(--risk-safe)"
                    : "var(--muted-foreground)"
              }
              pulse={b.kind === "suspect"}
            />
          ))}

          {/* Top status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold tracking-wider">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-risk-critical">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-critical" /> REC
              </span>
              <span className="flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-foreground/90">
                <Camera className="h-3 w-3" /> {active.camId}
              </span>
            </div>
            <span
              suppressHydrationWarning
              className="rounded bg-black/55 px-1.5 py-0.5 font-mono text-foreground/90"
            >
              {ts}
            </span>
          </div>

          {/* AI analysis active */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
            <ScanLine className="h-3 w-3 animate-pulse" /> AI ANALYSIS ACTIVE
          </div>

          {/* Persons-in-frame chip */}
          <div className="absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-foreground/90">
            {active.personsTracked} PERSONS · {active.activePairs} PAIRS
          </div>
        </div>
      </div>

      {/* Detection labels */}
      <div className="mt-3 flex flex-wrap gap-2">
        {active.detection.map((l) => (
          <span
            key={l}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold tracking-wider ring-1"
            style={{
              color: baiColor,
              backgroundColor: `color-mix(in oklab, ${baiColor} 12%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${baiColor} 30%, transparent)`,
            }}
          >
            <AlertTriangle className="h-3 w-3" /> {l}
          </span>
        ))}
      </div>

      {/* BAI + risk readout */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border/70 bg-background/30 px-4 py-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Behavioral Attention Index · {active.pairLabel}
          </div>
          <div className={`font-mono text-3xl font-bold text-glow ${riskTextClass(risk)}`}>
            {active.bai}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Risk Level
          </div>
          <div className="mt-1">
            <RiskBadge level={risk} pulse={risk === "CRITICAL" || risk === "HIGH"} />
          </div>
        </div>
      </div>

      {/* feed dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {scenes.map((_, i) => (
          <button
            key={i}
            aria-label={`View snapshot ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </Panel>
  );
}

function BBox({
  style,
  label,
  color,
  pulse,
}: {
  style: React.CSSProperties;
  label: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="absolute" style={style}>
      <div
        className={`relative h-full w-full rounded-sm ${pulse ? "animate-pulse" : ""}`}
        style={{ boxShadow: `inset 0 0 0 1.5px ${color}` }}
      >
        {/* corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span
            key={c}
            className="absolute h-2.5 w-2.5"
            style={{
              borderColor: color,
              borderTopWidth: c[0] === "t" ? 2 : 0,
              borderBottomWidth: c[0] === "b" ? 2 : 0,
              borderLeftWidth: c[1] === "l" ? 2 : 0,
              borderRightWidth: c[1] === "r" ? 2 : 0,
              top: c[0] === "t" ? -1 : "auto",
              bottom: c[0] === "b" ? -1 : "auto",
              left: c[1] === "l" ? -1 : "auto",
              right: c[1] === "r" ? -1 : "auto",
            }}
          />
        ))}
        <span
          className="absolute -top-5 left-0 whitespace-nowrap rounded px-1 py-0.5 text-[9px] font-bold tracking-wider"
          style={{ backgroundColor: color, color: "oklch(0.16 0.02 255)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
