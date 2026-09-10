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
  /** "Metrics" column — constant score type shown for every row */
  metrics: string;
  /** "KPI" column — the specific metric being compared */
  kpi: string;
  wow: "Win" | "Lose";
  winner: string;
  gap: string;
  highlight: "Good" | "Need Improve";
};

const COMPARISON_ROWS: ComparisonRow[] = [
  { metrics: "BCQ", kpi: "Latency", wow: "Win", winner: "Biznet", gap: "-5ms", highlight: "Good" },
  { metrics: "BCQ", kpi: "Jitter", wow: "Win", winner: "XLHome", gap: "-1ms", highlight: "Good" },
  { metrics: "BCQ", kpi: "Packetloss", wow: "Win", winner: "IndosatHifi", gap: "-1%", highlight: "Good" },
  { metrics: "BCQ", kpi: "Download", wow: "Win", winner: "Indihome", gap: "0", highlight: "Good" },
  { metrics: "BCQ", kpi: "Upload", wow: "Win", winner: "Indihome", gap: "0", highlight: "Good" },
  { metrics: "BCQ", kpi: "TTFB", wow: "Lose", winner: "IndosatHifi", gap: "-1ms", highlight: "Need Improve" },
];

const COMPARISON_COLUMNS = [
  { key: "metrics", label: "Metrics", align: "justify-center text-center" },
  { key: "kpi", label: "KPI", align: "justify-start text-left" },
  { key: "wow", label: "WoW (Win/Lose)", align: "justify-center text-center" },
  { key: "winner", label: "Winner", align: "justify-start text-left" },
  { key: "gap", label: "Gap to Winner", align: "justify-start text-left" },
  { key: "highlight", label: "Highlight", align: "justify-start text-left" },
] as const;

const METRIC_OPTIONS = ["TTFB", "Latency", "Jitter", "Packetloss", "Download", "Upload"];

export default function OnxDashboard() {
  const [activeTab, setActiveTab] = useState<"maps" | "detail">("maps");
  const [selectedMetric, setSelectedMetric] = useState("TTFB");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f8f7]">
      <Sidebar activeKey="onx" />

      {/* Filter Insight panel */}
      <aside className="flex w-[232.5px] shrink-0 flex-col gap-6 border-r border-black/[0.08] bg-[#f9f8f7] px-4 pb-8 pt-[18px]">
        <div className="flex h-[45px] shrink-0 items-center gap-3 border-b border-black/[0.08]">
          <Filter className="size-[18px] text-[#525252]" strokeWidth={1.75} />
          <span className="text-sm font-medium text-[#525252]">Filter Insight</span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#525252]">Metrics</span>
            <div className="flex min-h-9 w-[200px] items-center justify-between gap-2 rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
              <span className="text-sm text-[#525252]">Select Filter Metrics</span>
              <ChevronDown className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
            </div>
            <div className="flex min-h-9 w-[200px] items-center justify-between gap-2 rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
              <span className="text-sm text-[#525252]">Select KPI</span>
              <ChevronDown className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#525252]">Location Level</span>
            <div className="flex min-h-9 w-[200px] items-center justify-between gap-2 rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
              <span className="text-sm text-[#525252]">Select Level</span>
              <ChevronDown className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
            </div>
            <div className="flex min-h-9 w-[200px] items-center justify-between gap-2 rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
              <span className="text-sm text-[#525252]">Filter KPI</span>
              <ChevronDown className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
            </div>
            <div className="flex min-h-9 w-[200px] items-center justify-between gap-2 rounded-xl border border-[#e6e5e3] bg-white px-3 py-[7.5px]">
              <span className="text-sm text-[#525252]">Category</span>
              <ChevronDown className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.08] bg-white px-6">
          <h1 className="text-lg font-bold text-[#0f172b]">ONX Dashboard</h1>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              className="flex size-[30px] items-center justify-center rounded-full bg-black/[0.04] transition-colors hover:bg-black/[0.08]"
            >
              <Moon className="size-4 text-[#62748e]" strokeWidth={1.333} />
            </button>
            <button
              aria-label="Notifications"
              className="flex size-[30px] items-center justify-center rounded-full bg-black/[0.04] transition-colors hover:bg-black/[0.08]"
            >
              <Bell className="size-4 text-[#62748e]" strokeWidth={1.333} />
            </button>
            <button className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-colors hover:bg-black/[0.04]">
              <span className="flex size-[30px] items-center justify-center rounded-full bg-[#1f6eeb] text-xs font-medium text-white">
                UN
              </span>
              <span className="text-sm font-medium text-[#314158]">username</span>
              <ChevronDown className="size-4 text-[#90a1b9]" strokeWidth={1.333} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex min-h-0 flex-1 flex-col p-5">
          {/* Unified card: comparison table + controls + map, sharing one border/radius */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-white">
            {/* Comparison table */}
            <div className="flex shrink-0 items-start gap-3 border-b border-black/[0.08] px-4 pb-2.5 pt-2.5">
              <div className="min-w-0 flex-1 overflow-x-auto">
                <div className="min-w-[640px]">
                  <div className="flex">
                    {COMPARISON_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className={`flex h-7 flex-1 items-center bg-black/[0.04] px-3 ${col.align}`}
                      >
                        <span className="whitespace-nowrap text-xs font-semibold text-[#525252]">
                          {col.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {COMPARISON_ROWS.map((row, i) => (
                    <div
                      key={`${row.kpi}-${i}`}
                      className="flex border-b border-black/[0.08] last:border-b-0"
                    >
                      {COMPARISON_COLUMNS.map((col) => (
                        <div
                          key={col.key}
                          className={`flex h-6 flex-1 items-center px-3 ${col.align}`}
                        >
                          <span
                            className={`whitespace-nowrap text-xs ${
                              col.key === "wow" && row.wow === "Lose"
                                ? "text-[#ef4444]"
                                : "text-[#525252]"
                            }`}
                          >
                            {row[col.key as keyof ComparisonRow]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-label="Expand table"
                className="flex size-7 shrink-0 items-center justify-center rounded-[10px] border border-[#e6e5e3] bg-white transition-colors hover:bg-black/[0.02]"
              >
                <Maximize2 className="size-3.5 text-[#3b82f6]" strokeWidth={1.75} />
              </button>
            </div>

            {/* Metric selector + Maps/Detail tabs */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] px-4 py-1.5">
              <div className="relative">
                <select
                  aria-label="Select metric"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="h-8 w-[150px] appearance-none rounded-xl border border-black/[0.08] bg-white py-1 pl-3 pr-8 text-sm font-medium text-[#525252] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] outline-none"
                >
                  {METRIC_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-black"
                  strokeWidth={1}
                />
              </div>

              <div className="flex items-center rounded-[80px] bg-black/[0.04] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("maps")}
                  className={`rounded-3xl px-4 py-1 text-sm font-medium text-[#525252] transition-colors ${
                    activeTab === "maps"
                      ? "border border-black/[0.08] bg-white shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]"
                      : ""
                  }`}
                >
                  Maps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("detail")}
                  className={`rounded-3xl px-4 py-1 text-sm font-medium text-[#525252] transition-colors ${
                    activeTab === "detail"
                      ? "border border-black/[0.08] bg-white shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]"
                      : ""
                  }`}
                >
                  Detail
                </button>
              </div>
            </div>

            {/* Maps / Detail area */}
            <div className="min-h-0 flex-1 p-3">
              {activeTab === "maps" ? (
                <RegionMap />
              ) : (
                <DetailTable />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailTable() {
  return (
    <div className="h-full overflow-auto rounded-[10px] border border-black/[0.08]">
      <div className="min-w-[560px]">
        <div className="flex bg-black/[0.04]">
          <div className="flex h-10 flex-1 items-center px-3">
            <span className="text-sm font-semibold text-[#525252]">Region</span>
          </div>
          <div className="flex h-10 flex-1 items-center px-3">
            <span className="text-sm font-semibold text-[#525252]">Status</span>
          </div>
          <div className="flex h-10 flex-1 items-center px-3">
            <span className="text-sm font-semibold text-[#525252]">Value Indihome</span>
          </div>
          <div className="flex h-10 flex-1 items-center px-3">
            <span className="text-sm font-semibold text-[#525252]">Nearest Competitor</span>
          </div>
        </div>

        {SAMPLE_REGIONS.map((region) => (
          <div key={region.id} className="flex border-b border-black/[0.08] last:border-b-0">
            <div className="flex h-[30px] flex-1 items-center px-3">
              <span className="text-sm text-[#525252]">{region.name}</span>
            </div>
            <div className="flex h-[30px] flex-1 items-center px-3">
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
            <div className="flex h-[30px] flex-1 items-center px-3">
              <span className="text-sm text-[#525252]">{region.valuePercent}</span>
            </div>
            <div className="flex h-[30px] flex-1 items-center px-3">
              <span className="text-sm text-[#525252]">{region.nearestCompetitor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
