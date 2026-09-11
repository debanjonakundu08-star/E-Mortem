import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Laptop,
  Headphones,
  Search,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import StatusBadge from "../components/common/StatusBadge";
import { useProducts } from "../context/ProductContext";
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";

export default function MyDevices() {
  const navigate = useNavigate();
  const { devices, getDemoDevice, diagnoseDevice, showToast } = useProducts();
  const [search, setSearch] = useState("");

  const filtered = devices.filter(
    (d) =>
      d.device?.toLowerCase().includes(search.toLowerCase()) ||
      d.brand?.toLowerCase().includes(search.toLowerCase()) ||
      d.model?.toLowerCase().includes(search.toLowerCase()) ||
      d.id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-slate-900 dark:text-white">My</span>
            <span className="text-gradient-aurora">Devices</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track electronic integrity, diagnosis history, and postmortem second opinions for your gadgets.
          </p>
        </div>

        <MagneticButton strength={0.25}>
          <Link
            to="/diagnose"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all shadow-md shadow-teal-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Diagnose New Device</span>
          </Link>
        </MagneticButton>
      </div>

      {/* Search Bar */}
      <div className="graveyard-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your devices by name, model, brand or ID..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <TiltCard
            key={d.id}
            maxTilt={6}
            glare={true}
            glareColor="rgba(20, 184, 166, 0.15)"
            glowBorder={true}
            className="rounded-3xl"
          >
            <div className="graveyard-card p-5 h-full flex flex-col justify-between hover:border-teal-500/40 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {d.type === "Smartphone" ? "📱" : d.type === "Laptop" ? "💻" : "🎧"}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {d.device}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {d.id}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={d.status} size="sm" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-900/80 border border-slate-200 dark:border-charcoal-800 space-y-1.5 text-xs mb-3.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device Health:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                      {d.healthScore} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Diagnosis:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {d.dateDiagnosed || "Recent"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Suspected Issue:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium truncate max-w-[140px]">
                      {d.probableCauses?.[0]?.name || "Wear"}
                    </span>
                  </div>
                </div>

                {d.symptoms && (
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                      Symptoms
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {d.symptoms.slice(0, 3).map((sym, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-charcoal-700"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-charcoal-800 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/diagnose`)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-Diagnose</span>
                </button>

                <Link
                  to={`/report/${d.id}`}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>View E-Mortem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
