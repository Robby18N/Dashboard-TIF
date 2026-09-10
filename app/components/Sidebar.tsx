"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, PanelLeft, Radio, Router, TrendingUpDown } from "lucide-react";
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
  { key: "ookla", label: "Ookla Dashboard", icon: Radio, href: "#" },
];

type SidebarProps = {
  /** key of the menu item that should render as active/highlighted */
  activeKey: string;
};

export default function Sidebar({ activeKey }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col gap-4 border-r-[0.5px] border-black/[0.08] bg-[#f5f3f2] py-4 transition-[width] duration-200 ${
        sidebarOpen ? "w-[220px] items-stretch px-3" : "w-[60px] items-center"
      }`}
    >
      <Link
        href="/"
        aria-label="Back to landing page"
        className={`group relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f9f8f7] text-[#636363] transition-colors hover:bg-black/[0.04] ${
          sidebarOpen ? "self-start" : "self-center"
        }`}
      >
        <LayoutGrid className="size-[18px]" strokeWidth={1.75} />
        <SidebarTooltip label="Back to landing page" />
      </Link>

      <button
        type="button"
        aria-label={sidebarOpen ? "Hide sidebar menu" : "Show sidebar menu"}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((prev) => !prev)}
        className={`group relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f9f8f7] text-[#636363] transition-colors hover:bg-black/[0.04] ${
          sidebarOpen ? "self-start" : "self-center"
        }`}
      >
        <PanelLeft className="size-[18px]" strokeWidth={1.75} />
        <SidebarTooltip label={sidebarOpen ? "Hide sidebar menu" : "Show sidebar menu"} />
      </button>

      <div className={`flex flex-col gap-4 ${sidebarOpen ? "" : "items-center"}`}>
        {SIDEBAR_MENU_ITEMS.map(({ key, label, icon: Icon, href }) => {
          const active = key === activeKey;
          return (
            <Link
              key={key}
              href={href}
              aria-label={label}
              className={`group relative flex items-center gap-3 transition-colors ${
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
              {/* Labels are already visible when the sidebar is expanded, so
                  the tooltip only needs to appear in the collapsed, icon-only
                  state. */}
              {!sidebarOpen && <SidebarTooltip label={label} />}
            </Link>
          );
        })}
      </div>
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
