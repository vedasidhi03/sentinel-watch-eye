import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "./Panel";

interface Point {
  time: string;
  bai: number;
}

function makeSeed(): Point[] {
  const out: Point[] = [];
  let v = 55;
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    v = Math.max(20, Math.min(98, v + (Math.random() * 16 - 6)));
    const d = new Date(now - i * 3000);
    out.push({ time: d.toLocaleTimeString("en-GB", { hour12: false }).slice(3), bai: Math.round(v) });
  }
  return out;
}

export function BaiTrendChart() {
  const [data, setData] = useState<Point[]>(() => makeSeed());

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1].bai;
        const next = Math.max(20, Math.min(99, last + (Math.random() * 18 - 8)));
        const d = new Date();
        return [
          ...prev.slice(1),
          { time: d.toLocaleTimeString("en-GB", { hour12: false }).slice(3), bai: Math.round(next) },
        ];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Panel title="Behavioral Attention Index Trend" icon={<TrendingUp className="h-4 w-4" />}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="baiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="bai"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#baiFill)"
              isAnimationActive
              animationDuration={800}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
