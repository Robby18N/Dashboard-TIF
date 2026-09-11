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
  { key: "realisasi", label: "Realisasi W4 Aug‘26", width: "flex-1", align: "justify-center text-center", headerColor: "text-[#3b82f6]" },
  { key: "capaian", label: "Capaian W4 Aug‘26", width: "flex-1", align: "justify-center text-center", headerColor: "text-[#3b82f6]" },
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
        <div className="relative flex shrink-0 flex-wrap items-start justify-between gap-4 bg-[#f1f5f9] px-6 pb-10 pt-6">
          {/* Period pill */}
          <div className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-4 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.06)]">
            <CalendarDays className="size-5 shrink-0 text-[#64748b]" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-sm font-medium text-[#64748b]">
              Pencapaian Terakhir Period W4{" "}
              <span className="text-[#0f172a]">(Agu 2026 - 27 Agu 2026)</span>
            </span>
          </div>

          {/* Title bump */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[28px] bg-white px-10 py-4 shadow-[0px_2px_6px_0px_rgba(15,23,42,0.08)]">
            <h1 className="whitespace-nowrap text-lg font-semibold text-[#020617]">
              SLA WISA FBB
            </h1>
          </div>

          {/* Region / Week / Export / avatar */}
          <div className="flex h-11 shrink-0 items-center gap-3 rounded-full border border-[#e2e8f0] bg-white p-1.5">
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

        {/* Content */}
        <main className="flex flex-1 flex-col px-6 pb-6">
          {/* Outer card */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-[36px] border border-[#e2e8f0] bg-white p-4">
            {/* KPI row */}
            <div className="flex shrink-0 flex-wrap gap-4">
              {KPIS.map(({ label, value, icon: Icon, valueColor }) => (
                <div
                  key={label}
                  className="flex h-20 min-w-[240px] flex-1 items-stretch overflow-hidden rounded-2xl border border-[#e2e8f0]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 border-r border-[#e2e8f0] px-4">
                    <Icon className="size-6 shrink-0 text-[#334155]" strokeWidth={1.75} />
                    <span className="truncate text-base font-semibold text-[#0f172a]">
                      {label}
                    </span>
                  </div>
                  <div className="flex w-28 shrink-0 items-center justify-center px-4">
                    <span className={`text-[28px] font-bold leading-none ${valueColor}`}>
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
                <div className="relative h-11 w-full max-w-[320px] shrink-0">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-[#737373]">
                    <Search className="size-4" strokeWidth={1.5} />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="h-11 w-full rounded-[24px] border border-[#e2e8f0] bg-white py-1 pl-9 pr-8 text-sm text-[#0f172a] outline-none placeholder:text-[#64748b]"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-[#64748b] hover:opacity-70"
                    >
                      <X className="size-4" strokeWidth={1.333} />
                    </button>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-[#f1f5f9] px-4 py-2 text-sm font-medium text-[#64748b]">
                  Showing {filteredRows.length} of {SLA_ROWS.length} entries
                </span>
              </div>

              {/* Table */}
              <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#e2e8f0] shadow-[0px_1px_1.75px_-1px_rgba(0,0,0,0.1),0px_1px_2.625px_0px_rgba(0,0,0,0.1)]">
                <div className="min-w-[900px] 2xl:min-w-[1400px]">
                  {/* Header */}
                  <div className="flex h-12 border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {TABLE_COLUMNS.map((col, idx) => (
                      <div
                        key={col.key}
                        className={`flex h-full items-center gap-2.5 px-4 ${col.width} ${col.align} ${
                          idx !== TABLE_COLUMNS.length - 1 ? "border-r border-[#e2e8f0]" : ""
                        }`}
                      >
                        <span className={`whitespace-nowrap text-xs font-semibold ${col.headerColor}`}>
                          {col.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Grouped rows */}
                  {groupedRows.map((group) => (
                    <div
                      key={`${group.segmen}-${group.rows[0].indicator}`}
                      className="flex border-b border-[#e2e8f0] last:border-b-0"
                    >
                      <div className="flex w-[140px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-4 py-2 text-center 2xl:w-[200px]">
                        <span className="text-sm font-medium text-[#020617]">
                          {group.segmen}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        {group.rows.map((row, idx) => (
                          <div
                            key={row.indicator}
                            className={`flex min-h-[48px] items-stretch ${
                              idx !== group.rows.length - 1 ? "border-b border-[#e2e8f0]" : ""
                            }`}
                          >
                            <div className="flex h-full w-[300px] shrink-0 items-center border-r border-[#e2e8f0] px-4 py-2 2xl:w-[360px]">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.indicator}
                              </span>
                            </div>
                            <div className="flex h-full w-[120px] shrink-0 items-center border-r border-[#e2e8f0] px-4 2xl:w-[160px]">
                              <span
                                title={row.layanan}
                                className="truncate text-sm font-medium text-[#020617]"
                              >
                                {row.layanan}
                              </span>
                            </div>
                            <div className="flex h-full w-[90px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3 2xl:w-[120px]">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.satuan}
                              </span>
                            </div>
                            <div className="flex h-full w-[150px] shrink-0 items-center border-r border-[#e2e8f0] px-4 2xl:w-[200px]">
                              <span
                                title={row.source}
                                className="truncate text-sm font-medium text-[#020617]"
                              >
                                {row.source}
                              </span>
                            </div>
                            <div className="flex h-full w-[100px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3 2xl:w-[160px]">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.target}
                              </span>
                            </div>
                            <div className="flex h-full flex-1 items-center justify-center border-r border-[#e2e8f0] px-3">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.realisasi}
                              </span>
                            </div>
                            <div className="flex h-full flex-1 items-center justify-center px-3">
                              <span
                                className={`text-sm font-bold ${
                                  row.achieved ? "text-[#21a647]" : "text-[#c23837]"
                                }`}
                              >
                                {row.capaian}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

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
