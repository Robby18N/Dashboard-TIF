"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Moon,
  Radio,
  Router,
  Sun,
  TrendingUpDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarMenuItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { key: "fbb", label: "SLA WISA FBB", icon: TrendingUpDown, href: "/fbb" },
  { key: "onx", label: "ONX Dashboard", icon: Router, href: "/onx" },
  { key: "ookla", label: "Ookla Dashboard", icon: Radio, href: "/ookla" },
];

type SidebarProps = {
  /** key of the menu item that should render as active/highlighted */
  activeKey: string;
};

export default function Sidebar({ activeKey }: SidebarProps) {
  // Visual-only theme switch to match the design; the app has no dark theme
  // wired up yet, so this doesn't change anything else on the page.
  const [isDark, setIsDark] = useState(false);
  // Show/hide the sidebar. The chevron button toggles this; when collapsed
  // only a slim rail with a re-open handle is shown.
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <aside className="flex w-[28px] shrink-0 flex-col items-center border-r border-[#e2e8f0] bg-white pt-4">
        <button
          type="button"
          aria-label="Show sidebar"
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-1 text-[#334155] transition-colors hover:bg-[#eef2f6]"
        >
          <ChevronRight className="size-3.5" strokeWidth={1.75} />
        </button>
      </aside>
    );
  }

  return (
    // The full-width decorative header bar now lives above this sidebar (as
    // a page-level sibling), so the sidebar itself just needs its own
    // rounded top-right corner marking where it begins, right under that bar.
    <aside className="flex w-[72px] shrink-0 flex-col items-center justify-between rounded-tr-[33px] border-r border-[#e2e8f0] bg-white pb-[48px]">
      <div className="flex w-full flex-col items-center">
        {/* Show/hide sidebar toggle */}
        <div className="flex w-full flex-col items-center gap-4 border-b border-[#e2e8f0] p-4">
          <button
            type="button"
            aria-label="Hide sidebar"
            onClick={() => setCollapsed(true)}
            className="flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2 text-[#334155] transition-colors hover:bg-[#eef2f6]"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex w-full flex-col gap-5 p-4">
          <div className="flex w-full flex-col items-center gap-1.5">
            <Link
              href="/"
              aria-label="Back to landing page"
              className="group relative flex size-10 items-center justify-center rounded-xl bg-white text-[#334155] transition-colors hover:bg-[#f8fafc]"
            >
              <LayoutDashboard className="size-5" strokeWidth={1.75} />
              <SidebarTooltip label="Back to landing page" />
            </Link>

            {SIDEBAR_MENU_ITEMS.map(({ key, label, icon: Icon, href }) => {
              const active = key === activeKey;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className={`group relative flex size-10 items-center justify-center rounded-xl transition-colors ${
                    active
                      ? "bg-[linear-gradient(180deg,#86b4ff_0%,#0661f7_100%)] text-white shadow-[0px_4px_10px_0px_rgba(11,87,208,0.35)]"
                      : "bg-white text-[#334155] hover:bg-[#f8fafc]"
                  }`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                  <SidebarTooltip label={label} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle light/dark theme"
        onClick={() => setIsDark((prev) => !prev)}
        className="relative flex h-8 w-14 shrink-0 items-center rounded-full border border-[#e2e8f0] bg-white p-1"
      >
        <span
          className={`flex size-6 items-center justify-center rounded-full transition-transform ${
            isDark ? "translate-x-6 bg-[#334155]" : "translate-x-0 bg-[#ffaa04]"
          }`}
        >
          {isDark ? (
            <Moon className="size-3.5 text-white" strokeWidth={2} />
          ) : (
            <Sun className="size-3.5 text-white" strokeWidth={2} />
          )}
        </span>
      </button>
    </aside>
  );
}

/** Small floating name tag shown on hover, anchored to the right of a sidebar icon. */
function SidebarTooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0f172a] px-2 py-1 text-xs font-medium text-white opacity-0 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] transition-opacity duration-150 group-hover:opacity-100"
    >
      {label}
    </span>
  );
}
