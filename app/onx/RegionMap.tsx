"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type RegionStatus = "win" | "lose";

export type Region = {
  id: string;
  name: string;
  status: RegionStatus;
  /** [longitude, latitude] */
  coordinates: [number, number];
  valueLabel: string;
  valuePercent: string;
  nearestCompetitor: string;
  winner: string;
  gapToWinner: string;
  highlight: string;
};

/**
 * Sample regional data for the win/lose competitive map. "SUMBAGUT" mirrors
 * the exact figures shown in the Figma design; the remaining regions are
 * representative placeholders (using Telkom's usual SUMBAGUT/SUMBAGSEL/
 * JABAR/JATENG/JATIM/BALINUSRA/KALIMANTAN/SULAWESI/PUMA regional grouping)
 * so the map has something to render — swap these for real figures whenever
 * they're available.
 */
export const SAMPLE_REGIONS: Region[] = [
  {
    id: "sumbagut",
    name: "SUMBAGUT",
    status: "win",
    coordinates: [98.6722, 3.5952],
    valueLabel: "Value Indihome",
    valuePercent: "37 ms",
    nearestCompetitor: "Indosat",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Improve",
  },
  {
    id: "sumbagsel",
    name: "SUMBAGSEL",
    status: "lose",
    coordinates: [104.7458, -2.9909],
    valueLabel: "Value Indihome",
    valuePercent: "91.40%",
    nearestCompetitor: "IndosatHifi",
    winner: "IndosatHifi",
    gapToWinner: "+3ms",
    highlight: "Need Improve",
  },
  {
    id: "jabodetabek",
    name: "JABODETABEK",
    status: "win",
    coordinates: [106.8456, -6.2088],
    valueLabel: "Value Indihome",
    valuePercent: "97.10%",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-2ms",
    highlight: "Good",
  },
  {
    id: "jabar",
    name: "JABAR",
    status: "win",
    coordinates: [107.6191, -6.9175],
    valueLabel: "Value Indihome",
    valuePercent: "96.55%",
    nearestCompetitor: "XLSMART",
    winner: "Indihome",
    gapToWinner: "-1ms",
    highlight: "Good",
  },
  {
    id: "jateng",
    name: "JATENG & DIY",
    status: "win",
    coordinates: [110.4203, -7.1006],
    valueLabel: "Value Indihome",
    valuePercent: "97.85%",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-1ms",
    highlight: "Good",
  },
  {
    id: "jatim",
    name: "JATIM",
    status: "win",
    coordinates: [112.7521, -7.2575],
    valueLabel: "Value Indihome",
    valuePercent: "96.90%",
    nearestCompetitor: "IndosatHifi",
    winner: "Indihome",
    gapToWinner: "-2ms",
    highlight: "Good",
  },
  {
    id: "balinusra",
    name: "BALI NUSRA",
    status: "win",
    coordinates: [115.1889, -8.4095],
    valueLabel: "Value Indihome",
    valuePercent: "95.30%",
    nearestCompetitor: "XLHome",
    winner: "Indihome",
    gapToWinner: "-1ms",
    highlight: "Good",
  },
  {
    id: "kalimantan",
    name: "KALIMANTAN",
    status: "win",
    coordinates: [114.5921, -1.6815],
    valueLabel: "Value Indihome",
    valuePercent: "96.10%",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-1ms",
    highlight: "Good",
  },
  {
    id: "sulawesi",
    name: "SULAWESI",
    status: "win",
    coordinates: [119.4327, -4.5586],
    valueLabel: "Value Indihome",
    valuePercent: "95.75%",
    nearestCompetitor: "XLSMART",
    winner: "Indihome",
    gapToWinner: "-2ms",
    highlight: "Good",
  },
  {
    id: "puma",
    name: "PUMA",
    status: "win",
    coordinates: [138.0804, -3.3667],
    valueLabel: "Value Indihome",
    valuePercent: "94.65%",
    nearestCompetitor: "IndosatHifi",
    winner: "Indihome",
    gapToWinner: "-1ms",
    highlight: "Good",
  },
];

const STATUS_COLOR: Record<RegionStatus, string> = {
  win: "#22c55e",
  lose: "#ef4444",
};

/** Builds the hover-card DOM content for a region, handed to a mapboxgl.Popup. */
function buildPopupContent(region: Region): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className =
    "flex flex-col gap-2.5 rounded-xl bg-white/[0.66] p-3 backdrop-blur-[8.75px]";

  const header = document.createElement("div");
  header.className = "flex items-center gap-2.5";

  const name = document.createElement("p");
  name.className = "whitespace-nowrap text-sm font-semibold leading-5 text-[#050505]";
  name.textContent = region.name;

  const badge = document.createElement("span");
  badge.className =
    "shrink-0 whitespace-nowrap rounded-[80px] px-2.5 py-0.5 text-[12px] font-medium text-white";
  badge.style.backgroundColor = STATUS_COLOR[region.status];
  badge.textContent = region.status === "win" ? "Win" : "Lose";

  header.append(name, badge);

  const details = document.createElement("div");
  details.className = "flex w-[208px] flex-col gap-0.5";

  const rows: [string, string][] = [
    [region.valueLabel, region.valuePercent],
    ["Nearest Competitor", region.nearestCompetitor],
    ["Winner", region.winner],
    ["Gap to Winner", region.gapToWinner],
    ["Highlight", region.highlight],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "flex w-full items-center gap-2";

    const labelEl = document.createElement("p");
    labelEl.className = "w-[120px] shrink-0 text-xs leading-[18px] text-[#636363]";
    labelEl.textContent = label;

    const valueEl = document.createElement("p");
    valueEl.className = "w-20 shrink-0 text-xs leading-[18px] text-[#050505]";
    valueEl.textContent = value;

    row.append(labelEl, valueEl);
    details.appendChild(row);
  });

  wrapper.append(header, details);
  return wrapper;
}

type RegionMapProps = {
  regions?: Region[];
};

export default function RegionMap({ regions = SAMPLE_REGIONS }: RegionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const styleUrl =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ?? "mapbox://styles/obby19/cmiptwz19000c01s6a18ug4td";

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [117.5, -2.2],
      zoom: 3.9,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.scrollZoom.disable();

    map.on("load", () => setMapReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, styleUrl]);

  // Mapbox GL doesn't observe its own container, so when the layout around
  // it changes size (e.g. collapsing a panel above it, which animates over
  // time), the map canvas would otherwise stay locked to its old size.
  // Watch the container and keep the canvas in sync on every resize frame.
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Markers + hover card. The card is a native mapboxgl.Popup (not a React
  // node) so it stays correctly anchored to the marker's map coordinates
  // through panning and zooming, and shows on hover instead of click.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // No fixed `anchor` here on purpose: letting Mapbox auto-pick the anchor
    // keeps the card fully inside the map's own bounds (it flips to
    // top/left/right as needed) instead of always opening above the point,
    // which clipped the card whenever a marker sat near the map's edge.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 16,
      className: "region-popup",
    });

    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const cancelHide = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    };

    const scheduleHide = () => {
      cancelHide();
      hideTimeout = setTimeout(() => {
        popup.remove();
      }, 120);
    };

    const showRegion = (region: Region) => {
      cancelHide();
      popup.setLngLat(region.coordinates).setDOMContent(buildPopupContent(region));
      popup.addTo(map);

      const popupEl = popup.getElement();
      popupEl?.addEventListener("mouseenter", cancelHide);
      popupEl?.addEventListener("mouseleave", scheduleHide);
    };

    const markers: mapboxgl.Marker[] = [];

    regions.forEach((region) => {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", region.name);
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "9999px";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.25)";
      el.style.background = STATUS_COLOR[region.status];
      el.style.cursor = "pointer";

      el.addEventListener("mouseenter", () => showRegion(region));
      el.addEventListener("mouseleave", scheduleHide);
      el.addEventListener("focus", () => showRegion(region));
      el.addEventListener("blur", scheduleHide);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(region.coordinates)
        .addTo(map);
      markers.push(marker);
    });

    // No card on initial load — it only opens once the user actually hovers
    // (or focuses) a marker.
    return () => {
      cancelHide();
      popup.remove();
      markers.forEach((marker) => marker.remove());
    };
  }, [regions, mapReady]);

  if (!token) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] bg-[#f5f3f2] px-6 text-center">
        <p className="text-sm font-medium text-[#050505]">
          Peta belum aktif
        </p>
        <p className="max-w-[420px] text-xs text-[#636363]">
          Tambahkan <code className="rounded bg-black/[0.06] px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
          (dan opsional <code className="rounded bg-black/[0.06] px-1 py-0.5">NEXT_PUBLIC_MAPBOX_STYLE</code>)
          di file <code className="rounded bg-black/[0.06] px-1 py-0.5">.env.local</code> dengan access
          token Mapbox kamu untuk menampilkan peta ini.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px]">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Legend */}
      <div className="absolute right-4 top-4 flex items-center gap-4 rounded-[24px] border border-[#0505050a] bg-white px-4 py-2">
        <span className="flex items-center gap-1">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: "#22c55e33", outline: "1px solid #22c55e", outlineOffset: "-0.5px" }}
          />
          <span className="text-xs text-[#050505]">Win</span>
        </span>
        <span className="flex items-center gap-1">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: "#c2383733", outline: "1px solid #c23837", outlineOffset: "-0.5px" }}
          />
          <span className="text-xs text-[#050505]">Lose</span>
        </span>
      </div>
    </div>
  );
}
