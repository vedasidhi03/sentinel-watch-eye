import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Upload, AlertTriangle, Crosshair, ScanLine } from "lucide-react";
import { Panel } from "./Panel";
import { RiskBadge } from "./RiskBadge";
import cctv1 from "@/assets/cctv.png.asset.json";
import cctv2 from "@/assets/cctv-2.png.asset.json";
import cctv3 from "@/assets/cctv-3.png.asset.json";
import cctv4 from "@/assets/cctv-4.png.asset.json";
import { useClock } from "@/hooks/use-sentinel";

const DEFAULT_IMAGES = [cctv4.url, cctv3.url, cctv2.url, cctv1.url];

const DETECT_LABELS = ["FOLLOWING DETECTED", "PATH MIRRORING", "PERSISTENT TRACKING"];

export function SnapshotAnalysis() {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [index, setIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const now = useClock();
  const ts = now.toLocaleTimeString("en-GB", { hour12: false });

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...urls, ...prev]);
    setIndex(0);
  };

  const current = images[index];
  const camId = useMemo(() => `CAM-0${8 + (index % 2)}`, [index]);

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
            key={current}
            src={current}
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
              stroke="var(--risk-critical)"
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

          {/* Bounding box - Target */}
          <BBox
            style={{ left: "38%", top: "62%", width: "16%", height: "32%" }}
            label="P-001 · TARGET"
            color="var(--risk-safe)"
          />
          {/* Bounding box - Suspect */}
          <BBox
            style={{ left: "54%", top: "60%", width: "16%", height: "34%" }}
            label="P-002 · SUSPECT"
            color="var(--risk-critical)"
            pulse
          />

          {/* Top status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold tracking-wider">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-risk-critical">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-critical" /> REC
              </span>
              <span className="flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-foreground/90">
                <Camera className="h-3 w-3" /> {camId}
              </span>
            </div>
            <span className="rounded bg-black/55 px-1.5 py-0.5 font-mono text-foreground/90">
              {ts}
            </span>
          </div>

          {/* AI analysis active */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
            <ScanLine className="h-3 w-3 animate-pulse" /> AI ANALYSIS ACTIVE
          </div>
        </div>
      </div>

      {/* Detection labels */}
      <div className="mt-3 flex flex-wrap gap-2">
        {DETECT_LABELS.map((l) => (
          <span
            key={l}
            className="inline-flex items-center gap-1 rounded-md bg-risk-critical/12 px-2 py-1 text-[10px] font-bold tracking-wider text-risk-critical ring-1 ring-risk-critical/30"
          >
            <AlertTriangle className="h-3 w-3" /> {l}
          </span>
        ))}
      </div>

      {/* BAI + risk readout */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border/70 bg-background/30 px-4 py-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Behavioral Attention Index
          </div>
          <div className="font-mono text-3xl font-bold text-risk-critical text-glow">94</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Risk Level
          </div>
          <div className="mt-1">
            <RiskBadge level="CRITICAL" pulse />
          </div>
        </div>
      </div>

      {/* feed dots */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
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
