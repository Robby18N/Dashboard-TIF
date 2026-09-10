import {
  Bell,
  ChartNoAxesColumn,
  ChevronDown,
  Search,
  Settings,
  Sparkles,
  ArrowUp,
  Moon,
  Sun,
  Router,
  Building2,
  Network,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DashboardShortcut = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const DASHBOARD_SHORTCUTS: DashboardShortcut[] = [
  { label: "CNOP", icon: ChartNoAxesColumn, href: "#" },
  { label: "FBB", icon: Router, href: "/fbb" },
  { label: "EBIS", icon: Building2, href: "#" },
  { label: "OLO", icon: Network, href: "#" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f8f7]">
      {/* Top nav */}
      <header className="flex w-full items-start justify-between px-5 py-5">
        <div className="flex items-center gap-2 rounded-full border-[0.667px] border-black/8 bg-white px-2.5 py-2">
          <span className="flex size-5 items-center justify-center rounded-[10px] bg-[#050505]/8">
            <Sun className="size-4 text-[#050505]" strokeWidth={1.75} />
          </span>
          <span className="flex size-5 items-center justify-center p-0.5">
            <Moon className="size-4 text-[#050505]" strokeWidth={1.75} />
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 transition-colors hover:bg-black/[0.02]">
            <Sparkles className="size-4 text-[#8b8994]" strokeWidth={1.75} />
            <span className="text-sm font-medium text-[#8b8994]">
              First Insight
            </span>
          </button>

          <button
            aria-label="Settings"
            className="flex items-center justify-center rounded-full border border-black/8 bg-white p-2 transition-colors hover:bg-black/[0.02]"
          >
            <Settings className="size-4 text-[#050505]" strokeWidth={1.75} />
          </button>

          <button className="flex items-center gap-2 rounded-full border-[0.667px] border-black/8 bg-white px-2.5 py-2 transition-colors hover:bg-black/[0.02]">
            <Bell className="size-4 text-[#636363]" strokeWidth={1.75} />
            <span className="text-sm tracking-[-0.2px] text-[#636363]">
              Notifikasi
            </span>
          </button>

          <button className="flex items-center gap-2 rounded-full border border-black/8 bg-white py-2 pl-4 pr-2 transition-colors hover:bg-black/[0.02]">
            <User className="size-4 text-[#636363]" strokeWidth={1.75} />
            <span className="text-sm tracking-[-0.2px] text-[#636363]">
              Nationwide
            </span>
            <ChevronDown className="size-4 text-[#636363]" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Hero + content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10">
        <h1 className="text-center text-[32px] font-semibold tracking-[-0.48px] text-[#050505]">
          Welcome to Qosmo 👋
        </h1>

        <form className="flex w-full max-w-[720px] items-center gap-3 rounded-[80px] border border-[#e6e5e3] bg-white px-5 py-4">
          <Search className="size-5 shrink-0 text-[#636363]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search Insight dashboard.."
            className="flex-1 bg-transparent text-base text-[#636363] outline-none placeholder:text-[#636363]"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#050505] transition-opacity hover:opacity-90"
          >
            <ArrowUp className="size-5 text-white" strokeWidth={2} />
          </button>
        </form>

        <section className="flex flex-col items-center gap-5 rounded-2xl border-[0.667px] border-[rgba(15,13,10,0.08)] bg-[#f9f8f7] p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-qosmo.png"
              alt="Qosmo logo"
              width={80}
              height={80}
              className="size-10 shrink-0 object-contain"
            />
            <div className="flex flex-col items-start gap-1">
              <p className="text-sm font-bold text-[#050505]">
                Explore Dashboards
              </p>
              <p className="text-base text-[#636363]">
                Access CNOP, FBB, EBIS, and OLO dashboards from one
                streamlined workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {DASHBOARD_SHORTCUTS.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex w-[140px] items-center gap-3 rounded-full border border-[#e6e5e3] bg-white py-2 pl-2 pr-3 transition-colors hover:bg-black/[0.02]"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(10,18,31,0.08)]">
                  <Icon className="size-4 text-[#050505]" strokeWidth={1.75} />
                </span>
                <span className="text-lg font-semibold text-[#050505]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex w-full items-center justify-center border-t border-black/8 bg-[#f9f8f7] px-5 py-3">
        <p className="text-center text-xs text-[#636363]">
          © 2026 Qosmo · Quality Service Monitoring, you agree to our{" "}
          <a
            href="https://example.com/terms"
            target="_blank"
            rel="noreferrer"
            className="text-black underline decoration-solid underline-offset-2"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="https://example.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-black underline decoration-solid underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
