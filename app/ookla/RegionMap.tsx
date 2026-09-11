"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type RegionStatus = "win" | "lose";

export type RegionMetrics = {
  name: string;
  status: RegionStatus;
  valueLabel: string;
  valuePercent: string;
  /** e.g. "20 from 25" — how many comparison points this region won out of the total. */
  winRecord: string;
  nearestCompetitor: string;
  winner: string;
  gapToWinner: string;
  highlight: string;
};

/**
 * Region metrics keyed by the "REGION_ID" property carried on every polygon
 * feature in /public/data/telkom-regions.json — Telkom's actual regional
 * boundary data (12 regions), supplied directly by the user and simplified
 * for the web (mapshaper, ~8% of the original vertex count).
 *
 * These ids mirror the Detail tab's DETAIL_REGIONS ids one-to-one, and the
 * figures below mirror those exact rows, so the map and the Detail table
 * never disagree — update both together whenever real figures land.
 */
export const REGION_METRICS: Record<string, RegionMetrics> = {
  sumbagut: {
    name: "SUMBAGUT",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "98.20%",
    winRecord: "22 from 25",
    nearestCompetitor: "Indosat",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Strong performance",
  },
  sumbagteng: {
    name: "SUMBAGTENG",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "95.60%",
    winRecord: "20 from 25",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Strong performance",
  },
  sumbagsel: {
    name: "SUMBAGSEL",
    status: "lose",
    valueLabel: "Value Indihome",
    valuePercent: "88.40%",
    winRecord: "10 from 25",
    nearestCompetitor: "IndosatHifi",
    winner: "IndosatHifi",
    gapToWinner: "+3.30%",
    highlight: "Priority focus",
  },
  "inner-jabo": {
    name: "INNER JABOTABEK",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "94.80%",
    winRecord: "19 from 25",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Stable",
  },
  "outer-jabo": {
    name: "OUTER JABOTABEK",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "93.75%",
    winRecord: "18 from 25",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Stable",
  },
  jabar: {
    name: "JABAR",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "96.55%",
    winRecord: "19 from 25",
    nearestCompetitor: "XLSMART",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Strong performance",
  },
  jateng: {
    name: "JATENG-DIY",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "97.85%",
    winRecord: "21 from 25",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Strong performance",
  },
  jatim: {
    name: "JATIM",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "96.90%",
    winRecord: "20 from 25",
    nearestCompetitor: "IndosatHifi",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Strong performance",
  },
  balinusra: {
    name: "BALI NUSRA",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "95.30%",
    winRecord: "18 from 25",
    nearestCompetitor: "XLHome",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Improving",
  },
  kalimantan: {
    name: "KALIMANTAN",
    status: "win",
    valueLabel: "Value Indihome",
    valuePercent: "96.10%",
    winRecord: "19 from 25",
    nearestCompetitor: "Biznet",
    winner: "Indihome",
    gapToWinner: "-",
    highlight: "Stable",
  },
  sulawesi: {
    name: "SULAWESI",
    status: "lose",
    valueLabel: "Value Indihome",
    valuePercent: "89.75%",
    winRecord: "12 from 25",
    nearestCompetitor: "XLSMART",
    winner: "XLSMART",
    gapToWinner: "+2.40%",
    highlight: "Needs attention",
  },
  "maluku-papua": {
    name: "MALUKU & PAPUA",
    status: "lose",
    valueLabel: "Value Indihome",
    valuePercent: "87.30%",
    winRecord: "9 from 25",
    nearestCompetitor: "IndosatHifi",
    winner: "IndosatHifi",
    gapToWinner: "+3.35%",
    highlight: "Priority focus",
  },
};

const STATUS_COLOR: Record<RegionStatus, string> = {
  win: "#22c55e",
  lose: "#ef4444",
};

const REGIONS_SOURCE_ID = "telkom-regions";
const REGIONS_FILL_LAYER_ID = "telkom-regions-fill";
const REGIONS_OUTLINE_LAYER_ID = "telkom-regions-outline";
/** Served from /public/data — see that file's header comment for provenance. */
const REGIONS_GEOJSON_URL = "/data/telkom-regions.json";

/** Builds the hover-card DOM content for a region, handed to a mapboxgl.Popup. */
function buildPopupContent(metrics: RegionMetrics): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className =
    "flex flex-col gap-2.5 rounded-xl bg-white/[0.66] p-3 backdrop-blur-[8.75px]";

  const header = document.createElement("div");
  header.className = "flex items-center gap-2.5";

  const name = document.createElement("p");
  name.className = "whitespace-nowrap text-sm font-semibold leading-5 text-[#050505]";
  name.textContent = metrics.name;

  const badge = document.createElement("span");
  badge.className =
    "shrink-0 whitespace-nowrap rounded-[80px] px-2.5 py-0.5 text-[12px] font-medium text-white";
  badge.style.backgroundColor = STATUS_COLOR[metrics.status];
  badge.textContent = metrics.status === "win" ? "Win" : "Lose";

  header.append(name, badge);

  const details = document.createElement("div");
  details.className = "flex w-[208px] flex-col gap-0.5";

  const rows: [string, string][] = [
    [metrics.valueLabel, metrics.valuePercent],
    ["Win", metrics.winRecord],
    ["Nearest Competitor", metrics.nearestCompetitor],
    ["Winner", metrics.winner],
    ["Gap to Winner", metrics.gapToWinner],
    ["Highlight", metrics.highlight],
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

export default function RegionMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const styleUrl =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE ?? "mapbox://styles/obby19/cmiptwz19000c01s6a18ug4td";

  // Map creation AND the choropleth layer/hover setup live in one effect so
  // teardown order is guaranteed: unregister handlers, remove the popup,
  // *then* call map.remove() — all in one synchronous cleanup function.
  // (Splitting this across separate effects previously crashed the tab on
  // switching away from Maps: React doesn't guarantee which sibling
  // effect's cleanup runs first, so the layer/source cleanup could run
  // *after* another effect had already called map.remove(), and touching a
  // removed mapboxgl.Map instance throws.)
  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [117.5, -2.2],
      zoom: 3.9,
      pitch: 0,
      bearing: 0,
      // The custom style is built on Mapbox Standard, which defaults to a
      // 3D globe projection — at this low a zoom that renders as an
      // abstract dark curve (the globe's horizon) rather than a usable
      // flat map. Force the classic flat projection instead.
      projection: "mercator",
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.scrollZoom.disable();
    mapRef.current = map;

    // Choropleth: one filled polygon per Telkom region (real boundary
    // data), colored by win/lose status, with a hover highlight + popup
    // driven by whichever polygon is actually under the cursor — replacing
    // the earlier fixed-point markers now that real region shapes are
    // available. Added once the style has finished loading.
    let popup: mapboxgl.Popup | null = null;
    let handleMouseMove: ((e: mapboxgl.MapLayerMouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;

    const setupChoropleth = () => {
      // Mapbox "match" expressions are a flat [key, value, key, value, ...,
      // fallback] array — build it from REGION_METRICS so the fill color
      // always tracks each region's status without hardcoding ids twice.
      const fillColorExpression: mapboxgl.Expression = [
        "match",
        ["get", "REGION_ID"],
        ...Object.entries(REGION_METRICS).flatMap(([id, metrics]) => [
          id,
          STATUS_COLOR[metrics.status],
        ]),
        "#cbd5e1", // fallback for any polygon without a matching region id
      ];

      map.addSource(REGIONS_SOURCE_ID, {
        type: "geojson",
        data: REGIONS_GEOJSON_URL,
        // Feature-state (used for the hover highlight below) is keyed by
        // numeric feature id; the source GeoJSON has none, so let Mapbox
        // assign one per feature.
        generateId: true,
      });

      map.addLayer({
        id: REGIONS_FILL_LAYER_ID,
        type: "fill",
        source: REGIONS_SOURCE_ID,
        paint: {
          "fill-color": fillColorExpression,
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.75, 0.5],
        },
      });

      map.addLayer({
        id: REGIONS_OUTLINE_LAYER_ID,
        type: "line",
        source: REGIONS_SOURCE_ID,
        paint: {
          "line-color": "#ffffff",
          "line-width": 1,
        },
      });

      popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: "region-popup",
      });

      let hoveredFeatureId: number | undefined;

      const clearHover = () => {
        if (hoveredFeatureId !== undefined) {
          map.setFeatureState({ source: REGIONS_SOURCE_ID, id: hoveredFeatureId }, { hover: false });
        }
        hoveredFeatureId = undefined;
      };

      handleMouseMove = (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        map.getCanvas().style.cursor = "pointer";

        if (feature.id !== hoveredFeatureId) {
          clearHover();
          if (typeof feature.id === "number") {
            hoveredFeatureId = feature.id;
            map.setFeatureState({ source: REGIONS_SOURCE_ID, id: hoveredFeatureId }, { hover: true });
          }
        }

        const regionId = feature.properties?.REGION_ID as string | undefined;
        const metrics = regionId ? REGION_METRICS[regionId] : undefined;
        if (!metrics) {
          popup?.remove();
          return;
        }

        popup?.setLngLat(e.lngLat).setDOMContent(buildPopupContent(metrics));
        popup?.addTo(map);
      };

      handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
        clearHover();
        popup?.remove();
      };

      map.on("mousemove", REGIONS_FILL_LAYER_ID, handleMouseMove);
      map.on("mouseleave", REGIONS_FILL_LAYER_ID, handleMouseLeave);
    };

    map.on("load", setupChoropleth);

    return () => {
      map.off("load", setupChoropleth);
      if (handleMouseMove) map.off("mousemove", REGIONS_FILL_LAYER_ID, handleMouseMove);
      if (handleMouseLeave) map.off("mouseleave", REGIONS_FILL_LAYER_ID, handleMouseLeave);
      popup?.remove();

      // map.remove() below tears down the whole style (sources, layers,
      // and all) in one go, so explicit layer/source removal isn't
      // strictly required — but the important part is that it happens
      // strictly *before* map.remove(), in this same cleanup function.
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
