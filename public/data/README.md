# telkom-regions.json

Telkom's actual regional boundary polygons (12 regions: SUMBAGUT, SUMBAGTENG,
SUMBAGSEL, INNER JABOTABEK, OUTER JABOTABEK, JABAR, JATENG-DIY, JATIM, BALI
NUSRA, KALIMANTAN, SULAWESI, MALUKU DAN PAPUA), supplied by the user as a
1.7MB GeoJSON FeatureCollection.

Processing applied before committing this copy:
- Simplified with `mapshaper -simplify 8% keep-shapes -clean` (down to
  ~128KB) so the map loads and pans smoothly — the original per-vertex
  detail (especially on OUTER/INNER JABOTABEK, which carried city-block
  level detail) was far more than a fill layer at country zoom needs.
- Properties trimmed to just `REGION` (original name) and `REGION_ID` (a
  slug added here) — the slug matches the Detail tab's DETAIL_REGIONS ids
  in app/onx/page.tsx and app/ookla/page.tsx one-to-one, and is what
  app/*/RegionMap.tsx's REGION_METRICS map is keyed by.

If Telkom provides an updated boundary file, re-run the same simplify step
and re-apply the REGION name → REGION_ID slug mapping before replacing this
file, or the map's fill-color join to REGION_METRICS will silently fall
back to the neutral gray color for any unmatched region.
