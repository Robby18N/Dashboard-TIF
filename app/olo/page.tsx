"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";

type OloCell = { v: string; r: boolean };
type OloRow = { no: string; kpi: string; threshold: string; cells: OloCell[] };

const OLO_TABLE_DATA: OloRow[] = [
  { no: "1", kpi: "PL RAN-TO-CORE >5% NATION WIDE", threshold: "5%", cells: [{ v: "78", r: false }, { v: "106", r: true }, { v: "106", r: true }, { v: "89", r: true }, { v: "78", r: false }, { v: "106", r: true }, { v: "106", r: true }, { v: "89", r: true }, { v: "67", r: false }, { v: "79", r: true }, { v: "81", r: true }, { v: "84", r: true }, { v: "64", r: false }, { v: "82", r: true }, { v: "85", r: true }, { v: "87", r: true }] },
  { no: "2", kpi: "PL RAN-TO-CORE 1-5% NATION WIDE", threshold: "1-5%", cells: [{ v: "249", r: false }, { v: "284", r: true }, { v: "284", r: true }, { v: "301", r: true }, { v: "249", r: false }, { v: "284", r: true }, { v: "284", r: true }, { v: "301", r: true }, { v: "221", r: false }, { v: "236", r: true }, { v: "238", r: true }, { v: "241", r: true }, { v: "218", r: false }, { v: "239", r: true }, { v: "242", r: true }, { v: "244", r: true }] },
  { no: "3", kpi: "LATENCY RAN TO CORE 01-SUMBAGUT", threshold: "5 | 10 | 20", cells: [{ v: "96.62%", r: false }, { v: "98.44%", r: false }, { v: "98.44%", r: false }, { v: "97.73%", r: false }, { v: "96.62%", r: false }, { v: "98.44%", r: false }, { v: "97.73%", r: false }, { v: "96.62%", r: false }, { v: "96.62%", r: false }, { v: "97.62%", r: false }, { v: "97.77%", r: false }, { v: "97.90%", r: false }, { v: "96.12%", r: false }, { v: "97.82%", r: false }, { v: "97.97%", r: false }, { v: "98.12%", r: false }] },
  { no: "4", kpi: "LATENCY RAN TO CORE 10-SUMBAGTENG", threshold: "5 | 10 | 20", cells: [{ v: "89.15%", r: false }, { v: "97.70%", r: false }, { v: "97.70%", r: false }, { v: "98.07%", r: false }, { v: "89.15%", r: false }, { v: "97.70%", r: false }, { v: "98.07%", r: false }, { v: "87.98%", r: false }, { v: "87.98%", r: false }, { v: "98.90%", r: false }, { v: "99.05%", r: false }, { v: "99.18%", r: false }, { v: "87.48%", r: false }, { v: "99.10%", r: false }, { v: "99.25%", r: false }, { v: "99.40%", r: false }] },
  { no: "5", kpi: "LATENCY RAN TO CORE 02-SUMBAGSEL", threshold: "5 | 10 | 20", cells: [{ v: "87.89%", r: false }, { v: "98.37%", r: false }, { v: "98.37%", r: false }, { v: "98.53%", r: false }, { v: "87.89%", r: false }, { v: "98.37%", r: false }, { v: "98.53%", r: false }, { v: "89.15%", r: false }, { v: "89.15%", r: false }, { v: "98.42%", r: false }, { v: "98.57%", r: false }, { v: "98.70%", r: false }, { v: "88.65%", r: false }, { v: "98.62%", r: false }, { v: "98.77%", r: false }, { v: "98.92%", r: false }] },
  { no: "6", kpi: "LATENCY RAN TO CORE 03-JABOTABEK INNER", threshold: "5 | 10 | 20", cells: [{ v: "98.64%", r: false }, { v: "99.58%", r: false }, { v: "99.58%", r: false }, { v: "99.66%", r: false }, { v: "98.64%", r: false }, { v: "99.58%", r: false }, { v: "99.66%", r: false }, { v: "98.64%", r: false }, { v: "98.64%", r: false }, { v: "99.70%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "98.64%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "7", kpi: "LATENCY RAN TO CORE 12-JABOTABEK OUTER", threshold: "5 | 10 | 20", cells: [{ v: "98.74%", r: false }, { v: "99.83%", r: false }, { v: "99.83%", r: false }, { v: "99.76%", r: false }, { v: "98.74%", r: false }, { v: "99.83%", r: false }, { v: "99.76%", r: false }, { v: "98.74%", r: false }, { v: "98.74%", r: false }, { v: "99.89%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "98.74%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "8", kpi: "LATENCY RAN TO CORE 04-JAWA BARAT", threshold: "5 | 10 | 20", cells: [{ v: "97.73%", r: false }, { v: "99.83%", r: false }, { v: "99.83%", r: false }, { v: "99.85%", r: false }, { v: "97.73%", r: false }, { v: "99.83%", r: false }, { v: "99.85%", r: false }, { v: "97.73%", r: false }, { v: "97.73%", r: false }, { v: "99.90%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "97.73%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "9", kpi: "LATENCY RAN TO CORE 05-JAWA TENGAH", threshold: "5 | 10 | 20", cells: [{ v: "99.07%", r: false }, { v: "99.90%", r: false }, { v: "99.90%", r: false }, { v: "99.93%", r: false }, { v: "99.07%", r: false }, { v: "99.90%", r: false }, { v: "99.93%", r: false }, { v: "99.07%", r: false }, { v: "99.07%", r: false }, { v: "99.90%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.07%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "10", kpi: "LATENCY RAN TO CORE 06-JAWA TIMUR", threshold: "5 | 10 | 20", cells: [{ v: "98.80%", r: false }, { v: "99.95%", r: false }, { v: "99.95%", r: false }, { v: "99.88%", r: false }, { v: "98.80%", r: false }, { v: "99.95%", r: false }, { v: "99.88%", r: false }, { v: "98.80%", r: false }, { v: "98.80%", r: false }, { v: "99.89%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "98.80%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "11", kpi: "LATENCY RAN TO CORE 07-BALINUSRA", threshold: "5 | 10 | 20", cells: [{ v: "83.39%", r: false }, { v: "98.91%", r: false }, { v: "98.91%", r: false }, { v: "99.17%", r: false }, { v: "83.39%", r: false }, { v: "98.91%", r: false }, { v: "99.17%", r: false }, { v: "83.39%", r: false }, { v: "83.39%", r: false }, { v: "99.21%", r: false }, { v: "99.36%", r: false }, { v: "99.49%", r: false }, { v: "82.89%", r: false }, { v: "99.41%", r: false }, { v: "99.56%", r: false }, { v: "99.71%", r: false }] },
  { no: "12", kpi: "LATENCY RAN TO CORE 08-KALIMANTAN", threshold: "5 | 10 | 20", cells: [{ v: "97.28%", r: false }, { v: "99.32%", r: false }, { v: "99.32%", r: false }, { v: "99.40%", r: false }, { v: "97.28%", r: false }, { v: "99.32%", r: false }, { v: "99.40%", r: false }, { v: "97.28%", r: false }, { v: "97.28%", r: false }, { v: "99.30%", r: false }, { v: "99.45%", r: false }, { v: "99.58%", r: false }, { v: "96.78%", r: false }, { v: "99.50%", r: false }, { v: "99.65%", r: false }, { v: "99.80%", r: false }] },
  { no: "13", kpi: "LATENCY RAN TO CORE 09-SULAWESI", threshold: "5 | 10 | 20", cells: [{ v: "89.11%", r: false }, { v: "96.96%", r: false }, { v: "96.96%", r: false }, { v: "98.13%", r: false }, { v: "89.11%", r: false }, { v: "96.96%", r: false }, { v: "98.13%", r: false }, { v: "89.11%", r: false }, { v: "89.11%", r: false }, { v: "98.92%", r: false }, { v: "99.07%", r: false }, { v: "99.20%", r: false }, { v: "88.61%", r: false }, { v: "99.12%", r: false }, { v: "99.27%", r: false }, { v: "99.42%", r: false }] },
  { no: "14", kpi: "LATENCY RAN TO CORE 11-PUMA", threshold: "5 | 10 | 20", cells: [{ v: "94.90%", r: false }, { v: "96.11%", r: false }, { v: "96.11%", r: false }, { v: "97.66%", r: false }, { v: "94.90%", r: false }, { v: "96.11%", r: false }, { v: "97.66%", r: false }, { v: "94.90%", r: false }, { v: "94.90%", r: false }, { v: "98.04%", r: false }, { v: "98.19%", r: false }, { v: "98.32%", r: false }, { v: "94.40%", r: false }, { v: "98.24%", r: false }, { v: "98.39%", r: false }, { v: "98.54%", r: false }] },
  { no: "15", kpi: "JITTER RAN TO CORE 01-SUMBAGUT", threshold: "2 ms", cells: [{ v: "98.88%", r: false }, { v: "98.99%", r: false }, { v: "98.99%", r: false }, { v: "98.89%", r: false }, { v: "98.75%", r: false }, { v: "98.76%", r: false }, { v: "98.89%", r: false }, { v: "98.75%", r: false }, { v: "98.75%", r: false }, { v: "98.78%", r: false }, { v: "98.93%", r: false }, { v: "99.06%", r: false }, { v: "98.25%", r: false }, { v: "98.98%", r: false }, { v: "99.13%", r: false }, { v: "99.28%", r: false }] },
  { no: "16", kpi: "JITTER RAN TO CORE 10-SUMBAGTENG", threshold: "2 ms", cells: [{ v: "98.75%", r: false }, { v: "98.76%", r: false }, { v: "98.76%", r: false }, { v: "98.83%", r: false }, { v: "98.75%", r: false }, { v: "98.76%", r: false }, { v: "98.83%", r: false }, { v: "98.75%", r: false }, { v: "98.75%", r: false }, { v: "98.78%", r: false }, { v: "98.93%", r: false }, { v: "99.06%", r: false }, { v: "98.25%", r: false }, { v: "98.98%", r: false }, { v: "99.13%", r: false }, { v: "99.28%", r: false }] },
  { no: "17", kpi: "JITTER RAN TO CORE 02-SUMBAGSEL", threshold: "2 ms", cells: [{ v: "98.48%", r: false }, { v: "98.60%", r: false }, { v: "98.60%", r: false }, { v: "98.72%", r: false }, { v: "98.48%", r: false }, { v: "98.60%", r: false }, { v: "98.72%", r: false }, { v: "98.48%", r: false }, { v: "98.48%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "98.48%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "18", kpi: "JITTER RAN TO CORE 03-JABOTABEK INNER", threshold: "2 ms", cells: [{ v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.95%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "19", kpi: "JITTER RAN TO CORE 12-JABOTABEK OUTER", threshold: "2 ms", cells: [{ v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.95%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "20", kpi: "JITTER RAN TO CORE 04-JAWA BARAT", threshold: "2 ms", cells: [{ v: "99.96%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.99%", r: false }, { v: "99.96%", r: false }, { v: "100.00%", r: false }, { v: "99.99%", r: false }, { v: "99.96%", r: false }, { v: "99.96%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.96%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "21", kpi: "JITTER RAN TO CORE 05-JAWA TENGAH", threshold: "2 ms", cells: [{ v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "99.95%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.95%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "22", kpi: "JITTER RAN TO CORE 06-JAWA TIMUR", threshold: "2 ms", cells: [{ v: "99.95%", r: false }, { v: "99.98%", r: false }, { v: "99.98%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "99.98%", r: false }, { v: "100.00%", r: false }, { v: "99.95%", r: false }, { v: "99.95%", r: false }, { v: "99.80%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.95%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "23", kpi: "JITTER RAN TO CORE 07-BALINUSRA", threshold: "2 ms", cells: [{ v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.78%", r: false }, { v: "99.80%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.78%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "24", kpi: "JITTER RAN TO CORE 08-KALIMANTAN", threshold: "2 ms", cells: [{ v: "98.75%", r: false }, { v: "99.54%", r: false }, { v: "99.54%", r: false }, { v: "99.43%", r: false }, { v: "98.75%", r: false }, { v: "99.54%", r: false }, { v: "99.43%", r: false }, { v: "98.75%", r: false }, { v: "98.75%", r: false }, { v: "99.38%", r: false }, { v: "99.53%", r: false }, { v: "99.66%", r: false }, { v: "98.25%", r: false }, { v: "99.58%", r: false }, { v: "99.73%", r: false }, { v: "99.88%", r: false }] },
  { no: "25", kpi: "JITTER RAN TO CORE 09-SULAWESI", threshold: "2 ms", cells: [{ v: "97.73%", r: false }, { v: "98.76%", r: false }, { v: "98.76%", r: false }, { v: "98.94%", r: false }, { v: "97.73%", r: false }, { v: "98.76%", r: false }, { v: "98.94%", r: false }, { v: "97.73%", r: false }, { v: "97.73%", r: false }, { v: "99.25%", r: false }, { v: "99.40%", r: false }, { v: "99.53%", r: false }, { v: "97.23%", r: false }, { v: "99.45%", r: false }, { v: "99.60%", r: false }, { v: "99.75%", r: false }] },
  { no: "26", kpi: "JITTER RAN TO CORE 11-PUMA", threshold: "2 ms", cells: [{ v: "97.59%", r: false }, { v: "98.14%", r: false }, { v: "98.14%", r: false }, { v: "98.21%", r: false }, { v: "97.59%", r: false }, { v: "98.14%", r: false }, { v: "98.21%", r: false }, { v: "97.59%", r: false }, { v: "97.59%", r: false }, { v: "98.72%", r: false }, { v: "98.87%", r: false }, { v: "99.00%", r: false }, { v: "97.09%", r: false }, { v: "98.92%", r: false }, { v: "99.07%", r: false }, { v: "99.22%", r: false }] },
  { no: "27", kpi: "MTTRQ RAN-TO-CORE CRITICAL JAWA", threshold: "24 jam", cells: [{ v: "91.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "91.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "91.30%", r: false }, { v: "91.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "91.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "28", kpi: "MTTRQ RAN-TO-CORE CRITICAL NON JAWA", threshold: "48 jam", cells: [{ v: "88.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.30%", r: false }, { v: "88.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.30%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "29", kpi: "MTTRQ RAN-TO-CORE MAJOR JAWA", threshold: "48 jam", cells: [{ v: "90.80%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "90.80%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "90.60%", r: false }, { v: "90.60%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "90.60%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "30", kpi: "MTTRQ RAN-TO-CORE MAJOR NON JAWA", threshold: "72 jam", cells: [{ v: "87.80%", r: false }, { v: "92.62%", r: false }, { v: "92.62%", r: false }, { v: "95.64%", r: false }, { v: "87.80%", r: false }, { v: "92.62%", r: false }, { v: "95.64%", r: false }, { v: "87.60%", r: false }, { v: "87.60%", r: false }, { v: "95.54%", r: false }, { v: "95.69%", r: false }, { v: "95.82%", r: false }, { v: "87.10%", r: false }, { v: "95.74%", r: false }, { v: "95.89%", r: false }, { v: "96.04%", r: false }] },
  { no: "31", kpi: "MTTRQ RAN-TO-CORE MINOR JAWA", threshold: "72 jam", cells: [{ v: "94.60%", r: false }, { v: "100.00%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "94.60%", r: false }, { v: "100.00%", r: false }, { v: "100%", r: false }, { v: "94.50%", r: false }, { v: "94.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "94.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "32", kpi: "MTTRQ RAN-TO-CORE MINOR NON JAWA", threshold: "96 jam", cells: [{ v: "93.10%", r: false }, { v: "95.38%", r: false }, { v: "95.38%", r: false }, { v: "95.15%", r: false }, { v: "93.10%", r: false }, { v: "95.38%", r: false }, { v: "95.15%", r: false }, { v: "92.90%", r: false }, { v: "92.90%", r: false }, { v: "96.07%", r: false }, { v: "96.22%", r: false }, { v: "96.35%", r: false }, { v: "92.40%", r: false }, { v: "96.27%", r: false }, { v: "96.42%", r: false }, { v: "96.57%", r: false }] },
  { no: "33", kpi: "PL CORE-TO-IX NATION WIDE", threshold: "0.10%", cells: [{ v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "34", kpi: "LATENCY CORE-TO-IX NATION WIDE", threshold: "Distance Based", cells: [{ v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "99.50%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "35", kpi: "JITTER CORE-TO-IX NATION WIDE", threshold: "1 ms", cells: [{ v: "88.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.00%", r: false }, { v: "88.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "88.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "36", kpi: "MTTRQ CORE-TO-IX MAJOR NATION WIDE", threshold: "4 Hari", cells: [{ v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
  { no: "37", kpi: "MTTRQ CORE-TO-IX MINOR NATION WIDE", threshold: "7 Hari", cells: [{ v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "96.00%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }, { v: "100%", r: false }] },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const QUARTERS: { label: string; months: string[] }[] = [
  { label: "Q1 2026", months: ["Jan", "Feb", "Mar"] },
  { label: "Q2 2026", months: ["Apr", "May", "Jun"] },
  { label: "Q3 2026", months: ["Jul", "Ags", "Sep"] },
  { label: "Q4 2026", months: ["Okt", "Nov", "Des"] },
];

const NO_COL_WIDTH = 40;
const KPI_COL_WIDTH = 240;
const THRESHOLD_COL_WIDTH = 76;
const METRIC_COL_WIDTH = 58;

const KPI_CATEGORIES = ["PL", "LATENCY", "JITTER", "MTTRQ"] as const;

type SeriesKey = "MBB" | "FBB" | "OLO" | "EBIS";

const SERIES_KEYS: SeriesKey[] = ["MBB", "FBB", "OLO", "EBIS"];

const SERIES_META: Record<SeriesKey, { gradient: string; dot: string }> = {
  MBB: { gradient: "linear-gradient(-125deg,#eb4a3e 20%,#f09b4d 59%)", dot: "#eb4a3e" },
  FBB: { gradient: "linear-gradient(180deg,#00c529 0%,#1ff0d5 100%)", dot: "#00c529" },
  OLO: { gradient: "linear-gradient(180deg,#53b7ff 0%,#1e34fa 100%)", dot: "#1e34fa" },
  EBIS: { gradient: "linear-gradient(-92deg,#ae13fe -18%,#f374ff 62%)", dot: "#ae13fe" },
};

/**
 * Placeholder monthly "KPI not clear" counts per series, in the same spirit
 * as ONX's COMPARISON_ROWS sample data — swap for real figures once the
 * History SLA data source is wired up. Shaped so June (index 5) reads as a
 * notably quiet month, matching the mockup's "Jun 2026 / 8 KPI" tooltip.
 */
const TREND_DATA: Record<SeriesKey, number[]> = {
  MBB: [6, 7, 5, 8, 6, 2, 4, 5, 6, 7, 5, 4],
  FBB: [4, 5, 6, 4, 5, 2, 3, 4, 5, 4, 3, 4],
  OLO: [8, 7, 6, 7, 8, 2, 5, 6, 7, 8, 6, 5],
  EBIS: [3, 4, 3, 5, 4, 2, 3, 4, 3, 4, 3, 2],
};

const KPI_BADGES: { key: SeriesKey; achieved: number; total: number }[] = [
  { key: "MBB", achieved: 2, total: 19 },
  { key: "FBB", achieved: 2, total: 19 },
  { key: "OLO", achieved: 2, total: 19 },
  { key: "EBIS", achieved: 2, total: 19 },
];

function TrendChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(5);
  const width = 1200;
  const height = 200;
  const maxValue = 40;
  const gridValues = [0, 10, 20, 30, 40];

  const pointsFor = (key: SeriesKey) =>
    TREND_DATA[key]
      .map((v, i) => `${(i / (MONTHS.length - 1)) * width},${height - (v / maxValue) * height}`)
      .join(" ");

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(relX * (MONTHS.length - 1));
    setHoverIndex(Math.min(Math.max(idx, 0), MONTHS.length - 1));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <div className="flex w-8 shrink-0 flex-col justify-between py-0 text-[12px] text-[#64748b]">
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="h-[200px] w-full"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {gridValues.map((v) => {
              const y = height - (v / maxValue) * height;
              return (
                <line
                  key={v}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
              );
            })}

            {hoverIndex !== null && (
              <line
                x1={(hoverIndex / (MONTHS.length - 1)) * width}
                x2={(hoverIndex / (MONTHS.length - 1)) * width}
                y1={0}
                y2={height}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            {SERIES_KEYS.map((key) => (
              <polyline
                key={key}
                points={pointsFor(key)}
                fill="none"
                stroke={SERIES_META[key].dot}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {hoverIndex !== null &&
              SERIES_KEYS.map((key) => {
                const x = (hoverIndex / (MONTHS.length - 1)) * width;
                const y = height - (TREND_DATA[key][hoverIndex] / maxValue) * height;
                return (
                  <circle
                    key={key}
                    cx={x}
                    cy={y}
                    r={3.5}
                    fill={SERIES_META[key].dot}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              })}
          </svg>

          {hoverIndex !== null && (
            <div
              className="pointer-events-none absolute top-2 flex w-[150px] -translate-x-1/2 flex-col gap-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2.5 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)]"
              style={{
                left: `${Math.min(Math.max((hoverIndex / (MONTHS.length - 1)) * 100, 12), 88)}%`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="whitespace-nowrap text-[12px] font-semibold text-[#020617]">
                  {MONTHS[hoverIndex]} 2026
                </span>
                <span className="whitespace-nowrap rounded-lg bg-[#f9ebeb] px-2 py-0.5 text-[12px] font-semibold text-[#c23837]">
                  {SERIES_KEYS.reduce((sum, k) => sum + TREND_DATA[k][hoverIndex], 0)} KPI
                </span>
              </div>
              {SERIES_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-[#334155]">
                    <span
                      className="h-1 w-3 shrink-0 rounded-full"
                      style={{ background: SERIES_META[key].gradient }}
                    />
                    {key}
                  </span>
                  <span className="text-[12px] font-medium text-[#020617]">
                    {TREND_DATA[key][hoverIndex]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-8 shrink-0" />
        <div className="flex flex-1 justify-between">
          {MONTHS.map((m) => (
            <span key={m} className="text-[12px] text-[#64748b]">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OloDashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All KPI");

  const filteredRows = useMemo(() => {
    return OLO_TABLE_DATA.filter((row) => {
      const matchesSearch = row.kpi.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory =
        category === "All KPI" || row.kpi.toUpperCase().startsWith(category);
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f9]">
      {/* Decorative scalloped bar, full page width — identical mechanism to
          the FBB/ONX/Ookla dashboards, with this page's own title in the
          notch. The mockup's on-page header reads "History SLA" rather than
          "OLO Dashboard", so that's what's used here. */}
      <div className="relative h-[52px] w-full shrink-0 drop-shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <svg
          viewBox="0 0 1920 56"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 h-[40px] w-full"
        >
          <defs>
            <mask id="olo-header-bar-mask">
              <path
                d="M0.00006 0l1919.99984 0 0 29.317c0 0-635 0-688.981 0-53.9809 0-34.8509 26.683-66.185 26.683-31.334 0-374.3339 0-406.01896 0-31.685 0-12.86902-26.683-66.09198-26.683-53.22302 0-692.72296 0-692.72296 0l0-29.317 0.00006 0z"
                fill="#fff"
              />
            </mask>
          </defs>
          <path
            d="M0.00006 0l1919.99984 0 0 29.317c0 0-635 0-688.981 0-53.9809 0-34.8509 26.683-66.185 26.683-31.334 0-374.3339 0-406.01896 0-31.685 0-12.86902-26.683-66.09198-26.683-53.22302 0-692.72296 0-692.72296 0l0-29.317 0.00006 0z"
            fill="#ffffff"
          />
          <path
            d="M0.00006-0.5l1920.49984 0 0 30.317-346.8146 0-342.6664 0q-10.8486 0-18.8262 1.45116-7.0001 1.27335-12.0737 3.72609-2.234 1.07995-4.1784 2.42487-1.7214 1.19056-3.3063 2.65405-1.3169 1.216-2.7072 2.78227-0.5531 0.62309-1.2124 1.40778-0.4013 0.47773-1.1629 1.4015-1.1633 1.41097-1.7518 2.0926-0.9833 1.13902-1.8328 1.99547-1.0193 1.02767-2.0331 1.84323-1.1356 0.9136-2.3495 1.6316-2.6912 1.59188-6.0872 2.39097-3.7457 0.88141-8.6635 0.88141l-203.03617 0-202.98279 0q-5.00622 0-8.82574-0.89326-3.46051-0.80931-6.20777-2.42039-1.23871-0.72644-2.39837-1.65024-1.03504-0.82452-2.07642-1.86327-0.86743-0.86522-1.87213-2.01584-0.60248-0.68997-1.78839-2.11221-0.77582-0.93043-1.17096-1.39557-0.66138-0.77858-1.21893-1.40071-1.39631-1.55805-2.71137-2.76545-1.58282-1.45324-3.29376-2.63475-1.93189-1.33409-4.14215-2.40464-5.01709-2.43002-11.90338-3.6907-7.84375-1.43596-18.48261-1.43596l-344.60324-0.00001-348.61972 0 0-30.317 0.50006 0z m0 1l-0.00006 0 0-0.5 0.5 0 0 29.317-0.5 0 0-0.5 348.11972 0 344.60324 0.00001q10.72962 0 18.66266 1.4523 7.01996 1.28515 12.15924 3.77436 2.27936 1.10401 4.27448 2.48177 1.76782 1.22081 3.40179 2.72101 1.35144 1.24079 2.77985 2.83466 0.56445 0.62985 1.23626 1.42069 0.40314 0.47459 1.17694 1.40257 1.17859 1.41346 1.77363 2.0949 0.98254 1.12523 1.82501 1.96557 1.00195 0.99938 1.99328 1.78911 1.10382 0.87935 2.28119 1.56979 2.61652 1.53442 5.92969 2.30927 3.70715 0.86699 8.59796 0.86699l202.98279 0 203.03617 0q4.8017 0 8.4345-0.85482 3.2473-0.76412 5.8072-2.27826 1.1522-0.68152 2.2318-1.55007 0.9697-0.78011 1.9498-1.76827 0.8254-0.83223 1.786-1.94477 0.5822-0.67422 1.7371-2.07519 0.7718-0.93629 1.1688-1.40871 0.6664-0.79301 1.2302-1.4283 1.424-1.60419 2.7765-2.85314 1.6365-1.51105 3.4159-2.7418 2.0084-1.38911 4.312-2.50274 5.1961-2.51191 12.3301-3.80963 8.0663-1.4673 19.0051-1.4673l342.6664 0 346.3146 0 0 0.5-0.5 0 0-29.317 0.5 0 0 0.5-1919.99984 0z"
            fill="#17171714"
            mask="url(#olo-header-bar-mask)"
          />
        </svg>

        {/* Title tab, centered and scaled to match the bar's notch */}
        <div className="absolute left-1/2 top-0 h-[52px] w-[28.5417%] min-w-[280px] max-w-[500px] -translate-x-1/2">
          <svg
            viewBox="0 0 548 73"
            preserveAspectRatio="none"
            className="absolute left-0 top-0 h-full w-full"
          >
            <path
              d="M0 0l548 0c-102.75003 0-75.582 73-133.88638 73l-284.89771 0c-48.1851 0-26.46593-73-129.21591-73z"
              fill="#ffffff"
            />
            <path
              d="M0-0.5l548 0 0 1q-20.77081 0-36.52985 4.01392-7.2102 1.83648-13.47989 4.53528-5.81958 2.50506-10.92373 5.79551-4.65747 3.00249-8.84586 6.74371-3.71066 3.31448-7.24301 7.38494-2.92956 3.37586-6.10947 7.7194-1.26577 1.72896-2.77557 3.88842-0.90631 1.29631-2.66739 3.85558-2.62723 3.81804-3.94375 5.66008-2.19001 3.0642-4.03336 5.36152-2.20572 2.74892-4.32635 4.92613-2.37299 2.4363-4.82316 4.35047-2.65741 2.07609-5.52053 3.63022-3.04691 1.65388-6.41169 2.76396-3.53488 1.1662-7.49145 1.75636-4.11981 0.6145-8.76132 0.6145l-284.89771 0q-7.12531 0-12.90114-2.13924-2.71152-1.00429-5.20594-2.50309-2.34571-1.40945-4.56466-3.29646-2.04746-1.74119-4.07302-3.96397-1.81225-1.98871-3.73727-4.50936-1.61086-2.10929-3.55889-4.93718-1.17319-1.70309-3.53682-5.25016-1.75374-2.63182-2.6574-3.96563-1.51161-2.23116-2.7879-4.02772-3.21317-4.52298-6.20501-8.06593-3.61611-4.28224-7.43969-7.78858-4.32603-3.9671-9.15141-7.16398-5.29973-3.51114-11.34546-6.19206-6.52701-2.89435-14.02552-4.86813-16.44422-4.32851-38.02578-4.32851l0-1z m0 1l0-0.5 0-0.5q21.71097 0 38.28033 4.36145 7.57604 1.99419 14.17634 4.92104 6.12258 2.71501 11.49239 6.27257 4.89097 3.24033 9.27499 7.2606 3.87054 3.54941 7.52783 7.88042 3.01892 3.57504 6.25622 8.13197 1.28234 1.80506 2.80056 4.04597 0.90656 1.33811 2.66168 3.97199 2.35946 3.54081 3.52816 5.2374 1.9342 2.80781 3.53012 4.89753 1.89863 2.48611 3.68166 4.44274 1.98274 2.17579 3.98172 3.87575 2.15644 1.83386 4.43187 3.20108 2.41433 1.45068 5.03822 2.42251 5.60774 2.07698 12.55382 2.07698l284.89771 0q4.56735 0 8.6138-0.60356 3.87207-0.57755 7.32568-1.71694 3.27966-1.08201 6.24793-2.69319 2.79-1.51444 5.38192-3.53937 2.39673-1.87245 4.72245-4.26019 2.08715-2.14283 4.26275-4.85422 1.82575-2.27539 3.99973-5.31715 1.3125-1.8364 3.93356-5.64549 1.76553-2.56577 2.6716-3.86171 1.51563-2.16778 2.78827-3.90613 3.20425-4.37684 6.1611-7.78411 3.57419-4.11865 7.33206-7.47532 4.24671-3.79331 8.97025-6.83839 5.17419-3.33561 11.07016-5.87355 6.34195-2.72992 13.62845-4.58582 15.88049-4.04486 36.77667-4.04486l0 0.5 0 0.5-548 0z"
              fill="#17171714"
            />
          </svg>
          <h1 className="absolute left-1/2 top-[15px] -translate-x-1/2 whitespace-nowrap text-[16px] font-semibold text-[#020617]">
            History SLA
          </h1>
        </div>
      </div>

      {/* Sidebar + content row */}
      <div className="flex flex-1">
        <Sidebar activeKey="olo" />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex flex-1 flex-col p-4">
            {/* Outer card */}
            <div className="flex flex-1 flex-col gap-4 rounded-[36px] border border-[#e2e8f0] bg-white p-4">
              {/* Chart panel */}
              <div className="flex flex-col gap-4 rounded-[19px] border border-[#e2e8f0] bg-white p-4 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-[#020617]">
                    Trend Total KPI Not Clear
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {SERIES_KEYS.map((key) => (
                      <span
                        key={key}
                        className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[#334155]"
                      >
                        <span
                          className="h-1 w-3 shrink-0 rounded-full"
                          style={{ background: SERIES_META[key].gradient }}
                        />
                        {key}
                      </span>
                    ))}
                  </div>
                </div>

                <TrendChart />
              </div>

              {/* KPI badge cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {KPI_BADGES.map(({ key, achieved, total }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-[19px] border border-[#e2e8f0] bg-white p-3 shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f9ebeb] text-[#c23837]">
                      <AlertTriangle className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-[#020617]">{key}</span>
                      <span className="whitespace-nowrap text-xs text-[#64748b]">
                        {achieved} of {total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search + filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-[260px]">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]"
                    strokeWidth={1.75}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="h-9 w-full rounded-full border border-[#e2e8f0] bg-white pl-9 pr-4 text-sm text-[#0a0a0a] placeholder:text-[#94a3b8] outline-none"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="relative">
                    <select
                      aria-label="Filter KPI"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-9 w-[130px] appearance-none rounded-full border border-[#e2e8f0] bg-white py-1 pl-4 pr-8 text-sm font-medium text-[#0a0a0a] shadow-[0px_1px_1.75px_0px_rgba(0,0,0,0.05)] outline-none"
                    >
                      <option value="All KPI">All KPI</option>
                      {KPI_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#737373]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="whitespace-nowrap text-sm text-[#64748b]">
                    Showing {filteredRows.length} entries
                  </span>
                </div>
              </div>

              {/* Achievement table */}
              <AchievementTable rows={filteredRows} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AchievementTable({ rows }: { rows: OloRow[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#e2e8f0]">
      <div className="max-h-[560px] overflow-auto">
        <div
          className="flex flex-col"
          style={{
            minWidth: NO_COL_WIDTH + KPI_COL_WIDTH + THRESHOLD_COL_WIDTH + METRIC_COL_WIDTH * 16,
          }}
        >
          {/* 3-row grouped header, sticky while the body scrolls */}
          <div className="sticky top-0 z-10 flex flex-col bg-[#f1f5f9]">
            <div className="flex">
              <div
                style={{ width: NO_COL_WIDTH }}
                className="flex h-[64px] shrink-0 items-center justify-center border-b border-r border-[#e2e8f0]"
              >
                <span className="text-[14px] font-medium text-[#334155]">No</span>
              </div>
              <div
                style={{ width: KPI_COL_WIDTH }}
                className="flex h-[64px] shrink-0 items-center border-b border-r border-[#e2e8f0] px-3"
              >
                <span className="text-[14px] font-medium text-[#334155]">KPI</span>
              </div>
              <div
                style={{ width: THRESHOLD_COL_WIDTH }}
                className="flex h-[64px] shrink-0 items-center justify-center border-b border-r border-[#e2e8f0] px-2 text-center"
              >
                <span className="text-[14px] font-medium text-[#334155]">Threshold</span>
              </div>

              <div style={{ width: METRIC_COL_WIDTH * 16 }} className="flex shrink-0 flex-col">
                <div className="flex h-6 items-center justify-center border-b border-[#e2e8f0] bg-[#f1f5f9]">
                  <span className="text-[14px] font-medium text-[#334155]">Achievement</span>
                </div>
                <div className="flex h-10">
                  {QUARTERS.map((quarter, qIdx) => (
                    <div
                      key={quarter.label}
                      style={{ width: METRIC_COL_WIDTH * 4 }}
                      className={`flex shrink-0 flex-col ${
                        qIdx !== QUARTERS.length - 1 ? "border-r border-[#e2e8f0]" : ""
                      }`}
                    >
                      <div className="flex h-5 items-center justify-center border-b border-[#e2e8f0] bg-[#f2f6fa]">
                        <span className="text-[14px] font-medium text-[#334155]">
                          {quarter.label}
                        </span>
                      </div>
                      <div className="flex h-5">
                        <div
                          style={{ width: METRIC_COL_WIDTH }}
                          className="flex shrink-0 items-center justify-center border-r border-[#e2e8f0] bg-[#f2f6fa]"
                        >
                          <span className="text-[14px] font-medium text-[#334155]">Target</span>
                        </div>
                        {quarter.months.map((month, mIdx) => (
                          <div
                            key={month}
                            style={{ width: METRIC_COL_WIDTH }}
                            className={`flex shrink-0 items-center justify-center bg-[#f1f5f9] ${
                              mIdx !== quarter.months.length - 1 ? "border-r border-[#e2e8f0]" : ""
                            }`}
                          >
                            <span className="whitespace-nowrap text-[14px] font-medium text-[#334155]">
                              FM {month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body rows */}
          {rows.map((row, rIdx) => (
            <div
              key={row.no}
              className={`flex bg-white ${rIdx !== rows.length - 1 ? "border-b border-[#e2e8f0]" : ""}`}
            >
              <div
                style={{ width: NO_COL_WIDTH }}
                className="flex h-8 shrink-0 items-center justify-center border-r border-[#e2e8f0]"
              >
                <span className="text-[14px] font-normal text-[#020617]">{row.no}</span>
              </div>
              <div
                style={{ width: KPI_COL_WIDTH }}
                className="flex h-8 shrink-0 items-center border-r border-[#e2e8f0] px-3"
              >
                <span className="truncate text-[14px] font-normal text-[#020617]">{row.kpi}</span>
              </div>
              <div
                style={{ width: THRESHOLD_COL_WIDTH }}
                className="flex h-8 shrink-0 items-center justify-center border-r border-[#e2e8f0] px-2 text-center"
              >
                <span className="whitespace-nowrap text-[14px] font-normal text-[#020617]">
                  {row.threshold}
                </span>
              </div>
              {row.cells.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  style={{ width: METRIC_COL_WIDTH }}
                  className={`flex h-8 shrink-0 items-center justify-center ${
                    cIdx !== row.cells.length - 1 ? "border-r border-[#e2e8f0]" : ""
                  }`}
                >
                  <span
                    className={`whitespace-nowrap text-[14px] font-normal ${
                      cell.r ? "text-[#c23837]" : "text-[#020617]"
                    }`}
                  >
                    {cell.v}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {rows.length === 0 && (
            <div className="flex h-16 items-center justify-center">
              <span className="text-sm text-[#64748b]">No matching KPI found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
