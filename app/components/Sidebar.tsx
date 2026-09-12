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

/** Same hierarchy/org-chart glyph as the landing page's OLO shortcut icon. */
function OloIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 21.5 21.5" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 15.75C20 15.611929 19.888071 15.5 19.75 15.5L15.75 15.5C15.611929 15.5 15.5 15.611929 15.5 15.75L15.5 19.75C15.5 19.888071 15.611929 20 15.75 20L19.75 20C19.888071 20 20 19.888071 20 19.75L20 15.75ZM21.5 19.75C21.5 20.716499 20.716499 21.5 19.75 21.5L15.75 21.5C14.783502 21.5 14 20.716499 14 19.75L14 15.75C14 14.783502 14.783502 14 15.75 14L19.75 14C20.716499 14 21.5 14.783502 21.5 15.75L21.5 19.75ZM6 15.75C6 15.611929 5.8880711 15.5 5.75 15.5L1.75 15.5C1.6119287 15.5 1.5 15.611929 1.5 15.75L1.5 19.75C1.5 19.888071 1.6119287 20 1.75 20L5.75 20C5.8880711 20 6 19.888071 6 19.75L6 15.75ZM7.5 19.75C7.5 20.716499 6.7164984 21.5 5.75 21.5L1.75 21.5C0.78350168 21.5 0 20.716499 0 19.75L0 15.75C0 14.783502 0.78350168 14 1.75 14L5.75 14C6.7164984 14 7.5 14.783502 7.5 15.75L7.5 19.75ZM13 1.75C13 1.6119287 12.888071 1.5 12.75 1.5L8.75 1.5C8.6119289 1.5 8.5 1.6119287 8.5 1.75L8.5 5.75C8.5 5.8880711 8.6119289 6 8.75 6L12.75 6C12.888071 6 13 5.8880711 13 5.75L13 1.75ZM14.5 5.75C14.5 6.7164984 13.716498 7.5 12.75 7.5L8.75 7.5C7.7835016 7.5 7 6.7164984 7 5.75L7 1.75C7 0.78350168 7.7835016 0 8.75 0L12.75 0C13.716498 0 14.5 0.78350168 14.5 1.75L14.5 5.75ZM17 14.75L17 11.75C17 11.683695 16.97364 11.620125 16.926758 11.573242C16.879873 11.526359 16.816303 11.5 16.75 11.5L4.75 11.5C4.6836963 11.5 4.6201267 11.526358 4.5732422 11.573242C4.5263577 11.620127 4.5 11.683697 4.5 11.75L4.5 14.75C4.5 15.164213 4.1642137 15.5 3.75 15.5C3.3357863 15.5 3 15.164213 3 14.75L3 11.75C3 11.285871 3.1845071 10.840883 3.5126953 10.512695C3.8408837 10.184507 4.2858706 10 4.75 10L16.75 10C17.214128 10 17.659115 10.184506 17.987305 10.512695C18.315495 10.840885 18.5 11.285872 18.5 11.75L18.5 14.75C18.5 15.164213 18.164213 15.5 17.75 15.5C17.335787 15.5 17 15.164213 17 14.75ZM10 10.75L10 6.75C10 6.3357863 10.335787 6 10.75 6C11.164213 6 11.5 6.3357863 11.5 6.75L11.5 10.75C11.5 11.164213 11.164213 11.5 10.75 11.5C10.335787 11.5 10 11.164213 10 10.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

type SidebarIconComponent = (props: { className?: string; strokeWidth?: number }) => React.JSX.Element;

type SidebarMenuItem = {
  key: string;
  label: string;
  icon: LucideIcon | SidebarIconComponent;
  href: string;
};

const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { key: "fbb", label: "SLA WISA FBB", icon: TrendingUpDown, href: "/fbb" },
  { key: "onx", label: "ONX Dashboard", icon: Router, href: "/onx" },
  { key: "ookla", label: "Ookla Dashboard", icon: Radio, href: "/ookla" },
  { key: "olo", label: "History SLA", icon: OloIcon, href: "/olo" },
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
