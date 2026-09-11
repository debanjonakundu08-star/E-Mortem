import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Battery,
  Flame,
  Zap,
  Cpu,
  Monitor,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  HardDrive,
  Scale,
  Recycle,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import api from "../services/api";

export default function Insights() {
  const [timeRange, setTimeRange] = useState("6m");
  const [insightsData, setInsightsData] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await api.getInsights();
        setInsightsData(data);
      } catch (err) {
        console.log("Using cached insight metrics:", err.message);
      }
    }
    loadInsights();
  }, []);

  const problemData = [
    { name: "Battery", percentage: 38, count: 380, color: "#06B6D4" },
    { name: "Overheating", percentage: 21, count: 210, color: "#F59E0B" },
    { name: "Charging", percentage: 17, count: 170, color: "#10B981" },
    { name: "Physical Damage", percentage: 14, count: 140, color: "#8B5CF6" },
    { name: "Software", percentage: 10, count: 100, color: "#EC4899" }
  ];

  const trendData6m = [
    { month: "Apr", reported: 120, avoided: 58 },
    { month: "May", reported: 145, avoided: 72 },
    { month: "Jun", reported: 132, avoided: 68 },
    { month: "Jul", reported: 168, avoided: 89 },
    { month: "Aug", reported: 190, avoided: 106 },
    { month: "Sep", reported: 210, avoided: 124 }
  ];

  const trendData12m = [
    { month: "Oct '25", reported: 98, avoided: 42 },
    { month: "Nov '25", reported: 105, avoided: 48 },
    { month: "Dec '25", reported: 114, avoided: 54 },
    { month: "Jan '26", reported: 122, avoided: 60 },
    { month: "Feb '26", reported: 118, avoided: 58 },
    { month: "Mar '26", reported: 128, avoided: 64 },
    { month: "Apr '26", reported: 120, avoided: 58 },
    { month: "May '26", reported: 145, avoided: 72 },
    { month: "Jun '26", reported: 132, avoided: 68 },
    { month: "Jul '26", reported: 168, avoided: 89 },
    { month: "Aug '26", reported: 190, avoided: 106 },
    { month: "Sep '26", reported: 210, avoided: 124 }
  ];

  const preventionGuidelines = [
    {
      cause: "Battery Degradation",
      icon: Battery,
      prevention: "Regular battery health monitoring",
      detail: "Avoid draining below 20% and avoid leaving gadgets plugged in overnight under blankets. Swapping degraded cells adds +2 years of life.",
      color: "cyan"
    },
    {
      cause: "Overheating",
      icon: Flame,
      prevention: "Cooling & thermal repasting",
      detail: "Clean fan dust vents annually and repaste CPU/GPU thermal interfaces to eliminate thermal throttling shutdowns.",
      color: "amber"
    },
    {
      cause: "Storage Wear",
      icon: HardDrive,
      prevention: "Storage health & wear leveling",
      detail: "Maintain at least 15% free disk capacity so flash memory wear-leveling controllers operate efficiently without premature block failures.",
      color: "emerald"
    },
    {
      cause: "Charging Pin Wear",
      icon: Zap,
      prevention: "Cable & adapter inspection",
      detail: "Clean lint from USB-C ports with non-conductive picks and use certified USB-PD chargers to prevent voltage surges.",
      color: "purple"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 uppercase">
            Forensic Intelligence
          </span>
          <span className="text-xs font-mono text-slate-500">• Demo / Sample Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Electronic Failure Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          “Learn which problems are most frequently turning usable electronics into premature waste.”
        </p>
      </div>

      {/* 1. MOST REPORTED PROBLEMS BAR CHART */}
      <div className="graveyard-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Most Common Failure Causes</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Distribution of primary failure symptoms across surveyed devices
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-50 dark:bg-slate-900 border border-cyan-200 dark:border-slate-800 text-cyan-800 dark:text-cyan-400 self-start sm:self-auto font-semibold">
            Battery = 38% Share
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={problemData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.25} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis unit="%" domain={[0, 45]} tick={{ fill: "#64748B", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F141C",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#F3F4F6"
                }}
                formatter={(val) => [`${val}% of Reported Failures`, "Share"]}
              />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {problemData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3.5 rounded-lg bg-cyan-50/80 dark:bg-slate-900/60 border border-cyan-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-white">Postmortem Finding: </strong>
            Over 59% of discarded gadgets suffer from battery or thermal degradation &mdash; both of which are inexpensive component-level repairs that avoid total device replacement.
          </span>
        </div>
      </div>

      {/* 2. REPAIR VS REPLACE & RECOVERY OPPORTUNITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Repair vs Replace Breakdown */}
        <div className="graveyard-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Repair vs Replace Assessment</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Demo Data</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Potentially Repairable</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">67%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 dark:bg-emerald-400 h-full w-[67%]" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                Repair cost under 35% of residual fair market value
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Beyond Economic Repair</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">33%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 dark:bg-rose-400 h-full w-[33%]" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                Recommended for component harvesting and certified recycling
              </span>
            </div>
          </div>
        </div>

        {/* Recovery Opportunities Breakdown */}
        <div className="graveyard-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Recycle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Recovery Opportunities</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Demo Data</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Reusable Components (Display, RAM, Modules)</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">78%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 dark:bg-cyan-400 h-full w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Recoverable User Data</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">84%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 dark:bg-emerald-400 h-full w-[84%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Recyclable Hazardous Materials (Batteries)</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 dark:bg-amber-400 h-full w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WHAT E-MORTEM IS LEARNING */}
      <div className="graveyard-card p-6 sm:p-7 border-cyan-200 dark:border-cyan-500/30 bg-gradient-to-br from-cyan-50/50 via-white to-slate-50 dark:from-[#0B1017] dark:to-[#070A0E] shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>What E-Mortem is Learning</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Sample Heuristic Observations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm dark:shadow-none">
            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              “Battery-related symptoms appear in <strong className="text-slate-900 dark:text-white">42% of demo diagnoses</strong>, frequently manifesting as sudden voltage drop under camera load.”
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm dark:shadow-none">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              “Charging issues <strong className="text-slate-900 dark:text-white">frequently overlap with battery complaints</strong>, often caused by cable pin wear or lint obstruction rather than IC failure.”
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm dark:shadow-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              “Many devices marked for replacement <strong className="text-slate-900 dark:text-white">still possess recoverable components</strong> like functional AMOLED displays and intact storage flash.”
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm dark:shadow-none">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              “<strong className="text-slate-900 dark:text-white">74% of random shutdowns</strong> are resolved by OEM battery service rather than costly motherboard replacement quotes.”
            </p>
          </div>
        </div>
      </div>

      {/* 4. PREVENTION GUIDELINES */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>What Could Have Prevented the Failure?</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Connecting individual postmortems to long-term electronic lifespan extension.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {preventionGuidelines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="graveyard-card p-5 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {item.cause}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 uppercase block font-semibold mb-0.5">
                    Recommended Prevention:
                  </span>
                  <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                    {item.prevention}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TREND CHART */}
      <div className="graveyard-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Reported Failures vs. Second-Opinion Avoidances</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tracking reported issues against unnecessary replacements prevented by E-Mortem
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange("6m")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                timeRange === "6m"
                  ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Last 6 months
            </button>
            <button
              onClick={() => setTimeRange("12m")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                timeRange === "12m"
                  ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Last year
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeRange === "6m" ? trendData6m : trendData12m}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.25} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F141C",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#F3F4F6"
                }}
              />
              <Line
                type="monotone"
                dataKey="reported"
                name="Reported Glitches"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ fill: "#EF4444", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="avoided"
                name="Replacements Avoided"
                stroke="#06B6D4"
                strokeWidth={2.5}
                dot={{ fill: "#06B6D4", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
