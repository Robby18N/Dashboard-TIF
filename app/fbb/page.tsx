"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  Bell,
  ChevronDown,
  Download,
  Gauge,
  Moon,
  MonitorCheck,
  MonitorX,
  Search,
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

const TABLE_COLUMNS = [
  { key: "segmen", label: "Segmen", width: "w-[200px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "indicator", label: "Performance Indicator", width: "w-[360px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "layanan", label: "Layanan", width: "w-[160px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "satuan", label: "Satuan", width: "w-[120px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
  { key: "source", label: "Source Data", width: "w-[200px]", align: "justify-start text-left", headerColor: "text-[#334155]" },
  { key: "target", label: "Target", width: "w-[160px]", align: "justify-center text-center", headerColor: "text-[#334155]" },
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
        <header className="flex items-center justify-between border-b-[0.5px] border-black/[0.08] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#0f172b]">SLA WISA FBB</h1>
            <span className="rounded-full bg-black/[0.04] px-3 py-1 text-sm text-[#636363]">
              Pencapaian Terakhir Period W4{" "}
              <span className="text-[#050505]">(Agu 2026 - 27 Agu 2026)</span>
            </span>
          </div>

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
              <span className="text-sm font-medium text-[#314158]">
                username
              </span>
              <ChevronDown className="size-4 text-[#314158]" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col p-6">
          {/* Outer card */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-[36px] border border-[#e2e8f0] bg-white p-4">
            {/* KPI row */}
            <div className="flex shrink-0 flex-wrap gap-4">
              {KPIS.map(({ label, value, icon: Icon, valueColor }) => (
                <div
                  key={label}
                  className="flex h-20 min-w-[240px] flex-1 items-stretch overflow-hidden rounded-2xl border border-[#e2e8f0]"
                >
                  <div className="flex flex-1 items-center gap-3 border-r border-[#e2e8f0] px-4">
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

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <button className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-[24px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#eef2f6]">
                    Select Region
                    <ChevronDown className="size-4 text-[#64748b]" strokeWidth={1.5} />
                  </button>
                  <button className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-[24px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#eef2f6]">
                    Select Week
                    <ChevronDown className="size-4 text-[#64748b]" strokeWidth={1.5} />
                  </button>
                  <button className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-[100px] bg-[linear-gradient(90deg,#3b82f6_0%,#6810f4_100%)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    <Download className="size-4" strokeWidth={1.75} />
                    Export
                  </button>
                </div>
              </div>

              <div className="flex w-full shrink-0 items-center justify-end">
                <span className="rounded-full bg-[#f1f5f9] px-4 py-2 text-sm font-medium text-[#64748b]">
                  Showing {filteredRows.length} of {SLA_ROWS.length} entries
                </span>
              </div>

              {/* Table */}
              <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#e2e8f0] shadow-[0px_1px_1.75px_-1px_rgba(0,0,0,0.1),0px_1px_2.625px_0px_rgba(0,0,0,0.1)]">
                <div className="min-w-[1400px]">
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
                      <div className="flex w-[200px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-4 py-2 text-center">
                        <span className="text-sm font-medium text-[#020617]">
                          {group.segmen}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        {group.rows.map((row, idx) => (
                          <div
                            key={row.indicator}
                            className={`flex h-12 items-stretch ${
                              idx !== group.rows.length - 1 ? "border-b border-[#e2e8f0]" : ""
                            }`}
                          >
                            <div className="flex h-full w-[360px] shrink-0 items-center border-r border-[#e2e8f0] px-4">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.indicator}
                              </span>
                            </div>
                            <div className="flex h-full w-[160px] shrink-0 items-center border-r border-[#e2e8f0] px-4">
                              <span className="whitespace-nowrap text-sm font-medium text-[#020617]">
                                {row.layanan}
                              </span>
                            </div>
                            <div className="flex h-full w-[120px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3">
                              <span className="text-sm font-medium text-[#020617]">
                                {row.satuan}
                              </span>
                            </div>
                            <div className="flex h-full w-[200px] shrink-0 items-center border-r border-[#e2e8f0] px-4">
                              <span className="whitespace-nowrap text-sm font-medium text-[#020617]">
                                {row.source}
                              </span>
                            </div>
                            <div className="flex h-full w-[160px] shrink-0 items-center justify-center border-r border-[#e2e8f0] px-3">
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
