"use client";

import { useState } from "react";
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
  X,
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

type Suggestion = {
  title: string;
  description: string;
};

const FBB_SUGGESTIONS: Suggestion[] = [
  {
    title: "SLA WISA FBB Agustus 2026",
    description:
      "Lihat pencapaian SLA WISA FBB periode terakhir, lengkap dengan indikator yang tercapai dan yang di bawah target.",
  },
  {
    title: "Performa FBB per Region",
    description:
      "Bandingkan capaian performance indicator FBB antar region untuk melihat area mana yang butuh perhatian.",
  },
  {
    title: "Segmen dengan SLA Terendah",
    description:
      "Cek segmen (Network, Enterprise, Fixed Broadband) dengan capaian SLA paling rendah pada periode berjalan.",
  },
  {
    title: "Pencapaian Target FBB Minggu Ini",
    description:
      "Ringkasan jumlah indikator yang tercapai vs tidak tercapai untuk minggu berjalan pada dashboard FBB.",
  },
];

export default function Home() {
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(
    null
  );

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
        </div>
      </div>

      {/* Hero + content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 pb-10 pt-32">
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

        <div className="flex w-full max-w-[720px] flex-wrap items-center justify-center gap-2">
          {FBB_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.title}
              type="button"
              onClick={() => setActiveSuggestion(suggestion)}
              className="rounded-full border border-[#e6e5e3] bg-white px-4 py-2 text-sm text-[#636363] transition-colors hover:bg-black/[0.02] hover:text-[#050505]"
            >
              {suggestion.title}
            </button>
          ))}
        </div>

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
              <p className="text-[12px] text-[#636363]">
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
                className="flex w-[120px] items-center gap-4 rounded-full border border-[#e6e5e3] bg-white py-1 pl-1 pr-3 transition-colors hover:bg-black/[0.02]"
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
          © 2026 Qosmo · Quality Service Monitoring, you agree to our Terms of
          Service and Privacy Policy.
        </p>
      </footer>

      {/* Suggestion popup */}
      {activeSuggestion && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-5"
          onClick={() => setActiveSuggestion(null)}
        >
          <div
            className="relative w-full max-w-[420px] rounded-2xl border border-[#e6e5e3] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setActiveSuggestion(null)}
              className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#636363] transition-colors hover:bg-black/[0.04]"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>

            <span className="flex size-10 items-center justify-center rounded-full bg-[rgba(10,18,31,0.08)]">
              <Router className="size-5 text-[#050505]" strokeWidth={1.75} />
            </span>

            <h2 className="mt-4 text-lg font-semibold text-[#050505]">
              {activeSuggestion.title}
            </h2>
            <p className="mt-2 text-sm text-[#636363]">
              {activeSuggestion.description}
            </p>

            <Link
              href="/fbb"
              className="mt-5 flex w-full items-center justify-center rounded-full bg-[#050505] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Buka Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
