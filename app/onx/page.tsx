"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Filter,
  Moon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import RegionMap from "./RegionMap";

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

type BenchmarkStatus =
  | "Consecutive"
  | "New Lose"
  | "Degrade"
  | "Improve"
  | "Inconsistent Lose";

type DetailRegionRow = {
  id: string;
  name: string;
  status: "Win" | "Lose";
  valueIndihome: string;
  trend: "up" | "down";
  benchmarkStatus: BenchmarkStatus;
  nearestCompetitor: string;
  winner: string;
  winnerValue: string;
  gapToWinner: string;
  highlight: string;
  children?: DetailRegionRow[];
};

/**
 * Sample region-breakdown data for the Detail tab. Placeholder figures in
 * the same spirit as RegionMap's SAMPLE_REGIONS — swap for real figures
 * whenever they're available. "INNER JABO" is a group row: it aggregates
 * the five nested DKI Jakarta areas beneath it.
 */
const DETAIL_REGIONS: DetailRegionRow[] = [
  { id: "sumbagut", name: "SUMBAGUT", status: "Win", valueIndihome: "98.20%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Indosat", winner: "Indihome", winnerValue: "98.20%", gapToWinner: "-", highlight: "Strong performance" },
  { id: "sumbagteng", name: "SUMBAGTENG", status: "Win", valueIndihome: "95.60%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "95.60%", gapToWinner: "-", highlight: "Strong performance" },
  { id: "sumbagsel", name: "SUMBAGSEL", status: "Lose", valueIndihome: "88.40%", trend: "down", benchmarkStatus: "New Lose", nearestCompetitor: "IndosatHifi", winner: "IndosatHifi", winnerValue: "91.70%", gapToWinner: "+3.30%", highlight: "Priority focus" },
  {
    id: "inner-jabo",
    name: "INNER JABO",
    status: "Win",
    valueIndihome: "94.80%",
    trend: "up",
    benchmarkStatus: "Consecutive",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    winnerValue: "94.80%",
    gapToWinner: "-",
    highlight: "Stable",
    children: [
      { id: "kepulauan-seribu", name: "KEPULAUAN SERIBU", status: "Lose", valueIndihome: "90.10%", trend: "down", benchmarkStatus: "Degrade", nearestCompetitor: "XLSMART", winner: "XLSMART", winnerValue: "92.50%", gapToWinner: "+2.40%", highlight: "Needs attention" },
      { id: "jakarta-pusat", name: "JAKARTA PUSAT", status: "Win", valueIndihome: "97.30%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "97.30%", gapToWinner: "-", highlight: "Strong performance" },
      { id: "jakarta-selatan", name: "JAKARTA SELATAN", status: "Win", valueIndihome: "96.85%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "96.85%", gapToWinner: "-", highlight: "Strong performance" },
      { id: "jakarta-utara", name: "JAKARTA UTARA", status: "Lose", valueIndihome: "93.20%", trend: "down", benchmarkStatus: "Inconsistent Lose", nearestCompetitor: "IndosatHifi", winner: "IndosatHifi", winnerValue: "94.60%", gapToWinner: "+1.40%", highlight: "Monitor" },
      { id: "jakarta-barat", name: "JAKARTA BARAT", status: "Win", valueIndihome: "95.90%", trend: "up", benchmarkStatus: "Improve", nearestCompetitor: "XLSMART", winner: "Indihome", winnerValue: "95.90%", gapToWinner: "-", highlight: "Improving" },
    ],
  },
  { id: "outer-jabo", name: "OUTER JABO", status: "Win", valueIndihome: "93.75%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "93.75%", gapToWinner: "-", highlight: "Stable" },
  { id: "jabar", name: "JAWA BARAT", status: "Win", valueIndihome: "96.55%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "XLSMART", winner: "Indihome", winnerValue: "96.55%", gapToWinner: "-", highlight: "Strong performance" },
  { id: "jateng", name: "JAWA TENGAH", status: "Win", valueIndihome: "97.85%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "97.85%", gapToWinner: "-", highlight: "Strong performance" },
  { id: "jatim", name: "JAWA TIMUR", status: "Win", valueIndihome: "96.90%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "IndosatHifi", winner: "Indihome", winnerValue: "96.90%", gapToWinner: "-", highlight: "Strong performance" },
  { id: "balinusra", name: "BALI NUSRA", status: "Win", valueIndihome: "95.30%", trend: "up", benchmarkStatus: "Improve", nearestCompetitor: "XLHome", winner: "Indihome", winnerValue: "95.30%", gapToWinner: "-", highlight: "Improving" },
  { id: "kalimantan", name: "KALIMANTAN", status: "Win", valueIndihome: "96.10%", trend: "up", benchmarkStatus: "Consecutive", nearestCompetitor: "Biznet", winner: "Indihome", winnerValue: "96.10%", gapToWinner: "-", highlight: "Stable" },
  { id: "sulawesi", name: "SULAWESI", status: "Lose", valueIndihome: "89.75%", trend: "down", benchmarkStatus: "Degrade", nearestCompetitor: "XLSMART", winner: "XLSMART", winnerValue: "92.15%", gapToWinner: "+2.40%", highlight: "Needs attention" },
  { id: "maluku-papua", name: "MALUKU & PAPUA", status: "Lose", valueIndihome: "87.30%", trend: "down", benchmarkStatus: "New Lose", nearestCompetitor: "IndosatHifi", winner: "IndosatHifi", winnerValue: "90.65%", gapToWinner: "+3.35%", highlight: "Priority focus" },
];

const NATIONAL_ROW: DetailRegionRow = {
  id: "national",
  name: "NATIONAL",
  status: "Win",
  valueIndihome: "94.35%",
  trend: "up",
  benchmarkStatus: "Consecutive",
  nearestCompetitor: "-",
  winner: "Indihome",
  winnerValue: "94.35%",
  gapToWinner: "-",
  highlight: "Overall on track",
};

const BENCHMARK_STYLE: Record<BenchmarkStatus, string> = {
  Consecutive: "text-[#525252]",
  Improve: "text-[#22c55e]",
  Degrade: "text-[#f97316]",
  "New Lose": "text-[#ef4444]",
  "Inconsistent Lose": "text-[#ef4444]",
};

const DETAIL_COLUMNS: { key: string; label: string; width: number }[] = [
  { key: "region", label: "Region", width: 220 },
  { key: "value", label: "Value Indihome", width: 120 },
  { key: "trend", label: "Trend", width: 70 },
  { key: "status", label: "Status", width: 90 },
  { key: "benchmark", label: "Benchmark Status", width: 150 },
  { key: "competitor", label: "Nearest Competitor", width: 140 },
  { key: "winner", label: "Winner", width: 110 },
  { key: "winnerValue", label: "Winner Value", width: 110 },
  { key: "gap", label: "Gap to Winner", width: 110 },
  { key: "highlight", label: "Highlight", width: 160 },
];

const DETAIL_TABLE_WIDTH = DETAIL_COLUMNS.reduce((sum, col) => sum + col.width, 0);

function Sparkline({ trend }: { trend: "up" | "down" }) {
  const color = trend === "up" ? "#22c55e" : "#ef4444";
  const points =
    trend === "up"
      ? "0,18 8,14 16,16 24,9 32,11 40,3"
      : "0,3 8,7 16,5 24,12 32,10 40,18";

  return (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="shrink-0">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailTableRow({
  row,
  indent = false,
  isGroup = false,
  isExpanded = false,
  onToggle,
  isTotal = false,
}: {
  row: DetailRegionRow;
  indent?: boolean;
  isGroup?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  isTotal?: boolean;
}) {
  return (
    <div
      className={`flex border-b border-black/[0.08] last:border-b-0 ${
        isTotal ? "bg-black/[0.02]" : ""
      }`}
    >
      <div
        style={{ width: 220, paddingLeft: indent ? 40 : 12 }}
        className="flex h-[38px] shrink-0 items-center gap-2 pr-3"
      >
        {!indent &&
          (isGroup ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label={isExpanded ? `Collapse ${row.name}` : `Expand ${row.name}`}
              aria-expanded={isExpanded}
              className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e6e5e3] bg-white transition-colors hover:bg-black/[0.02]"
            >
              <ChevronDown
                className={`size-4 text-[#525252] transition-transform duration-200 ${
                  isExpanded ? "" : "-rotate-90"
                }`}
                strokeWidth={1.67}
              />
            </button>
          ) : (
            // No sub-regions yet for this row — the button is shown for visual
            // consistency across all regions, but stays inert until nested
            // data exists for it too.
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 cursor-default items-center justify-center overflow-hidden rounded-full border border-[#e6e5e3] bg-white opacity-60"
            >
              <ChevronDown className="size-4 -rotate-90 text-[#525252]" strokeWidth={1.67} />
            </span>
          ))}
        <span
          className={`truncate text-sm ${
            isTotal || isGroup ? "font-semibold text-[#0f172b]" : "text-[#525252]"
          }`}
        >
          {row.name}
        </span>
      </div>

      <div style={{ width: 120 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-sm text-[#525252]">{row.valueIndihome}</span>
      </div>

      <div style={{ width: 70 }} className="flex h-[38px] shrink-0 items-center px-3">
        <Sparkline trend={row.trend} />
      </div>

      <div style={{ width: 90 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span
          className={`whitespace-nowrap rounded-[9px] px-2.5 py-1 text-[13px] font-medium ${
            row.status === "Win" ? "bg-[#f0fdf4] text-[#22c55e]" : "bg-[#fef2f2] text-[#ef4444]"
          }`}
        >
          {row.status}
        </span>
      </div>

      <div style={{ width: 150 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className={`text-sm font-medium ${BENCHMARK_STYLE[row.benchmarkStatus]}`}>
          {row.benchmarkStatus}
        </span>
      </div>

      <div style={{ width: 140 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-sm text-[#525252]">{row.nearestCompetitor}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-sm text-[#525252]">{row.winner}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-sm text-[#525252]">{row.winnerValue}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-sm text-[#525252]">{row.gapToWinner}</span>
      </div>

      <div style={{ width: 160 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-sm text-[#525252]">{row.highlight}</span>
      </div>
    </div>
  );
}

export default function OnxDashboard() {
  const [activeTab, setActiveTab] = useState<"maps" | "detail">("maps");
  const [selectedMetric, setSelectedMetric] = useState("TTFB");
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

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
        <main className="flex min-h-0 flex-1 flex-col p-4">
          {/* Unified card: comparison table + controls + map, sharing one border/radius */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-white">
            {/* Comparison table */}
            <div className="flex shrink-0 items-start gap-3 border-b border-black/[0.08] px-4 pb-2.5 pt-2.5">
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Collapsed label */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isTableCollapsed ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className="block py-1 text-xs font-medium text-[#525252]">
                      Details Metrics
                    </span>
                  </div>
                </div>

                {/* Table content */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isTableCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
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
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label={isTableCollapsed ? "Expand table" : "Collapse table"}
                aria-expanded={!isTableCollapsed}
                onClick={() => setIsTableCollapsed((collapsed) => !collapsed)}
                className="flex size-7 shrink-0 items-center justify-center rounded-[10px] border border-[#e6e5e3] bg-white transition-colors hover:bg-black/[0.02]"
              >
                <ChevronDown
                  className={`size-[18px] text-[#3b82f6] transition-transform duration-300 ${
                    isTableCollapsed ? "" : "rotate-180"
                  }`}
                  strokeWidth={1.67}
                />
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(DETAIL_REGIONS.filter((row) => row.children).map((row) => row.id))
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="h-full overflow-auto rounded-[10px] border border-black/[0.08]">
      <div className="overflow-x-auto">
        <div style={{ minWidth: DETAIL_TABLE_WIDTH }}>
          <div className="flex bg-black/[0.04]">
            {DETAIL_COLUMNS.map((col) => (
              <div
                key={col.key}
                style={{ width: col.width }}
                className="flex h-10 shrink-0 items-center px-3"
              >
                <span className="whitespace-nowrap text-xs font-semibold text-[#525252]">
                  {col.label}
                </span>
              </div>
            ))}
          </div>

          {DETAIL_REGIONS.map((row) => (
            <div key={row.id}>
              <DetailTableRow
                row={row}
                isGroup={!!row.children}
                isExpanded={expandedGroups.has(row.id)}
                onToggle={() => toggleGroup(row.id)}
              />
              {row.children &&
                expandedGroups.has(row.id) &&
                row.children.map((child) => (
                  <DetailTableRow key={child.id} row={child} indent />
                ))}
            </div>
          ))}

          <DetailTableRow row={NATIONAL_ROW} isTotal />
        </div>
      </div>
    </div>
  );
}
