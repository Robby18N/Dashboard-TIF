"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Download,
  Gauge,
  LayoutGrid,
  Moon,
  MonitorDown,
  PanelLeft,
  Radio,
  Router,
  Rocket,
  Search,
  TrendingDown,
  TrendingUpDown,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarLink = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

const SIDEBAR_MENU_ITEMS: SidebarLink[] = [
  { label: "SLA WISA FBB", icon: TrendingUpDown, href: "/fbb", active: true },
  { label: "ONX Dashboard", icon: Router, href: "#" },
  { label: "Ookla Dashboard", icon: Radio, href: "#" },
];

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const KPIS: Kpi[] = [
  { label: "Total Performance Indicator", value: "11", icon: Gauge },
  { label: "Indicators Achieved", value: "9", icon: Rocket },
  { label: "Indicators Not Achieved", value: "2", icon: MonitorDown },
  { label: "Lowest Achievement", value: "94%", icon: TrendingDown },
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
  { key: "segmen", label: "Segmen", width: "w-[150px]", align: "justify-start text-left" },
  { key: "indicator", label: "Performance Indicator", width: "w-[305px]", align: "justify-start text-left" },
  { key: "layanan", label: "Layanan", width: "w-[132px]", align: "justify-start text-left" },
  { key: "satuan", label: "Satuan", width: "w-[78px]", align: "justify-center text-center" },
  { key: "source", label: "Source Data", width: "w-[190px]", align: "justify-start text-left" },
  { key: "target", label: "Target", width: "w-[75px]", align: "justify-start text-left" },
  { key: "realisasi", label: "Realisasi W4 Aug‘26", width: "w-[171px]", align: "justify-start text-left" },
  { key: "capaian", label: "Capaian W4 Aug‘26", width: "w-[169px]", align: "justify-start text-left" },
] as const;

export default function FbbDashboard() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SLA_ROWS;
    return SLA_ROWS.filter((row) =>
      [row.segmen, row.indicator, row.layanan, row.source].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [search]);

  return (
    <div className="flex min-h-screen bg-[#f9f8f7]">
      {/* Sidebar */}
      <aside
        className={`flex shrink-0 flex-col gap-4 border-r-[0.5px] border-black/[0.08] bg-[#f5f3f2] py-4 transition-[width] duration-200 ${
          sidebarOpen ? "w-[220px] items-stretch px-3" : "w-[60px] items-center"
        }`}
      >
        <Link
          href="/"
          aria-label="Back to landing page"
          className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f9f8f7] text-[#636363] transition-colors hover:bg-black/[0.04] ${
            sidebarOpen ? "self-start" : "self-center"
          }`}
        >
          <LayoutGrid className="size-[18px]" strokeWidth={1.75} />
        </Link>

        <button
          type="button"
          aria-label={sidebarOpen ? "Hide sidebar menu" : "Show sidebar menu"}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((prev) => !prev)}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f9f8f7] text-[#636363] transition-colors hover:bg-black/[0.04] ${
            sidebarOpen ? "self-start" : "self-center"
          }`}
        >
          <PanelLeft className="size-[18px]" strokeWidth={1.75} />
        </button>

        <div className={`flex flex-col gap-4 ${sidebarOpen ? "" : "items-center"}`}>
          {SIDEBAR_MENU_ITEMS.map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={`flex items-center gap-3 transition-colors ${
                sidebarOpen
                  ? "rounded-lg px-3 py-2"
                  : "size-9 justify-center rounded-full"
              } ${
                active
                  ? "bg-black/[0.04] text-[#050505]"
                  : "bg-[#f9f8f7] text-[#636363] hover:bg-black/[0.04]"
              }`}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              {sidebarOpen && (
                <span className="truncate text-sm font-medium">{label}</span>
              )}
            </Link>
          ))}
        </div>
      </aside>

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
        <main className="flex flex-1 flex-col gap-5 p-6">
          {/* KPI row */}
          <div className="flex flex-wrap gap-3">
            {KPIS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex h-[46px] min-w-[220px] flex-1 items-center gap-2.5 rounded-2xl border border-[#e6e5e3] bg-white px-4"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f3f2]">
                  <Icon className="size-4 text-[#050505]" strokeWidth={1.75} />
                </span>
                <span className="flex-1 truncate text-sm font-semibold text-[#050505]">
                  {label}
                </span>
                <span className="shrink-0 rounded-full bg-black/[0.08] px-2 py-0.5 text-xs font-semibold text-[#636363]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Filters + table card */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Filters */}
            <div className="flex w-full shrink-0 flex-col gap-4 rounded-t-[24px] border border-[#0f0d0a14] bg-white p-4">
              <div className="flex w-full flex-wrap items-center justify-between gap-4">
                <div className="relative h-9 w-full max-w-[360px] shrink-0">
                  <span className="pointer-events-none absolute left-[14px] top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-[#050505]">
                    <Search className="size-4" strokeWidth={1.333} />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search.."
                    className="h-10 w-full rounded-[24px] border border-[#e6e5e3] bg-white py-1 pl-9 pr-8 text-sm text-[#636363] outline-none placeholder:text-[#636363]"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                      className="absolute right-[14px] top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-[#050505] hover:opacity-70"
                    >
                      <X className="size-4" strokeWidth={1.333} />
                    </button>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[24px] border border-[#0f0d0a14] bg-white px-2.5 py-1.5 text-sm font-medium text-[#636363] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-black/[0.02]">
                    Select Region
                    <ChevronDown className="size-4" strokeWidth={1} />
                  </button>
                  <button className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[24px] border border-[#0f0d0a14] bg-white px-2.5 py-1.5 text-sm font-medium text-[#636363] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-black/[0.02]">
                    Select Week
                    <ChevronDown className="size-4" strokeWidth={1} />
                  </button>
                  <button className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[24px] border border-[#0f0d0a14] bg-white px-3 py-1.5 text-sm font-medium text-[#636363] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-black/[0.02]">
                    <Download className="size-4" strokeWidth={1} />
                    Export file
                  </button>
                </div>
              </div>
            </div>

            {/* Entries count */}
            <div className="flex w-full shrink-0 items-center justify-between border-x border-b border-[#0f0d0a14] bg-white px-4 py-2">
              <span className="rounded-full bg-black/[0.04] px-4 py-1.5 text-sm text-[#636363]">
                Showing {filteredRows.length} of {SLA_ROWS.length} entries
              </span>
            </div>

            {/* Table */}
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto rounded-b-[24px] border-x border-b border-[#0f0d0a14] bg-white p-4">
              <div className="min-w-[1270px]">
                <div className="flex">
                  {TABLE_COLUMNS.map((col) => (
                    <div
                      key={col.key}
                      className={`flex h-[54px] shrink-0 items-center gap-2.5 bg-black/[0.04] px-3 ${col.width} ${col.align}`}
                    >
                      <span className="whitespace-nowrap text-sm font-semibold text-[#050505]">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>

                {filteredRows.map((row) => (
                  <div
                    key={row.indicator}
                    className="flex border-b border-[#0f0d0a14] last:border-b-0"
                  >
                    <div className="flex h-[50px] w-[150px] shrink-0 items-center justify-start px-3">
                      <span className="whitespace-nowrap rounded-[9px] bg-[#f5f3f2] px-2.5 py-1 text-[13px] font-medium text-[#050505]">
                        {row.segmen}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[305px] shrink-0 items-center px-3">
                      <span className="text-sm text-[#050505]">
                        {row.indicator}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[132px] shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.layanan}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[78px] shrink-0 items-center justify-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.satuan}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[190px] shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.source}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[75px] shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.target}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[171px] shrink-0 items-center px-3">
                      <span className="whitespace-nowrap text-sm text-[#050505]">
                        {row.realisasi}
                      </span>
                    </div>
                    <div className="flex h-[50px] w-[169px] shrink-0 items-center px-3">
                      <span
                        className={`whitespace-nowrap text-sm ${
                          row.achieved ? "text-[#050505]" : "text-[#c23837]"
                        }`}
                      >
                        {row.capaian}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredRows.length === 0 && (
                  <div className="flex h-[100px] items-center justify-center text-sm text-[#636363]">
                    Tidak ada data yang cocok dengan pencarian.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
