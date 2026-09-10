import Link from "next/link";
import {
  Bell,
  CalendarDays,
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarLink = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

const SIDEBAR_LINKS: SidebarLink[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/" },
  { label: "Toggle panel", icon: PanelLeft, href: "#" },
  { label: "SLA Performance", icon: TrendingUpDown, href: "/fbb", active: true },
  { label: "Router", icon: Router, href: "#" },
  { label: "Radio", icon: Radio, href: "#" },
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
  { key: "segmen", label: "Segmen", width: "w-[160px]" },
  { key: "indicator", label: "Performance Indicator", width: "w-[320px]" },
  { key: "layanan", label: "Layanan", width: "w-[120px]" },
  { key: "satuan", label: "Satuan", width: "w-[80px]" },
  { key: "source", label: "Source Data", width: "w-[200px]" },
  { key: "target", label: "Target", width: "w-[80px]" },
  { key: "realisasi", label: "Realisasi W4 Aug‘26", width: "flex-1" },
  { key: "capaian", label: "Capaian W4 Aug‘26", width: "flex-1" },
] as const;

export default function FbbDashboard() {
  return (
    <div className="flex min-h-screen bg-[#f9f8f7]">
      {/* Sidebar */}
      <aside className="flex w-[60px] shrink-0 flex-col items-center gap-4 border-r-[0.5px] border-black/[0.08] bg-[#f5f3f2] py-4">
        {SIDEBAR_LINKS.map(({ label, icon: Icon, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={`flex size-9 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-black/[0.04] text-[#050505]"
                : "bg-[#f9f8f7] text-[#636363] hover:bg-black/[0.04]"
            }`}
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </Link>
        ))}
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

          {/* Filters + actions */}
          <div className="flex items-center gap-3">
            <div className="flex w-[220px] items-center gap-2 rounded-full border border-[#e6e5e3] bg-white px-3 py-2">
              <Search className="size-4 shrink-0 text-[#636363]" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-[#636363] outline-none placeholder:text-[#636363]"
              />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#e6e5e3] bg-white px-3 py-2 text-sm text-[#636363]">
              <CalendarDays className="size-4" strokeWidth={1.75} />
              Week 32
              <ChevronDown className="size-4" strokeWidth={1.75} />
            </div>
            <div className="flex-1" />
            <button className="flex items-center gap-2 rounded-full bg-[#3b82f6] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <Download className="size-4" strokeWidth={1.75} />
              Export file
            </button>
          </div>

          {/* Data table */}
          <div className="flex-1 overflow-auto rounded-2xl border border-[#e6e5e3] bg-white">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={`whitespace-nowrap px-4 py-3 text-sm font-normal text-[#636363] ${col.width}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLA_ROWS.map((row) => (
                  <tr
                    key={row.indicator}
                    className="border-b border-[#e2e8f0] last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#050505]">
                      {row.segmen}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#050505]">
                      {row.indicator}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#050505]">
                      {row.layanan}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#050505]">
                      {row.satuan}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#050505]">
                      {row.source}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#050505]">
                      {row.target}
                    </td>
                    <td className="whitespace-nowrap p-3 text-sm text-[#050505]">
                      {row.realisasi}
                    </td>
                    <td className="whitespace-nowrap p-3 text-sm">
                      <span
                        className={`font-bold underline ${
                          row.achieved ? "text-[#21a647]" : "text-[#c23837]"
                        }`}
                      >
                        {row.capaian}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
