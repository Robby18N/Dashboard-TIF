"use client";

import { useState } from "react";
import { ChevronDown, Upload } from "lucide-react";
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

/** Static filter pills shown in the top filter bar — placeholders until real filter logic lands. */
const FILTER_PILLS = ["Select Filter Metrics", "Select KPI", "Select Level", "Filter KPI", "Category"];

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
 * the same spirit as RegionMap's REGION_METRICS (the map's ids mirror these
 * ids one-to-one) — swap both together whenever real figures are available.
 * "INNER JABO" is a group row: it aggregates the five nested DKI Jakarta
 * areas beneath it.
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
  Consecutive: "text-[#64748b]",
  Improve: "text-[#21a647]",
  Degrade: "text-[#f97316]",
  "New Lose": "text-[#c23837]",
  "Inconsistent Lose": "text-[#c23837]",
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
  const color = trend === "up" ? "#21a647" : "#c23837";
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

/** Shared Win/Lose pill, used by both the Metrics and Detail tables. */
function StatusPill({ status }: { status: "Win" | "Lose" }) {
  return (
    <span
      className={`whitespace-nowrap rounded-[9px] px-2.5 py-1 text-[12px] font-medium ${
        status === "Win" ? "bg-[#f0fdf4] text-[#21a647]" : "bg-[#fef2f2] text-[#c23837]"
      }`}
    >
      {status}
    </span>
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
      className={`group flex border-b border-l-[3px] border-l-transparent border-[#e2e8f0] transition-colors last:border-b-0 hover:border-l-[#3b82f6] hover:bg-[#f8fafc] ${
        isTotal ? "bg-[#f8fafc]" : ""
      }`}
    >
      <div
        style={{ width: 220, paddingLeft: indent ? 40 : 12 }}
        className={`sticky left-0 z-10 flex h-[38px] shrink-0 items-center gap-2 border-l-[3px] border-l-transparent pr-3 transition-colors group-hover:border-l-[#3b82f6] group-hover:bg-[#f8fafc] ${
          isTotal ? "bg-[#f8fafc]" : "bg-white"
        }`}
      >
        {!indent &&
          (isGroup ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label={isExpanded ? `Collapse ${row.name}` : `Expand ${row.name}`}
              aria-expanded={isExpanded}
              className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e2e8f0] bg-white transition-colors hover:bg-[#f8fafc]"
            >
              <ChevronDown
                className={`size-4 text-[#64748b] transition-transform duration-200 ${
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
              className="flex size-6 shrink-0 cursor-default items-center justify-center overflow-hidden rounded-full border border-[#e2e8f0] bg-white opacity-60"
            >
              <ChevronDown className="size-4 -rotate-90 text-[#64748b]" strokeWidth={1.67} />
            </span>
          ))}
        <span
          className={`truncate text-[12px] text-[#020617] ${
            isTotal || isGroup ? "font-semibold" : "font-normal"
          }`}
        >
          {row.name}
        </span>
      </div>

      <div style={{ width: 120 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-[12px] font-normal text-[#020617]">{row.valueIndihome}</span>
      </div>

      <div style={{ width: 70 }} className="flex h-[38px] shrink-0 items-center px-3">
        <Sparkline trend={row.trend} />
      </div>

      <div style={{ width: 90 }} className="flex h-[38px] shrink-0 items-center px-3">
        <StatusPill status={row.status} />
      </div>

      <div style={{ width: 150 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className={`text-[12px] font-medium ${BENCHMARK_STYLE[row.benchmarkStatus]}`}>
          {row.benchmarkStatus}
        </span>
      </div>

      <div style={{ width: 140 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-[12px] font-normal text-[#020617]">{row.nearestCompetitor}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-[12px] font-normal text-[#020617]">{row.winner}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-[12px] font-normal text-[#020617]">{row.winnerValue}</span>
      </div>

      <div style={{ width: 110 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="text-[12px] font-normal text-[#020617]">{row.gapToWinner}</span>
      </div>

      <div style={{ width: 160 }} className="flex h-[38px] shrink-0 items-center px-3">
        <span className="truncate text-[12px] font-normal text-[#020617]">{row.highlight}</span>
      </div>
    </div>
  );
}

export default function OnxDashboard() {
  const [activeTab, setActiveTab] = useState<"maps" | "detail">("maps");
  const [selectedMetric, setSelectedMetric] = useState("TTFB");
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Decorative scalloped bar, full page width (spans over the sidebar
          too) — identical to the FBB dashboard's header bar, just with this
          page's own title in the notch. */}
      <div className="relative h-[52px] w-full shrink-0 drop-shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <svg
          viewBox="0 0 1920 56"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 h-[40px] w-full"
        >
          <defs>
            <mask id="onx-header-bar-mask">
              <path
                d="M0.00006 0l1919.99984 0 0 29.317c0 0-635 0-688.981 0-53.9809 0-34.8509 26.683-66.185 26.683-31.334 0-374.3339 0-406.01896 0-31.685 0-12.86902-26.683-66.09198-26.683-53.22302 0-692.72296 0-692.72296 0l0-29.317 0.00006 0z"
                fill="#fff"
              />
            </mask>
          </defs>
          <path
            d="M0.00006 0l1919.99984 0 0 29.317c0 0-635 0-688.981 0-53.9809 0-34.8509 26.683-66.185 26.683-31.334 0-374.3339 0-406.01896 0-31.685 0-12.86902-26.683-66.09198-26.683-53.22302 0-692.72296 0-692.72296 0l0-29.317 0.00006 0z"
            fill="#ffffff"
          />
          <path
            d="M0.00006-0.5l1920.49984 0 0 30.317-346.8146 0-342.6664 0q-10.8486 0-18.8262 1.45116-7.0001 1.27335-12.0737 3.72609-2.234 1.07995-4.1784 2.42487-1.7214 1.19056-3.3063 2.65405-1.3169 1.216-2.7072 2.78227-0.5531 0.62309-1.2124 1.40778-0.4013 0.47773-1.1629 1.4015-1.1633 1.41097-1.7518 2.0926-0.9833 1.13902-1.8328 1.99547-1.0193 1.02767-2.0331 1.84323-1.1356 0.9136-2.3495 1.6316-2.6912 1.59188-6.0872 2.39097-3.7457 0.88141-8.6635 0.88141l-203.03617 0-202.98279 0q-5.00622 0-8.82574-0.89326-3.46051-0.80931-6.20777-2.42039-1.23871-0.72644-2.39837-1.65024-1.03504-0.82452-2.07642-1.86327-0.86743-0.86522-1.87213-2.01584-0.60248-0.68997-1.78839-2.11221-0.77582-0.93043-1.17096-1.39557-0.66138-0.77858-1.21893-1.40071-1.39631-1.55805-2.71137-2.76545-1.58282-1.45324-3.29376-2.63475-1.93189-1.33409-4.14215-2.40464-5.01709-2.43002-11.90338-3.6907-7.84375-1.43596-18.48261-1.43596l-344.60324-0.00001-348.61972 0 0-30.317 0.50006 0z m0 1l-0.00006 0 0-0.5 0.5 0 0 29.317-0.5 0 0-0.5 348.11972 0 344.60324 0.00001q10.72962 0 18.66266 1.4523 7.01996 1.28515 12.15924 3.77436 2.27936 1.10401 4.27448 2.48177 1.76782 1.22081 3.40179 2.72101 1.35144 1.24079 2.77985 2.83466 0.56445 0.62985 1.23626 1.42069 0.40314 0.47459 1.17694 1.40257 1.17859 1.41346 1.77363 2.0949 0.98254 1.12523 1.82501 1.96557 1.00195 0.99938 1.99328 1.78911 1.10382 0.87935 2.28119 1.56979 2.61652 1.53442 5.92969 2.30927 3.70715 0.86699 8.59796 0.86699l202.98279 0 203.03617 0q4.8017 0 8.4345-0.85482 3.2473-0.76412 5.8072-2.27826 1.1522-0.68152 2.2318-1.55007 0.9697-0.78011 1.9498-1.76827 0.8254-0.83223 1.786-1.94477 0.5822-0.67422 1.7371-2.07519 0.7718-0.93629 1.1688-1.40871 0.6664-0.79301 1.2302-1.4283 1.424-1.60419 2.7765-2.85314 1.6365-1.51105 3.4159-2.7418 2.0084-1.38911 4.312-2.50274 5.1961-2.51191 12.3301-3.80963 8.0663-1.4673 19.0051-1.4673l342.6664 0 346.3146 0 0 0.5-0.5 0 0-29.317 0.5 0 0 0.5-1919.99984 0z"
            fill="#17171714"
            mask="url(#onx-header-bar-mask)"
          />
        </svg>

        {/* Title tab, centered and scaled to match the bar's notch */}
        <div className="absolute left-1/2 top-0 h-[52px] w-[28.5417%] min-w-[280px] max-w-[500px] -translate-x-1/2">
          <svg
            viewBox="0 0 548 73"
            preserveAspectRatio="none"
            className="absolute left-0 top-0 h-full w-full"
          >
            <path
              d="M0 0l548 0c-102.75003 0-75.582 73-133.88638 73l-284.89771 0c-48.1851 0-26.46593-73-129.21591-73z"
              fill="#ffffff"
            />
            <path
              d="M0-0.5l548 0 0 1q-20.77081 0-36.52985 4.01392-7.2102 1.83648-13.47989 4.53528-5.81958 2.50506-10.92373 5.79551-4.65747 3.00249-8.84586 6.74371-3.71066 3.31448-7.24301 7.38494-2.92956 3.37586-6.10947 7.7194-1.26577 1.72896-2.77557 3.88842-0.90631 1.29631-2.66739 3.85558-2.62723 3.81804-3.94375 5.66008-2.19001 3.0642-4.03336 5.36152-2.20572 2.74892-4.32635 4.92613-2.37299 2.4363-4.82316 4.35047-2.65741 2.07609-5.52053 3.63022-3.04691 1.65388-6.41169 2.76396-3.53488 1.1662-7.49145 1.75636-4.11981 0.6145-8.76132 0.6145l-284.89771 0q-7.12531 0-12.90114-2.13924-2.71152-1.00429-5.20594-2.50309-2.34571-1.40945-4.56466-3.29646-2.04746-1.74119-4.07302-3.96397-1.81225-1.98871-3.73727-4.50936-1.61086-2.10929-3.55889-4.93718-1.17319-1.70309-3.53682-5.25016-1.75374-2.63182-2.6574-3.96563-1.51161-2.23116-2.7879-4.02772-3.21317-4.52298-6.20501-8.06593-3.61611-4.28224-7.43969-7.78858-4.32603-3.9671-9.15141-7.16398-5.29973-3.51114-11.34546-6.19206-6.52701-2.89435-14.02552-4.86813-16.44422-4.32851-38.02578-4.32851l0-1z m0 1l0-0.5 0-0.5q21.71097 0 38.28033 4.36145 7.57604 1.99419 14.17634 4.92104 6.12258 2.71501 11.49239 6.27257 4.89097 3.24033 9.27499 7.2606 3.87054 3.54941 7.52783 7.88042 3.01892 3.57504 6.25622 8.13197 1.28234 1.80506 2.80056 4.04597 0.90656 1.33811 2.66168 3.97199 2.35946 3.54081 3.52816 5.2374 1.9342 2.80781 3.53012 4.89753 1.89863 2.48611 3.68166 4.44274 1.98274 2.17579 3.98172 3.87575 2.15644 1.83386 4.43187 3.20108 2.41433 1.45068 5.03822 2.42251 5.60774 2.07698 12.55382 2.07698l284.89771 0q4.56735 0 8.6138-0.60356 3.87207-0.57755 7.32568-1.71694 3.27966-1.08201 6.24793-2.69319 2.79-1.51444 5.38192-3.53937 2.39673-1.87245 4.72245-4.26019 2.08715-2.14283 4.26275-4.85422 1.82575-2.27539 3.99973-5.31715 1.3125-1.8364 3.93356-5.64549 1.76553-2.56577 2.6716-3.86171 1.51563-2.16778 2.78827-3.90613 3.20425-4.37684 6.1611-7.78411 3.57419-4.11865 7.33206-7.47532 4.24671-3.79331 8.97025-6.83839 5.17419-3.33561 11.07016-5.87355 6.34195-2.72992 13.62845-4.58582 15.88049-4.04486 36.77667-4.04486l0 0.5 0 0.5-548 0z"
              fill="#17171714"
            />
          </svg>
          <h1 className="absolute left-1/2 top-[15px] -translate-x-1/2 whitespace-nowrap text-[16px] font-semibold text-[#020617]">
            ONX Dashboard
          </h1>
        </div>
      </div>

      {/* Sidebar + content row. No fixed height / overflow-hidden here — the
          page is meant to scroll vertically when content grows past the
          viewport, rather than clipping everything to a fixed screen height. */}
      <div className="flex flex-1">
        <Sidebar activeKey="onx" />

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex flex-1 flex-col gap-4 bg-[#f1f5f9] p-4">
            {/* Filter bar: static filter pills on the left, Export + avatar on
                the right — replaces the old vertical "Filter Insight" side
                panel with a horizontal bar matching the FBB dashboard. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 rounded-full border border-[#e2e8f0] bg-white p-2">
                {FILTER_PILLS.map((label) => (
                  <div
                    key={label}
                    className="flex h-9 w-[190px] shrink-0 items-center justify-between gap-3 rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-4"
                  >
                    <span className="whitespace-nowrap text-sm font-medium text-[#0f172a]">
                      {label}
                    </span>
                    <ChevronDown className="size-4 shrink-0 text-[#64748b]" strokeWidth={1.75} />
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-full border border-[#e2e8f0] bg-white p-2">
                <button className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[linear-gradient(90deg,#3b82f6_0%,#6810f4_100%)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  <Upload className="size-4" strokeWidth={1.75} />
                  Export
                </button>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1f6eeb] text-xs font-medium text-white">
                  UN
                </span>
              </div>
            </div>

            {/* Details Metrics card */}
            <div className="flex shrink-0 flex-col gap-3 rounded-[19px] border border-[#e2e8f0] bg-white p-4 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[18px] font-semibold text-[#020617]">Details Metrics</span>
                <button
                  type="button"
                  aria-label={isTableCollapsed ? "Expand table" : "Collapse table"}
                  aria-expanded={!isTableCollapsed}
                  onClick={() => setIsTableCollapsed((collapsed) => !collapsed)}
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] transition-colors hover:bg-[#eef2f6]"
                >
                  <ChevronDown
                    className={`size-4 text-[#334155] transition-transform duration-300 ${
                      isTableCollapsed ? "-rotate-90" : ""
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
              </div>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isTableCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] shadow-[0px_1px_2.625px_0px_rgba(0,0,0,0.1)]">
                    <div className="min-w-[640px]">
                      <div className="flex items-center border-b border-[#e2e8f0] bg-[#f8fafc]">
                        {COMPARISON_COLUMNS.map((col, idx) => (
                          <div
                            key={col.key}
                            className={`flex h-10 flex-1 items-center px-4 ${
                              idx !== COMPARISON_COLUMNS.length - 1 ? "border-r border-[#e2e8f0]" : ""
                            } ${col.align}`}
                          >
                            <span className="whitespace-nowrap text-[12px] font-semibold leading-[16px] text-[#334155]">
                              {col.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {COMPARISON_ROWS.map((row, i) => (
                        <div
                          key={`${row.kpi}-${i}`}
                          className={`flex items-center ${
                            i !== COMPARISON_ROWS.length - 1 ? "border-b border-[#e2e8f0]" : ""
                          }`}
                        >
                          {COMPARISON_COLUMNS.map((col, idx) => (
                            <div
                              key={col.key}
                              className={`flex h-8 flex-1 items-center px-4 ${
                                idx !== COMPARISON_COLUMNS.length - 1 ? "border-r border-[#e2e8f0]" : ""
                              } ${col.align}`}
                            >
                              {col.key === "wow" ? (
                                <span
                                  className={`whitespace-nowrap text-[14px] font-bold leading-[17px] ${
                                    row.wow === "Lose" ? "text-[#c23837]" : "text-[#21a647]"
                                  }`}
                                >
                                  {row.wow}
                                </span>
                              ) : col.key === "highlight" ? (
                                <span
                                  className={`whitespace-nowrap text-[14px] font-bold leading-[17px] ${
                                    row.highlight === "Need Improve"
                                      ? "text-[#c23837]"
                                      : "text-[#21a647]"
                                  }`}
                                >
                                  {row.highlight}
                                </span>
                              ) : (
                                <span className="whitespace-nowrap text-[14px] font-medium leading-[17px] text-[#020617]">
                                  {row[col.key as keyof ComparisonRow]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map View / Detail View card */}
            <div className="flex flex-1 flex-col gap-3 rounded-[19px] border border-[#e2e8f0] bg-white p-4 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
                <div className="relative">
                  <select
                    aria-label="Select metric"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="h-9 w-[150px] appearance-none rounded-full border border-[#e2e8f0] bg-white py-1 pl-4 pr-8 text-sm font-medium text-[#0a0a0a] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] outline-none"
                  >
                    {METRIC_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#737373]"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex items-center rounded-[48px] border border-[#e2e8f0] bg-white p-1 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("maps")}
                    className={`rounded-[48px] px-3 py-1 text-sm font-medium transition-colors ${
                      activeTab === "maps"
                        ? "bg-[#3b82f6] text-white"
                        : "text-[#64748b]"
                    }`}
                  >
                    Map View
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("detail")}
                    className={`rounded-[48px] px-3 py-1 text-sm font-medium transition-colors ${
                      activeTab === "detail"
                        ? "bg-[#3b82f6] text-white"
                        : "text-[#64748b]"
                    }`}
                  >
                    Detail View
                  </button>
                </div>
              </div>

              {/* Maps / Detail area */}
              <div className={activeTab === "maps" ? "h-[520px]" : ""}>
                {activeTab === "maps" ? <RegionMap /> : <DetailTable />}
              </div>
            </div>
          </main>
        </div>
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
    <div className="overflow-x-auto overflow-y-visible rounded-[10px] border border-[#e2e8f0]">
      <div className="overflow-x-auto">
        <div style={{ minWidth: DETAIL_TABLE_WIDTH }}>
          <div className="flex bg-[#f8fafc]">
            {DETAIL_COLUMNS.map((col) => (
              <div
                key={col.key}
                style={{ width: col.width }}
                className={`flex h-10 shrink-0 items-center px-3 ${
                  col.key === "region" ? "sticky left-0 z-10 bg-[#f8fafc]" : ""
                }`}
              >
                <span className="whitespace-nowrap text-[12px] font-medium text-[#334155]">
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
