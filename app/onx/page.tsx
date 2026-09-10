"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Filter,
  Maximize2,
  Moon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import RegionMap, { SAMPLE_REGIONS } from "./RegionMap";

type ComparisonRow = {
  metric: string;
  kpi: string;
  wow: "Win" | "Lose";
  winner: string;
  gap: string;
  highlight: "Good" | "Need Improve";
};

const COMPARISON_ROWS: ComparisonRow[] = [
  { metric: "Latency", kpi: "BCQ", wow: "Win", winner: "Biznet", gap: "-5ms", highlight: "Good" },
  { metric: "Jitter", kpi: "BCQ", wow: "Win", winner: "XLHome", gap: "-1ms", highlight: "Good" },
  { metric: "Packetloss", kpi: "BCQ", wow: "Win", winner: "IndosatHifi", gap: "-1%", highlight: "Good" },
  { metric: "Download", kpi: "BCQ", wow: "Win", winner: "Indihome", gap: "0", highlight: "Good" },
  { metric: "Upload", kpi: "BCQ", wow: "Win", winner: "Indihome", gap: "0", highlight: "Good" },
  { metric: "TTFB", kpi: "BCQ", wow: "Lose", winner: "IndosatHifi", gap: "-1ms", highlight: "Need Improve" },
];

const COMPARISON_COLUMNS = [
  { key: "metric", label: "Metrics" },
  { key: "kpi", label: "KPI" },
  { key: "wow", label: "WoW (Win/Lose)" },
  { key: "winner", label: "Winner" },
  { key: "gap", label: "Gap to Winner" },
  { key: "highlight", label: "Highlight" },
] as const;

const METRIC_OPTIONS = ["TTFB", "Latency", "Jitter", "Packetloss", "Download", "Upload"];

export default function OnxDashboard() {
  const [activeTab, setActiveTab] = useState<"maps" | "detail">("maps");
  const [selectedMetric, setSelectedMetric] = useState("TTFB");

  return (
    <div className="flex min-h-screen bg-[#f9f8f7]">
      <Sidebar activeKey="onx" />

      {/* Filter Insight panel */}
      <aside className="flex w-[232.5px] shrink-0 flex-col gap-6 border-r-[0.5px] border-black/[0.08] bg-[#f9f8f7] px-4 pb-8 pt-[18px]">
        <div className="flex h-[45px] shrink-0 items-center gap-2 border-b border-black/[0.08]">
          <Filter className="size-[18px] text-[#050505]" strokeWidth={1.75} />
          <span className="text-sm font-medium text-[#050505]">Filter Insight</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-[#050505]">Metrics</span>
          <div className="flex min-h-9 w-[200px] items-center justify-between rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
            <span className="text-sm text-[#636363]">Select Filter Metrics</span>
            <ChevronDown className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
          </div>
          <div className="flex min-h-9 w-[200px] items-center justify-between rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
            <span className="text-sm text-[#636363]">Select KPI</span>
            <ChevronDown className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-[#050505]">Location Level</span>
          <div className="flex min-h-9 w-[200px] items-center justify-between rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
            <span className="text-sm text-[#636363]">Select Level</span>
            <ChevronDown className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
          </div>
          <div className="flex min-h-9 w-[200px] items-center justify-between rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
            <span className="text-sm text-[#636363]">Filter KPI</span>
            <ChevronDown className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
          </div>
          <div className="flex min-h-9 w-[200px] items-center justify-between rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
            <span className="text-sm text-[#636363]">Category</span>
            <ChevronDown className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b-[0.5px] border-black/[0.08] bg-white px-6">
          <h1 className="text-lg font-bold text-[#0f172b]">ONX Dashboard</h1>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              className="flex size-[30px] items-center justify-center rounded-full bg-black/[0.04] transition-colors hover:bg-black/[0.08]"
            >
              <Moon className="size-4 text-[#050505]" strokeWidth={1.75} />
            </button>
            <button
              aria-label="Notifications"
              className="flex size-[30px] items-center justify-center rounded-full bg-black/[0.04] transition-colors hover:bg-black/[0.08]"
            >
              <Bell className="size-4 text-[#050505]" strokeWidth={1.75} />
            </button>
            <button className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-colors hover:bg-black/[0.04]">
              <span className="flex size-[30px] items-center justify-center rounded-full bg-[#1f6eeb] text-xs font-medium text-white">
                UN
              </span>
              <span className="text-sm font-medium text-[#314158]">username</span>
              <ChevronDown className="size-4 text-[#314158]" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col gap-5 p-6">
          {/* Comparison table */}
          <div className="flex flex-col gap-3 rounded-[24px] border border-[#0f0d0a14] bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#050505]">
                Competitive Benchmark
              </h2>
              <button
                type="button"
                aria-label="Expand table"
                className="flex size-8 items-center justify-center rounded-[10px] border border-[#e6e5e3] bg-white transition-colors hover:bg-black/[0.02]"
              >
                <Maximize2 className="size-4 text-[#636363]" strokeWidth={1.75} />
              </button>
            </div>

            <div className="overflow-auto">
              <div className="min-w-[720px]">
                <div className="flex">
                  {COMPARISON_COLUMNS.map((col) => (
                    <div
                      key={col.key}
                      className="flex h-[54px] flex-1 shrink-0 items-center bg-black/[0.04] px-3"
                    >
                      <span className="whitespace-nowrap text-sm font-semibold text-[#050505]">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>

                {COMPARISON_ROWS.map((row) => (
                  <div
                    key={row.metric}
                    className="flex border-b border-[#0f0d0a14] last:border-b-0"
                  >
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.metric}
                      </span>
                    </div>
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.kpi}
                      </span>
                    </div>
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span
                        className={`whitespace-nowrap text-sm ${
                          row.wow === "Lose" ? "text-[#ef4444]" : "text-[#050505]"
                        }`}
                      >
                        {row.wow}
                      </span>
                    </div>
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.winner}
                      </span>
                    </div>
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.gap}
                      </span>
                    </div>
                    <div className="flex h-[50px] flex-1 shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.highlight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric selector + Maps/Detail tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative">
              <select
                aria-label="Select metric"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="h-9 w-[150px] appearance-none rounded-xl border border-black/[0.08] bg-white px-3 pr-8 text-sm font-medium text-[#636363] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none"
              >
                {METRIC_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#636363]"
                strokeWidth={1.75}
              />
            </div>

            <div className="flex items-center gap-4 rounded-[80px] bg-black/[0.04] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("maps")}
                className={`rounded-3xl px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "maps"
                    ? "border border-black/[0.08] bg-white text-[#636363] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "cursor-pointer text-[#636363]"
                }`}
              >
                Maps
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("detail")}
                className={`rounded-3xl px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "detail"
                    ? "border border-black/[0.08] bg-white text-[#636363] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "cursor-pointer text-[#636363]"
                }`}
              >
                Detail
              </button>
            </div>
          </div>

          {/* Maps / Detail card */}
          <div className="h-[449px] rounded-b-[24px] rounded-tl-[24px] rounded-tr-[24px] border border-black/[0.08] bg-white p-3 sm:p-4">
            {activeTab === "maps" ? (
              <RegionMap />
            ) : (
              <div className="h-full overflow-auto">
                <div className="min-w-[560px]">
                  <div className="flex bg-black/[0.04]">
                    <div className="flex h-[54px] flex-1 items-center px-3">
                      <span className="text-sm font-semibold text-[#050505]">Region</span>
                    </div>
                    <div className="flex h-[54px] flex-1 items-center px-3">
                      <span className="text-sm font-semibold text-[#050505]">Status</span>
                    </div>
                    <div className="flex h-[54px] flex-1 items-center px-3">
                      <span className="text-sm font-semibold text-[#050505]">
                        Value Indihome
                      </span>
                    </div>
                    <div className="flex h-[54px] flex-1 items-center px-3">
                      <span className="text-sm font-semibold text-[#050505]">
                        Nearest Competitor
                      </span>
                    </div>
                  </div>
                  {SAMPLE_REGIONS.map((region) => (
                    <div
                      key={region.id}
                      className="flex border-b border-[#0f0d0a14] last:border-b-0"
                    >
                      <div className="flex h-[50px] flex-1 items-center px-3">
                        <span className="text-sm text-[#050505]">{region.name}</span>
                      </div>
                      <div className="flex h-[50px] flex-1 items-center px-3">
                        <span
                          className={`whitespace-nowrap rounded-[9px] px-2.5 py-1 text-[13px] font-medium ${
                            region.status === "win"
                              ? "bg-[#f0fdf4] text-[#22c55e]"
                              : "bg-[#fef2f2] text-[#ef4444]"
                          }`}
                        >
                          {region.status === "win" ? "Win" : "Lose"}
                        </span>
                      </div>
                      <div className="flex h-[50px] flex-1 items-center px-3">
                        <span className="text-sm text-[#050505]">
                          {region.valuePercent}
                        </span>
                      </div>
                      <div className="flex h-[50px] flex-1 items-center px-3">
                        <span className="text-sm text-[#050505]">
                          {region.nearestCompetitor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
