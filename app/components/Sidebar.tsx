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

// `border-image` ignores `border-radius` entirely, so it can't be used for a
// rounded gradient border — it draws its corners square regardless of the
// element's radius, mismatching the rounded gradient fill underneath. The
// fix is the two-background-layer trick: the fill paints into the padding
// box while a second gradient paints the (transparent-bordered) border box
// behind it, and both correctly follow the shared `rounded-[14px]`.
const ACTIVE_ITEM_CLASSES =
  "border-[3px] border-transparent text-white shadow-[0px_4px_10px_0px_rgba(11,87,208,0.35)] [background-origin:border-box] [background-clip:padding-box,border-box] [background-image:linear-gradient(180deg,#86b4ff_0%,#0661f7_100%),linear-gradient(180deg,#cee1ff_0%,rgba(11,87,208,0)_46.777%,#cee1ff_100%)]";

type SidebarProps = {
  /** key of the menu item that should render as active/highlighted */
  activeKey: string;
};

export default function Sidebar({ activeKey }: SidebarProps) {
  // Visual-only theme switch to match the design; the app has no dark theme
  // wired up yet, so this doesn't change anything else on the page.
  const [isDark, setIsDark] = useState(false);
  // The chevron button toggles between the compact icon-only rail (60px,
  // labels shown as hover tooltips) and the open rail (208px, labels shown
  // inline next to each icon).
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <aside className="flex w-[208px] shrink-0 flex-col items-center justify-between overflow-hidden rounded-tr-[33px] border-r border-[#e2e8f0] bg-white pb-[48px] transition-[width] duration-300 ease-in-out">
        <div className="flex w-full flex-col items-center">
          {/* Collapse-sidebar toggle */}
          <div className="flex w-full items-center justify-end border-b border-[#e2e8f0] p-4">
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={() => setOpen(false)}
              className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#334155] transition-colors hover:bg-[#eef2f6]"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex w-full flex-col gap-5 p-4 animate-[sidebar-content-in_250ms_ease-out]">
            <div className="flex w-full flex-col items-start gap-4">
              <Link
                href="/"
                aria-label="Back to landing page"
                className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-white text-[#334155] transition-colors hover:bg-[#f8fafc]"
              >
                <LayoutDashboard className="size-4" strokeWidth={1.75} />
              </Link>

              {SIDEBAR_MENU_ITEMS.map(({ key, label, icon: Icon, href }) => {
                const active = key === activeKey;
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-label={label}
                    className={`flex w-full items-center gap-3 rounded-[14px] p-2 transition-colors ${
                      active
                        ? ACTIVE_ITEM_CLASSES
                        : "text-[#334155] hover:bg-[#f8fafc]"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    <span className="whitespace-nowrap text-sm font-medium">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
      </aside>
    );
  }

  return (
    // The full-width decorative header bar now lives above this sidebar (as
    // a page-level sibling), so the sidebar itself just needs its own
    // rounded top-right corner marking where it begins, right under that bar.
    <aside className="flex w-[60px] shrink-0 flex-col items-center justify-between rounded-tr-[33px] border-r border-[#e2e8f0] bg-white pb-[48px] transition-[width] duration-300 ease-in-out">
      <div className="flex w-full flex-col items-center">
        {/* Open-sidebar toggle */}
        <div className="flex w-full flex-col items-center gap-4 border-b border-[#e2e8f0] p-4">
          <button
            type="button"
            aria-label="Expand sidebar"
            onClick={() => setOpen(true)}
            className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#334155] transition-colors hover:bg-[#eef2f6]"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex w-full flex-col gap-5 p-4 animate-[sidebar-content-in_250ms_ease-out]">
          <div className="flex w-full flex-col items-center gap-4">
            <Link
              href="/"
              aria-label="Back to landing page"
              className="group relative flex size-6 shrink-0 items-center justify-center rounded-lg bg-white text-[#334155] transition-colors hover:bg-[#f8fafc]"
            >
              <LayoutDashboard className="size-4" strokeWidth={1.75} />
              <SidebarTooltip label="Back to landing page" />
            </Link>

            {SIDEBAR_MENU_ITEMS.map(({ key, label, icon: Icon, href }) => {
              const active = key === activeKey;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-label={label}
                  className={`group relative flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-[linear-gradient(180deg,#86b4ff_0%,#0661f7_100%)] text-white shadow-[0px_4px_10px_0px_rgba(11,87,208,0.35)]"
                      : "bg-white text-[#334155] hover:bg-[#f8fafc]"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  <SidebarTooltip label={label} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
    </aside>
  );
}

/** Light/dark visual-only switch shown at the bottom of the sidebar, in both widths. */
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle light/dark theme"
      onClick={onToggle}
      className="relative flex h-6 w-10 shrink-0 items-center rounded-full border border-[#e2e8f0] bg-white p-0.5"
    >
      <span
        className={`flex size-5 items-center justify-center rounded-full transition-transform ${
          isDark ? "translate-x-4 bg-[#334155]" : "translate-x-0 bg-[#ffaa04]"
        }`}
      >
        {isDark ? (
          <Moon className="size-3 text-white" strokeWidth={2} />
        ) : (
          <Sun className="size-3 text-white" strokeWidth={2} />
        )}
      </span>
    </button>
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
