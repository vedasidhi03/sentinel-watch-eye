import { createFileRoute } from "@tanstack/react-router";
import { Eye, Link2, Activity } from "lucide-react";
import { Header } from "@/components/sentinel/Header";
import { StatCard, AlertLevelCard } from "@/components/sentinel/StatCard";
import { SnapshotAnalysis } from "@/components/sentinel/SnapshotAnalysis";
import { BaiAnalysis } from "@/components/sentinel/BaiAnalysis";
import { RiskEscalation } from "@/components/sentinel/RiskEscalation";
import { ExplainablePanel } from "@/components/sentinel/ExplainablePanel";
import { EventLog } from "@/components/sentinel/EventLog";
import { AlertHistory } from "@/components/sentinel/AlertHistory";
import { BaiTrendChart } from "@/components/sentinel/BaiTrendChart";
import { SystemStatus } from "@/components/sentinel/SystemStatus";
import { EthicalPanel } from "@/components/sentinel/EthicalPanel";
import { SceneProvider, useScenes } from "@/components/sentinel/SceneContext";
import { riskFromBai } from "@/lib/sentinel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelHer — AI Surveillance SOC Dashboard" },
      {
        name: "description",
        content:
          "SentinelHer: a privacy-aware Edge AI surveillance dashboard monitoring the Behavioral Attention Index for suspicious following behavior in real time.",
      },
      { property: "og:title", content: "SentinelHer — AI Surveillance SOC Dashboard" },
      {
        property: "og:description",
        content:
          "Privacy-aware Edge AI surveillance with Behavioral Attention Index monitoring, explainable alerts and intelligent risk escalation.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="dark-bg mx-auto max-w-[1500px] space-y-4 p-3 sm:p-5">

        <Header />

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Persons Tracked"
            value={12}
            description="Currently monitored individuals"
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard
            label="Active Pairs"
            value={5}
            description="Pairs under behavioral analysis"
            icon={<Link2 className="h-4 w-4" />}
          />
          <StatCard
            label="Maximum BAI"
            value={94}
            description="Highest Behavioral Attention Index"
            icon={<Activity className="h-4 w-4" />}
            accent="critical"
          />
          <AlertLevelCard level="CRITICAL" />
        </div>

        {/* Main two-column */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SnapshotAnalysis />
          <BaiAnalysis />
        </div>

        {/* Risk + Explainable */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RiskEscalation />
          <ExplainablePanel />
        </div>

        {/* Logs + history */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EventLog />
          <AlertHistory />
        </div>

        {/* Trend full width */}
        <BaiTrendChart />

        {/* Status + ethics */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SystemStatus />
          <EthicalPanel />
        </div>

        {/* Footer */}
        <footer className="glass rounded-xl px-4 py-4 text-center">
          <p className="text-sm font-medium italic text-muted-foreground">
            "AI should assist human judgment, not replace it."
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            SentinelHer · Privacy-Aware Edge AI Surveillance Assistant
          </p>
        </footer>
      </div>
    </div>
  );
}
