import {
  Bell,
  ChartNoAxesColumn,
  ChevronDown,
  Moon,
  Sun,
  Router,
  Building2,
  Network,
  User,
  Settings,
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
    <div className="relative flex min-h-screen flex-col bg-[#f9f8f7]">
      {/* Fixed top nav with fade-out gradient backdrop */}
      <div className="fixed inset-x-0 top-0 z-20 bg-[linear-gradient(180deg,_#f9f8f7_0%,_#f9f8f7_25%,_rgba(249,248,247,0.86)_35.7%,_rgba(249,248,247,0.71)_46.4%,_rgba(249,248,247,0.57)_57.1%,_rgba(249,248,247,0.43)_67.9%,_rgba(249,248,247,0.29)_78.6%,_rgba(249,248,247,0.14)_89.3%,_rgba(249,248,247,0)_100%)] px-5 py-5">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-2 rounded-full border-[0.667px] border-black/8 bg-white px-2.5 py-2">
            <span className="flex size-5 items-center justify-center rounded-[10px] bg-[#050505]/8">
              <Sun className="size-4 text-[#050505]" strokeWidth={1.75} />
            </span>
            <span className="flex size-5 items-center justify-center p-0.5">
              <Moon className="size-4 text-[#050505]" strokeWidth={1.75} />
            </span>
          </div>

          <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-5 pb-10 pt-32">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-qosmo.png"
              alt="Qosmo logo"
              width={80}
              height={80}
              className="size-10 shrink-0 object-contain"
            />
            <h1 className="text-[32px] font-bold leading-tight tracking-[-0.48px] text-[#050505]">
              Explore Dashboards
            </h1>
          </div>
          <p className="text-center text-sm text-[#636363]">
            Access CNOP, FBB, EBIS, and OLO dashboards from one streamlined
            workspace.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 rounded-2xl border-[0.667px] border-[rgba(15,13,10,0.08)] bg-[#f5f3f2] p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {DASHBOARD_SHORTCUTS.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex w-[120px] items-center gap-3 rounded-full border border-[#e6e5e3] bg-white p-3 transition-colors hover:bg-black/[0.02]"
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
        </div>
      </main>

      {/* Footer */}
      <footer className="flex w-full items-center justify-center border-t border-black/8 bg-[#f9f8f7] px-5 py-3">
        <p className="text-center text-xs text-[#636363]">
          © 2026 Qosmo · Quality Service Monitoring, you agree to our{" "}
          <a href="#" className="text-black underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-black underline">
            Privacy Policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
