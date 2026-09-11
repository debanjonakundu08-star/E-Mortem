import React from "react";
import {
  Settings as SettingsIcon,
  Database,
  RotateCcw,
  ShieldCheck,
  Activity,
  Sun,
  Moon,
  Laptop,
  Check,
  Sparkles
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";

export default function Settings() {
  const { resetToDefault, devices, showToast } = useProducts();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const label = newTheme === "system" ? `System preference (${resolvedTheme})` : `${newTheme} mode`;
    showToast(`Switched theme to ${label}`, "success");
  };

  const themeOptions = [
    {
      id: "light",
      label: "Light Mode",
      desc: "Clean white canvas, navy typography, and bright presentation accents",
      icon: Sun,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-500/15",
      glareColor: "rgba(245, 158, 11, 0.12)"
    },
    {
      id: "dark",
      label: "Dark Mode",
      desc: "Deep charcoal/navy background with focused contrast and controlled accents",
      icon: Moon,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-100 dark:bg-cyan-500/15",
      glareColor: "rgba(6, 182, 212, 0.15)"
    },
    {
      id: "system",
      label: "System Match",
      desc: `Automatically follows your operating system theme (Currently ${resolvedTheme})`,
      icon: Laptop,
      iconColor: "text-teal-500 dark:text-teal-400",
      iconBg: "bg-teal-100 dark:bg-teal-500/15",
      glareColor: "rgba(20, 184, 166, 0.15)"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin-slow" />
          <span>System & Visual Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-purple-500/20 border border-teal-500/30 text-teal-600 dark:text-teal-400 shadow-sm">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <span className="text-gradient-aurora">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure E-Mortem appearance, client storage, and deterministic forensic heuristic parameters.
        </p>
      </div>

      {/* Theme Preferences Card */}
      <TiltCard maxTilt={3} glare={true} glowBorder={true} className="graveyard-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/20 to-violet-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance & Theme System
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Switch between Light, Dark, or automatic System preference with instant persistence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <TiltCard
                key={opt.id}
                maxTilt={6}
                glare={true}
                glareColor={opt.glareColor}
                glowBorder={isSelected}
                className="h-full rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => handleThemeChange(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all relative group flex flex-col justify-between h-full ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/70 dark:bg-teal-500/10 shadow-md shadow-teal-500/10 ring-2 ring-teal-500/30"
                      : "border-slate-200 dark:border-charcoal-800 bg-white/60 dark:bg-charcoal-900/60 hover:border-slate-300 dark:hover:border-charcoal-700 hover:bg-slate-50 dark:hover:bg-charcoal-800/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${opt.iconBg} ${opt.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-300 dark:border-teal-500/30 font-mono">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              </TiltCard>
            );
          })}
        </div>
      </TiltCard>

      {/* LocalStorage Data Management */}
      <TiltCard maxTilt={3} glare={true} glowBorder={true} className="graveyard-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Browser LocalStorage Diagnostic Registry
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Client-side persistence storing your diagnosed devices and electronic postmortems
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/20">
            {devices.length} Devices Registered
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          E-Mortem saves all custom gadget diagnoses into browser storage (<code className="text-teal-700 dark:text-teal-400 font-bold">e_mortem_devices_v1</code>). All reports remain accessible across browser refreshes and seamlessly update dashboard calculations in real-time.
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <MagneticButton strength={0.25}>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 transition-all active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Pre-Seeded Devices</span>
            </button>
          </MagneticButton>

          <span className="text-[11px] text-slate-500 font-mono">
            Restores initial hackathon dataset safely
          </span>
        </div>
      </TiltCard>

      {/* Diagnostic Heuristics Transparency */}
      <TiltCard maxTilt={2} glare={true} className="graveyard-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Deterministic Second-Opinion Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Repeatable electronic postmortem heuristics (Not a black-box ML model)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <TiltCard maxTilt={5} glare={true} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-colors">
            <span className="font-bold text-teal-700 dark:text-teal-400 block mb-1">Health Score (0–100)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Synthesizes active symptoms, trigger events, and age degradation into a high-level operational rating.
            </p>
          </TiltCard>
          <TiltCard maxTilt={5} glare={true} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Repairability (0–100)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Compares estimated component repair expenditure against current second-hand device value.
            </p>
          </TiltCard>
          <TiltCard maxTilt={5} glare={true} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-violet-500/40 transition-colors">
            <span className="font-bold text-violet-700 dark:text-violet-400 block mb-1">Second-Opinion Questions</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Equips consumers with precise technical questions to ask repair shops to verify diagnosis claims.
            </p>
          </TiltCard>
        </div>
      </TiltCard>

      {/* Brand & Credibility Statement */}
      <TiltCard maxTilt={2} glare={true} glowBorder={true} className="graveyard-card p-6 bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-violet-500/5 border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>E-Mortem Credibility</span>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          E-Mortem — <span className="text-gradient-aurora">“The Autopsy of Electronic Waste.”</span>
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          E-Mortem provides a digital second opinion before consumers spend money on unnecessary replacements or repairs. Results are preliminary assessments based on user-provided information and should be verified with component-level physical diagnostics.
        </p>
      </TiltCard>
    </div>
  );
}
