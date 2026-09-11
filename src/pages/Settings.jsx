import React from "react";
import {
  Settings as SettingsIcon,
  Database,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Sparkles,
  Info,
  Activity
} from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function Settings() {
  const { resetToDefault, devices, showToast } = useProducts();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          <span>Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure E-Mortem diagnostic storage, demo datasets, and heuristic parameters.
        </p>
      </div>

      {/* LocalStorage Data Management */}
      <div className="graveyard-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Browser LocalStorage Diagnostic Registry
              </h3>
              <p className="text-xs text-slate-400">
                Client-side persistence storing your diagnosed devices and electronic postmortems
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            {devices.length} Devices Registered
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          E-Mortem saves all custom gadget diagnoses into browser storage (<code className="text-emerald-400">e_mortem_devices_v1</code>). All reports remain accessible across browser refreshes and seamlessly update dashboard calculations in real-time.
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Pre-Seeded Devices</span>
          </button>

          <span className="text-[11px] text-slate-500">
            Restores initial hackathon dataset safely
          </span>
        </div>
      </div>

      {/* Diagnostic Heuristics Transparency */}
      <div className="graveyard-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Deterministic Second-Opinion Engine
            </h3>
            <p className="text-xs text-slate-400">
              Repeatable electronic postmortem heuristics (Not a black-box ML model)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Health Score (0–100)</span>
            <p className="text-slate-400 leading-relaxed">
              Synthesizes active symptoms, trigger events, and age degradation into a high-level operational rating.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Repairability (0–100)</span>
            <p className="text-slate-400 leading-relaxed">
              Compares estimated component repair expenditure against current second-hand device value.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-sky-400 block mb-1">Second-Opinion Questions</span>
            <p className="text-slate-400 leading-relaxed">
              Equips consumers with precise technical questions to ask repair shops to verify diagnosis claims.
            </p>
          </div>
        </div>
      </div>

      {/* Brand & Credibility Statement */}
      <div className="graveyard-card p-6 bg-slate-900/40 border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>E-Mortem Credibility</span>
        </div>
        <h4 className="text-base font-bold text-white">
          E-Mortem — “The Autopsy of Electronic Waste.”
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          E-Mortem provides a digital second opinion before consumers spend money on unnecessary replacements or repairs. Results are preliminary assessments based on user-provided information and should be verified with component-level physical diagnostics.
        </p>
      </div>
    </div>
  );
}
