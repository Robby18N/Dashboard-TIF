"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  ChevronDown,
  Gauge,
  MonitorCheck,
  MonitorX,
  Search,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
  valueColor: string;
};

const KPIS: Kpi[] = [
  {
    label: "Total Performance Indicator",
    value: "11",
    icon: Gauge,
    valueColor: "text-[#050505]",
  },
  {
    label: "Indicators Achieved",
    value: "9",
    icon: MonitorCheck,
    valueColor: "text-[#21a647]",
  },
  {
    label: "Indicators Not Achieved",
    value: "2",
    icon: MonitorX,
    valueColor: "text-[#c23837]",
  },
  {
    label: "Lowest Achievement",
    value: "94%",
    icon: ArrowDownWideNarrow,
    valueColor: "text-[#c23837]",
  },
];

type SlaRow = {
  segmen: string;
  indicator: string;
  layanan: string;
  satuan: string;
  source: string;
  target: string;
  realisasi: string;
  capaian: string;
  achieved: boolean;
};

const SLA_ROWS: SlaRow[] = [
  {
    segmen: "Network",
    indicator: "ONM-ALL-Compliance Change Request",
    layanan: "ALL NE",
    satuan: "%",
    source: "cra.telkom.co.id",
    target: "99.00",
    realisasi: "100.00",
    capaian: "101.0%",
    achieved: true,
  },
  {
    segmen: "Enterprise",
    indicator: "ONM-ENT-Compliance Jitter 10ms (*)",
    layanan: "Datin Astinet",
    satuan: "%",
    source: "Netmonk",
    target: "97.00",
    realisasi: "99.31",
    capaian: "102.4%",
    achieved: true,
  },
  {
    segmen: "Enterprise",
    indicator: "ONM-ENT-Compliance Latency 50ms (*)",
    layanan: "Datin Astinet",
    satuan: "%",
    source: "Netmonk",
    target: "97.00",
    realisasi: "96.85",
    capaian: "99.8%",
    achieved: false,
  },
  {
    segmen: "Enterprise",
    indicator: "ONM-ENT-Compliance Packet Loss 1% (*)",
    layanan: "Datin Astinet",
    satuan: "%",
    source: "Netmonk",
    target: "97.00",
    realisasi: "97.43",
    capaian: "100.4%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-Latency Domestic (*)",
    layanan: "Internet",
    satuan: "ms",
    source: "Ookla (Provided by TSEL)",
    target: "49.00",
    realisasi: "51.92",
    capaian: "94.0%",
    achieved: false,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-Latency Global (*)",
    layanan: "Internet",
    satuan: "ms",
    source: "Opensignal",
    target: "53.00",
    realisasi: "33.10",
    capaian: "137.5%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-Packet Loss Domestic (*)",
    layanan: "Internet",
    satuan: "%",
    source: "Ookla (Provided by TSEL)",
    target: "1.00",
    realisasi: "1.00",
    capaian: "100.0%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-Packet Loss Global (*)",
    layanan: "Internet",
    satuan: "%",
    source: "Opensignal",
    target: "2.00",
    realisasi: "0.00",
    capaian: "200.0%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-MOS IPTV Compliance ≥ 4",
    layanan: "IPTV",
    satuan: "%",
    source: "dashinfra.telkom.co.id",
    target: "97.00",
    realisasi: "99.73",
    capaian: "102.8%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-MOS Voice ≥ 4",
    layanan: "Voice",
    satuan: "Score",
    source: "dashinfra.telkom.co.id",
    target: "4.00",
    realisasi: "4.33",
    capaian: "108.3%",
    achieved: true,
  },
  {
    segmen: "Fixed Broadband",
    indicator: "ONM-WHF-Voice Call Set Up",
    layanan: "Voice",
    satuan: "Sec",
    source: "dashinfra.telkom.co.id",
    target: "6.00",
    realisasi: "5.16",
    capaian: "116.3%",
    achieved: true,
  },
];

// Column widths are narrower by default so the table fits laptop-class
// screens (~1440px) without a horizontal scrollbar, and widen back out to
// the original design sizing at 2xl (>=1536px) for larger monitors.
const TABLE_COLUMNS = [
  { key: "segmen", label: "Segmen", width: "w-[140px] 2xl:w-[200px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "indicator", label: "Performance Indicator", width: "w-[300px] 2xl:w-[360px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "layanan", label: "Layanan", width: "w-[120px] 2xl:w-[160px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "satuan", label: "Satuan", width: "w-[90px] 2xl:w-[120px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "source", label: "Source Data", width: "w-[150px] 2xl:w-[200px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "target", label: "Target", width: "w-[100px] 2xl:w-[160px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "realisasi", label: "Realisasi W4 Aug‘26", width: "flex-1", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "capaian", label: "Capaian W4 Aug‘26", width: "flex-1", align: "justify-center text-center", headerColor: "text-[#334155]" },
] as const;

type RowGroup = { segmen: string; rows: SlaRow[] };

export default function FbbDashboard() {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SLA_ROWS;
    return SLA_ROWS.filter((row) =>
      [row.segmen, row.indicator, row.layanan, row.source].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [search]);

  const groupedRows = useMemo(() => {
    const groups: RowGroup[] = [];
    filteredRows.forEach((row) => {
      const last = groups[groups.length - 1];
      if (last && last.segmen === row.segmen) {
        last.rows.push(row);
      } else {
        groups.push({ segmen: row.segmen, rows: [row] });
      }
    });
    return groups;
  }, [filteredRows]);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <Sidebar activeKey="fbb" />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="relative shrink-0 bg-[#f1f5f9]">
          {/* Decorative scalloped bar, edge-to-edge across the main column */}
          <div className="relative h-[52px] w-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <svg
              viewBox="0 0 1920 56"
              preserveAspectRatio="none"
              className="absolute left-0 top-0 h-[40px] w-full"
            >
              <defs>
                <mask id="fbb-header-bar-mask">
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
                mask="url(#fbb-header-bar-mask)"
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
                SLA WISA FBB
              </h1>
            </div>
          </div>

          {/* Period + Region/Week/Export/avatar row, sitting just below the bar */}
          <div className="flex flex-wrap items-start justify-between gap-4 px-6 pb-4 pt-2">
            {/* Period pill */}
            <div className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.06)]">
              <CalendarDays className="size-5 shrink-0 text-[#64748b]" strokeWidth={1.75} />
              <span className="whitespace-nowrap text-sm font-medium text-[#64748b]">
                Pencapaian Terakhir Period W4{" "}
                <span className="text-[#0f172a]">(Agu 2026 - 27 Agu 2026)</span>
              </span>
            </div>

            {/* Region / Week / Export / avatar */}
            <div className="flex h-10 shrink-0 items-center gap-3 rounded-full border border-[#e2e8f0] bg-white p-1">
              <button className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f8fafc] px-3 text-sm font-medium text-[#0f172a] outline outline-1 outline-[#e2e8f0] transition-colors hover:bg-[#eef2f6]">
                Select Region
                <ChevronDown className="size-4 text-[#64748b]" strokeWidth={1.5} />
              </button>
              <button className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f8fafc] px-3 text-sm font-medium text-[#0f172a] outline outline-1 outline-[#e2e8f0] transition-colors hover:bg-[#eef2f6]">
                Select Week
                <ChevronDown className="size-4 text-[#64748b]" strokeWidth={1.5} />
              </button>
              <button className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[linear-gradient(90deg,#3b82f6_0%,#6810f4_100%)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                <Upload className="size-4" strokeWidth={1.75} />
                Export
              </button>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1f6eeb] text-xs font-medium text-white">
                UN
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex flex-1 flex-col px-6 pb-6">
          {/* Outer card */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-[36px] border border-[#e2e8f0] bg-white p-4">
            {/* KPI row */}
            <div className="flex shrink-0 flex-wrap gap-3">
              {KPIS.map(({ label, value, icon: Icon, valueColor }) => (
                <div
                  key={label}
                  className="flex h-14 min-w-[200px] flex-1 items-stretch overflow-hidden rounded-xl border border-[#e2e8f0]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 border-r border-[#e2e8f0] px-3">
                    <Icon className="size-4 shrink-0 text-[#334155]" strokeWidth={1.75} />
                    <span className="truncate text-sm font-semibold text-[#0f172a]">
                      {label}
                    </span>
                  </div>
                  <div className="flex w-20 shrink-0 items-center justify-center px-3">
                    <span className={`text-xl font-bold leading-none ${valueColor}`}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters + table container */}
            <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-[19px] border border-[#e2e8f0] bg-white p-4 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]">
              {/* Filters */}
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <div className="relative h-9 w-full max-w-[260px] shrink-0">
                  <span className="pointer-events-none absolute left-3 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center text-[#737373]">
                    <Search className="size-3.5" strokeWidth={1.5} />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="h-9 w-full rounded-[20px] border border-[#e2e8f0] bg-white py-1 pl-8 pr-7 text-sm text-[#0f172a] outline-none placeholder:text-[#64748b]"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center text-[#64748b] hover:opacity-70"
                    >
                      <X className="size-3.5" strokeWidth={1.333} />
                    </button>
                  )}
                </div>

                <span className="flex h-9 shrink-0 items-center rounded-full bg-[#f1f5f9] px-3 text-sm font-medium text-[#64748b]">
                  Showing {filteredRows.length} of {SLA_ROWS.length} entries
                </span>
              </div>

              {/* Table */}
              <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#e2e8f0]">
                <div className="min-w-[900px] 2xl:min-w-[1400px]">
                  {/* Header */}
                  <div className="flex h-12 border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {TABLE_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className={`flex h-full items-center gap-2.5 border-r border-[#e2e8f0] ${
                          col.width === "flex-1" ? "px-3" : "px-4"
                        } ${col.width} ${col.align}`}
                      >
                        <span className={`whitespace-nowrap text-sm font-medium leading-[19px] ${col.headerColor}`}>
                          {col.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Grouped rows */}
                  {groupedRows.map((group, groupIdx) => {
                    const isLastGroup = groupIdx === groupedRows.length - 1;
                    return (
                      <div key={`${group.segmen}-${group.rows[0].indicator}`} className="flex">
                        <div
                          className={`flex w-[140px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-4 py-2 text-center 2xl:w-[200px] ${
                            isLastGroup ? "" : "border-b"
                          }`}
                        >
                          <span className="text-sm font-medium leading-[17px] text-[#020617]">
                            {group.segmen}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          {group.rows.map((row, rowIdx) => {
                            const isLastRow = isLastGroup && rowIdx === group.rows.length - 1;
                            const rowBorderB = isLastRow ? "" : "border-b";
                            return (
                              <div key={row.indicator} className="flex min-h-[48px] items-stretch">
                                <div
                                  className={`flex h-full w-[300px] shrink-0 items-center border-r border-[#e2e8f0] px-4 py-2 2xl:w-[360px] ${rowBorderB}`}
                                >
                                  <span className="text-sm font-normal leading-[17px] text-[#020617]">
                                    {row.indicator}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full w-[120px] shrink-0 items-center border-r border-[#e2e8f0] px-4 2xl:w-[160px] ${rowBorderB}`}
                                >
                                  <span
                                    title={row.layanan}
                                    className="truncate text-sm font-normal leading-[17px] text-[#020617]"
                                  >
                                    {row.layanan}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full w-[90px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3 2xl:w-[120px] ${rowBorderB}`}
                                >
                                  <span className="text-sm font-normal leading-[17px] text-[#020617]">
                                    {row.satuan}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full w-[150px] shrink-0 items-center border-r border-[#e2e8f0] px-4 2xl:w-[200px] ${rowBorderB}`}
                                >
                                  <span
                                    title={row.source}
                                    className="truncate text-sm font-normal leading-[17px] text-[#020617]"
                                  >
                                    {row.source}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full w-[100px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3 2xl:w-[160px] ${rowBorderB}`}
                                >
                                  <span className="text-sm font-normal leading-[17px] text-[#020617]">
                                    {row.target}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full flex-1 items-center justify-center border-r border-[#e2e8f0] px-3 ${rowBorderB}`}
                                >
                                  <span className="text-sm font-normal leading-[17px] text-[#020617]">
                                    {row.realisasi}
                                  </span>
                                </div>
                                <div
                                  className={`flex h-full flex-1 items-center justify-center border-r border-[#e2e8f0] px-3 ${rowBorderB}`}
                                >
                                  <span
                                    className={`text-sm font-normal leading-[16px] ${
                                      row.achieved ? "text-[#21a647]" : "text-[#c23837]"
                                    }`}
                                  >
                                    {row.capaian}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {groupedRows.length === 0 && (
                    <div className="flex h-[100px] items-center justify-center text-sm text-[#64748b]">
                      Tidak ada data yang cocok dengan pencarian.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
