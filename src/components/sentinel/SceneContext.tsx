import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { riskFromBai, type RiskLevel } from "@/lib/sentinel";
import cctv1 from "@/assets/cctv.png.asset.json";
import cctv2 from "@/assets/cctv-2.png.asset.json";
import cctv3 from "@/assets/cctv-3.png.asset.json";
import cctv4 from "@/assets/cctv-4.png.asset.json";

export interface SceneBox {
  left: string;
  top: string;
  width: string;
  height: string;
  label: string;
  kind: "target" | "suspect" | "normal";
}

export interface Scene {
  id: string;
  image: string;
  camId: string;
  /** Total individuals detected in the frame (the "grid of persons"). */
  personsTracked: number;
  /** Pairs currently under behavioral analysis. */
  activePairs: number;
  /** Behavioral Attention Index for the flagged pair in this frame. */
  bai: number;
  detection: string[];
  boxes: SceneBox[];
  pairLabel: string;
}

/** Only the two tracked individuals: P-001 (target) and P-002 (suspect). */
function pair(target: SceneBox, suspect: SceneBox): SceneBox[] {
  return [target, suspect];
}

const BASE_SCENES: Scene[] = [
  {
    id: "s1",
    image: cctv4.url,
    camId: "CAM-08",
    personsTracked: 2,
    activePairs: 1,
    bai: 94,
    pairLabel: "P-001 · P-002",
    detection: ["FOLLOWING DETECTED", "PATH MIRRORING", "PERSISTENT TRACKING"],
    boxes: pair(
      { left: "38%", top: "62%", width: "16%", height: "32%", label: "P-001 · TARGET", kind: "target" },
      { left: "54%", top: "60%", width: "16%", height: "34%", label: "P-002 · SUSPECT", kind: "suspect" },
    ),
  },
  {
    id: "s2",
    image: cctv3.url,
    camId: "CAM-09",
    personsTracked: 2,
    activePairs: 1,
    bai: 78,
    pairLabel: "P-001 · P-002",
    detection: ["PATH MIRRORING", "PERSISTENT TRACKING"],
    boxes: pair(
      { left: "30%", top: "56%", width: "16%", height: "34%", label: "P-001 · TARGET", kind: "target" },
      { left: "48%", top: "54%", width: "16%", height: "36%", label: "P-002 · SUSPECT", kind: "suspect" },
    ),
  },
  {
    id: "s3",
    image: cctv2.url,
    camId: "CAM-08",
    personsTracked: 2,
    activePairs: 1,
    bai: 58,
    pairLabel: "P-001 · P-002",
    detection: ["PROXIMITY WATCH", "PATH MIRRORING"],
    boxes: pair(
      { left: "40%", top: "58%", width: "15%", height: "32%", label: "P-001 · TARGET", kind: "target" },
      { left: "20%", top: "50%", width: "15%", height: "36%", label: "P-002 · SUSPECT", kind: "suspect" },
    ),
  },
  {
    id: "s4",
    image: cctv1.url,
    camId: "CAM-09",
    personsTracked: 2,
    activePairs: 1,
    bai: 34,
    pairLabel: "P-001 · P-002",
    detection: ["NOMINAL MOVEMENT"],
    boxes: pair(
      { left: "44%", top: "58%", width: "15%", height: "32%", label: "P-001 · TARGET", kind: "target" },
      { left: "26%", top: "52%", width: "14%", height: "34%", label: "P-002 · SUSPECT", kind: bai >= 41 ? "suspect" : "normal" },
    ),
  },
];

/** Deterministic value from a string (no Math.random → no hydration drift). */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function sceneFromUpload(url: string, name: string, idx: number): Scene {
  const seed = hashString(name + idx);
  const bai = 28 + (seed % 72); // 28..99
  const personsTracked = 4 + (seed % 12); // 4..15
  const activePairs = 1 + (seed % 6); // 1..6
  const labels = ["FOLLOWING DETECTED", "PATH MIRRORING", "PERSISTENT TRACKING", "REPEATED PRESENCE"];
  const detection =
    bai >= 71
      ? labels.slice(0, 3)
      : bai >= 41
        ? ["PATH MIRRORING", "PROXIMITY WATCH"]
        : ["NOMINAL MOVEMENT"];
  return {
    id: `u-${idx}-${seed}`,
    image: url,
    camId: `CAM-0${8 + (seed % 2)}`,
    personsTracked,
    activePairs,
    bai,
    pairLabel: "P-001 · P-002",
    detection,
    boxes: withCrowd(
      { left: "38%", top: "60%", width: "16%", height: "32%", label: "P-001 · TARGET", kind: "target" },
      { left: "54%", top: "58%", width: "16%", height: "34%", label: "P-002 · SUSPECT", kind: bai >= 41 ? "suspect" : "normal" },
      [
        { left: `${12 + (seed % 10)}%`, top: "32%", width: "9%", height: "20%", label: "P-003", kind: "normal" },
        { left: `${70 + (seed % 8)}%`, top: "36%", width: "10%", height: "22%", label: "P-004", kind: "normal" },
      ],
    ),
  };
}

interface SceneCtx {
  scenes: Scene[];
  index: number;
  setIndex: (i: number) => void;
  active: Scene;
  /** Aggregate values across all scenes for the top stat row. */
  maxBai: number;
  alertLevel: RiskLevel;
  addUploads: (files: FileList) => void;
}

const Ctx = createContext<SceneCtx | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [scenes, setScenes] = useState<Scene[]>(BASE_SCENES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (scenes.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % scenes.length), 5000);
    return () => clearInterval(id);
  }, [scenes.length]);

  const addUploads = (files: FileList) => {
    if (!files || files.length === 0) return;
    const newScenes = Array.from(files).map((f, i) =>
      sceneFromUpload(URL.createObjectURL(f), f.name, Date.now() + i),
    );
    setScenes((prev) => [...newScenes, ...prev]);
    setIndex(0);
  };

  const active = scenes[Math.min(index, scenes.length - 1)];
  const maxBai = useMemo(() => Math.max(...scenes.map((s) => s.bai)), [scenes]);
  const alertLevel = riskFromBai(active.bai);

  const value: SceneCtx = {
    scenes,
    index,
    setIndex,
    active,
    maxBai,
    alertLevel,
    addUploads,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScenes(): SceneCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useScenes must be used within SceneProvider");
  return ctx;
}
