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
    valuePercent: "98.20%",
    nearestCompetitor: "XLSMART",
  },
  {
    id: "sumbagsel",
    name: "SUMBAGSEL",
    status: "lose",
    coordinates: [104.7458, -2.9909],
    valueLabel: "Value Indihome",
    valuePercent: "91.40%",
    nearestCompetitor: "IndosatHifi",
  },
  {
    id: "jabodetabek",
    name: "JABODETABEK",
    status: "win",
    coordinates: [106.8456, -6.2088],
    valueLabel: "Value Indihome",
    valuePercent: "97.10%",
    nearestCompetitor: "Biznet",
  },
  {
    id: "jabar",
    name: "JABAR",
    status: "win",
    coordinates: [107.6191, -6.9175],
    valueLabel: "Value Indihome",
    valuePercent: "96.55%",
    nearestCompetitor: "XLSMART",
  },
  {
    id: "jateng",
    name: "JATENG & DIY",
    status: "win",
    coordinates: [110.4203, -7.1006],
    valueLabel: "Value Indihome",
    valuePercent: "97.85%",
    nearestCompetitor: "Biznet",
  },
  {
    id: "jatim",
    name: "JATIM",
    status: "win",
    coordinates: [112.7521, -7.2575],
    valueLabel: "Value Indihome",
    valuePercent: "96.90%",
    nearestCompetitor: "IndosatHifi",
  },
  {
    id: "balinusra",
    name: "BALI NUSRA",
    status: "win",
    coordinates: [115.1889, -8.4095],
    valueLabel: "Value Indihome",
    valuePercent: "95.30%",
    nearestCompetitor: "XLHome",
  },
  {
    id: "kalimantan",
    name: "KALIMANTAN",
    status: "win",
    coordinates: [114.5921, -1.6815],
    valueLabel: "Value Indihome",
    valuePercent: "96.10%",
    nearestCompetitor: "Biznet",
  },
  {
    id: "sulawesi",
    name: "SULAWESI",
    status: "win",
    coordinates: [119.4327, -4.5586],
    valueLabel: "Value Indihome",
    valuePercent: "95.75%",
    nearestCompetitor: "XLSMART",
  },
  {
    id: "puma",
    name: "PUMA",
    status: "win",
    coordinates: [138.0804, -3.3667],
    valueLabel: "Value Indihome",
    valuePercent: "94.65%",
    nearestCompetitor: "IndosatHifi",
  },
];

const STATUS_COLOR: Record<RegionStatus, string> = {
  win: "#22c55e",
  lose: "#ef4444",
};

type RegionMapProps = {
  regions?: Region[];
  /** region id selected/highlighted by default, mirroring the Figma callout */
  initialSelectedId?: string;
};

export default function RegionMap({
  regions = SAMPLE_REGIONS,
  initialSelectedId = "sumbagut",
}: RegionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId
  );
  const [mapReady, setMapReady] = useState(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const styleUrl =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ?? "mapbox://styles/mapbox/light-v11";

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

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
      el.addEventListener("click", () => setSelectedId(region.id));

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(region.coordinates)
        .addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [regions, mapReady]);

  const selectedRegion = regions.find((region) => region.id === selectedId);

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

      {/* Region detail card, styled after the Figma callout */}
      {selectedRegion && (
        <div className="absolute left-[17px] top-[23px] flex w-[272px] flex-col items-center">
          <div className="mb-[-3px] flex w-full flex-col gap-2.5 rounded-xl bg-white/[0.66] p-3 backdrop-blur-[10px]">
            <div className="flex items-center gap-2.5">
              <p className="whitespace-nowrap text-sm font-semibold text-[#050505]">
                {selectedRegion.name}
              </p>
              <span
                className={`shrink-0 rounded-[9px] px-2.5 py-1 text-[13px] font-medium ${
                  selectedRegion.status === "win"
                    ? "bg-[#f0fdf4] text-[#22c55e]"
                    : "bg-[#fef2f2] text-[#ef4444]"
                }`}
              >
                {selectedRegion.status === "win" ? "Win" : "Lose"}
              </span>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setSelectedId(null)}
                className="ml-auto text-[#636363] hover:text-[#050505]"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <p className="w-[120px] shrink-0 text-[#636363]">
                  {selectedRegion.valueLabel}
                </p>
                <p className="text-[#050505]">{selectedRegion.valuePercent}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="w-[120px] shrink-0 text-[#636363]">
                  Nearest Competitor
                </p>
                <p className="text-[#050505]">
                  {selectedRegion.nearestCompetitor}
                </p>
              </div>
            </div>
          </div>
          <div
            className="h-0 w-0"
            style={{
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderTop: "8px solid rgba(255,255,255,0.66)",
            }}
          />
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-[24px] border border-[#f1f5f9] bg-white px-4 py-2 shadow-sm">
        <span className="flex items-center gap-1">
          <span className="size-3 rounded-full bg-[#22c55e]" />
          <span className="text-xs text-[#0f172a]">Win</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="size-3 rounded-full bg-[#ef4444]" />
          <span className="text-xs text-[#0f172a]">Lose</span>
        </span>
      </div>
    </div>
  );
}
