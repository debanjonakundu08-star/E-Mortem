import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Smartphone,
  Sparkles,
  Clock,
  Flame,
  Battery,
  HardDrive,
  Monitor,
  Scale,
  FileSpreadsheet,
  AlertOctagon,
  RefreshCw,
  Sliders,
  DollarSign,
  Award,
  Recycle,
  Check
} from "lucide-react";
import ScoreRing from "../components/common/ScoreRing";
import ProgressBar from "../components/common/ProgressBar";
import StatusBadge from "../components/common/StatusBadge";
import { useProducts } from "../context/ProductContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { kpis, getDemoDevice, diagnoseDevice, showToast, devices, isBackendConnected } = useProducts();
  const [selectedComponent, setSelectedComponent] = useState("battery");

  const componentDetails = {
    battery: {
      id: "battery",
      name: "Battery System",
      icon: Battery,
      score: 42,
      risk: "High",
      riskBadge: "High Risk",
      gradient: "rose",
      evidence: "Rapid battery drain (2–4h) + unexpected shutdowns at 15–20% charge",
      suggestedCheck: "Cell load impedance & cycle degradation calibration test",
      whyImportant: "Chemical Li-ion aging causes internal impedance spikes under processor load, collapsing voltage rails below minimum threshold."
    },
    thermal: {
      id: "thermal",
      name: "Thermal Dissipation System",
      icon: Flame,
      score: 61,
      risk: "High",
      riskBadge: "High Risk",
      gradient: "amber",
      evidence: "Elevated chassis surface temp; CPU throttling observed during video playback & load",
      suggestedCheck: "Thermal graphite pad integrity, heat pipe vapor seal & dust fin clearance",
      whyImportant: "Thermal paste saturation or airflow obstruction forces emergency thermal shutdown to protect processor dies."
    },
    charging: {
      id: "charging",
      name: "Charging Subsystem",
      icon: Zap,
      score: 68,
      risk: "Medium",
      riskBadge: "Medium Risk",
      gradient: "amber",
      evidence: "Intermittent fast-charging handshake drops; cable connector wiggling required",
      suggestedCheck: "Type-C receptacle pin oxidation, lint debris compaction & PCB solder joint fatigue",
      whyImportant: "Poor power delivery negotiation causes voltage ripple, accelerating battery degradation and board stress."
    },
    storage: {
      id: "storage",
      name: "Storage & Memory (UFS 3.1)",
      icon: HardDrive,
      score: 87,
      risk: "Low",
      riskBadge: "Low Risk",
      gradient: "emerald",
      evidence: "Normal sequential read/write IOPS; zero uncorrectable NAND block errors",
      suggestedCheck: "SMART flash lifetime block allocation audit",
      whyImportant: "Storage subsystem is fully healthy; user device data is secure and completely recoverable."
    },
    display: {
      id: "display",
      name: "Display & Digitizer (AMOLED)",
      icon: Monitor,
      score: 94,
      risk: "Low",
      riskBadge: "Low Risk",
      gradient: "emerald",
      evidence: "Matrix fully responsive; uniform sub-pixel illumination with zero touch latency",
      suggestedCheck: "Display ribbon cable flex test & touch controller calibration",
      whyImportant: "High-value display assembly is 100% intact, maximizing device salvage & repair viability."
    },
    software: {
      id: "software",
      name: "Software & OS Kernel",
      icon: Cpu,
      score: 72,
      risk: "Moderate",
      riskBadge: "Moderate Risk",
      gradient: "cyan",
      evidence: "Recent OS firmware update coincided with rogue background process load",
      suggestedCheck: "Safe-mode boot diagnostic & power wakelock package audit",
      whyImportant: "Software optimizations can reclaim up to 25% battery life without hardware disassembly."
    }
  };

  const activeComp = componentDetails[selectedComponent] || componentDetails.battery;

  const handleDemoClick = () => {
    const demo = getDemoDevice();
    const existing = devices.find((d) => d.id === "EM-2026-1024");
    if (!existing) {
      diagnoseDevice(demo);
    }
    showToast("Loaded Samsung Galaxy S23 demo autopsy!", "info");
    navigate("/report/EM-2026-1024");
  };

  const processSteps = [
    { num: "01", name: "Symptoms", desc: "Report active hardware glitches & behavior" },
    { num: "02", name: "Evidence", desc: "Correlate drops, charging & software history" },
    { num: "03", name: "Probable Cause", desc: "Ranked pattern-based failure heuristics" },
    { num: "04", name: "Component Risk", desc: "Telemetry breakdown across 6 subsystems" },
    { num: "05", name: "Repairability", desc: "Economic evaluation (Repair vs Replace)" },
    { num: "06", name: "Recovery", desc: "Harvestable parts & data salvage check" },
    { num: "07", name: "Recommended Action", desc: "Action plan & 7 technician questions" }
  ];

  const failurePatterns = [
    {
      name: "Li-ion Internal Impedance Surge",
      rate: "38%",
      impact: "Voltage drops below 3.4V threshold under load, triggering instant shutdown.",
      status: "Very Common",
      color: "rose"
    },
    {
      name: "Thermal Interface Breakdown",
      rate: "24%",
      impact: "Dessicated thermal compound fails to conduct SoC heat to vapor chamber.",
      status: "Common",
      color: "amber"
    },
    {
      name: "USB-C Pin Solder Fatigue",
      rate: "19%",
      impact: "Micro-fractures from repeated cable insertion cause intermittent fast charge.",
      status: "Moderate",
      color: "cyan"
    },
    {
      name: "Rogue OS Wakelocks / Kernel Loops",
      rate: "12%",
      impact: "Background service prevents processor from entering low-power sleep states.",
      status: "Resolvable",
      color: "teal"
    },
    {
      name: "NAND Flash Cell Wear",
      rate: "7%",
      impact: "Exhausted write endurance blocks resulting in file system read-only mount.",
      status: "Infrequent",
      color: "violet"
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION WITH HARDWARE SCHEMATIC VISUAL               */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-[#06080D] border border-charcoal-800 shadow-panel">
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-charcoal-900/80 border border-teal-500/30 text-teal-300 text-xs font-mono font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
              </span>
              <span>E-Mortem</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">The Autopsy of Electronic Waste.</span>
              {isBackendConnected && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-sans font-semibold">
                  SQLite Live
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Before you repair it,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">
                understand it.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-teal-200/90 font-medium leading-relaxed">
              E-Mortem gives your failing electronics a digital second opinion. Describe the symptoms, investigate the evidence and make a smarter repair-or-replace decision.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Understand what may have happened, probable causes, component wear risk, salvageable parts/data, and exactly what to ask a repair technician before you spend money.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 transition-all shadow-glow-teal active:scale-95 group"
              >
                <Stethoscope className="w-4 h-4 text-slate-950" />
                <span>RUN E-MORTEM</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/monitoring"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-charcoal-900/90 hover:bg-charcoal-800 text-slate-200 border border-charcoal-700 transition-all"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>MONITOR A DEVICE</span>
              </Link>

              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>DEVICE SUDDENLY DIED?</span>
              </Link>

              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Demo Mode</span>
              </Link>
            </div>
          </div>

          {/* Hero Right: Subtle Animated Electronic Diagnostic Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl p-1 bg-gradient-to-b from-teal-500/30 via-charcoal-800 to-cyan-500/20 border border-teal-500/30 shadow-2xl flex items-center justify-center">
              {/* Inner device silhouette */}
              <div className="relative w-full h-full rounded-[22px] bg-charcoal-950 overflow-hidden p-5 flex flex-col justify-between">
                {/* Laser scan line moving across device */}
                <div className="ai-scan-line" />

                {/* Device top speaker bar */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-1.5 rounded-full bg-charcoal-800 mx-auto" />
                </div>

                {/* Circuit board telemetry graphics in center */}
                <div className="space-y-4 my-auto text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-full border border-teal-500/40 bg-teal-950/20 flex items-center justify-center shadow-inner">
                    <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border border-teal-400/30 animate-ping opacity-25" />
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-teal-400 tracking-wider uppercase block">
                      DIAGNOSTIC SCANNER
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      Samsung Galaxy S23
                    </span>
                  </div>

                  {/* Micro circuit status bars */}
                  <div className="space-y-2 px-3 text-left">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>BATTERY IMPEDANCE</span>
                        <span className="text-rose-400 font-semibold">HIGH (72%)</span>
                      </div>
                      <ProgressBar value={72} color="rose" showValue={false} height="h-1.5" />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>THERMAL LOAD</span>
                        <span className="text-amber-400 font-semibold">51% PEAK</span>
                      </div>
                      <ProgressBar value={51} color="amber" showValue={false} height="h-1.5" />
                    </div>
                  </div>
                </div>

                {/* Device bottom status */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-charcoal-800 pt-2">
                  <span>POSTMORTEM READY</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. THREE CONNECTED EXPERIENCES: MONITOR | DIAGNOSE | EMERGENCY */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Three Connected Experiences</span>
          </h2>
          <span className="text-[11px] font-mono text-teal-400">Continuous Lifecycle Protection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. MONITOR */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-charcoal-900 to-charcoal-950 border border-cyan-500/25 hover:border-cyan-400/50 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                🛡 01 &mdash; MONITOR
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Keep an eye on your devices.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Track early warning signs, battery degradation trajectories, and thermal stress while your hardware is still functioning.
              </p>
            </div>
            <Link
              to="/monitoring"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-glow-cyan"
            >
              <span>Start Monitoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. DIAGNOSE */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-charcoal-900 to-charcoal-950 border border-emerald-500/25 hover:border-emerald-400/50 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                🔍 02 &mdash; DIAGNOSE
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Something isn't right?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Tell E-Mortem what your device is doing. Receive ranked causes, component risk breakdown, and repair vs replace economics.
              </p>
            </div>
            <Link
              to="/diagnose"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-glow-teal"
            >
              <span>Run E-Mortem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3. EMERGENCY */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-charcoal-900 to-charcoal-950 border border-rose-500/25 hover:border-rose-400/50 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                🚨 03 &mdash; EMERGENCY
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Device suddenly died?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                Access its history from another phone, laptop, or browser. «The device may have died. The investigation doesn't.»
              </p>
            </div>
            <Link
              to="/emergency"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shadow-rose-500/20"
            >
              <span>Diagnose Failed Device</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PROMINENT DEVICE HEALTH OVERVIEW CARD                      */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-charcoal-800 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-[#070B10]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Device Health Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Samsung Galaxy S23
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Purchased March 2024 • Model SM-S911B • Diagnosis ID: <span className="font-mono text-cyan-300">EM-2026-1024</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status="Attention Required" size="md" />
            <button
              onClick={handleDemoClick}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 transition-all shadow-sm"
            >
              View Full E-Mortem →
            </button>
          </div>
        </div>

        {/* Big Health Score + 6 Subsystem Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          {/* Main Health Score Ring */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-charcoal-800 pb-6 lg:pb-0 pr-0 lg:pr-6">
            <ScoreRing
              score={64}
              size={120}
              strokeWidth={10}
              label="Health Score"
              sublabel="Electronic Integrity"
            />
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Overall Health Score
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                64 <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-amber-400 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Attention Required
              </p>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Preliminary model-based estimate
              </span>
            </div>
          </div>

          {/* 6 Subsystem Progress Bars */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.values(componentDetails).map((comp) => {
              const Icon = comp.icon;
              return (
                <div key={comp.id} className="p-3.5 rounded-xl bg-charcoal-900/70 border border-charcoal-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-charcoal-800 flex items-center justify-center text-teal-400 border border-charcoal-700/60">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">{comp.name.split(" ")[0]}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      comp.score < 50 ? "text-rose-400" : comp.score < 75 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {comp.score}%
                    </span>
                  </div>
                  <ProgressBar
                    value={comp.score}
                    max={100}
                    color={comp.gradient}
                    showValue={false}
                    height="h-2"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                    <span>Risk: <strong className={comp.risk === "High" ? "text-rose-400" : comp.risk === "Medium" ? "text-amber-400" : "text-emerald-400"}>{comp.risk}</strong></span>
                    <span className="truncate max-w-[140px] text-slate-500">{comp.suggestedCheck.split("&")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. DIGITAL AUTOPSY VISUALIZATION (Subsystem Forensics)         */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-charcoal-800 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-[#080C12]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Digital Autopsy Visualization</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Electronic Autopsy &mdash; Subsystem Forensics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any component node around the device to inspect telemetry evidence and diagnostic checks
            </p>
          </div>
          <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/30 self-start sm:self-center">
            Preliminary model-based estimate
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Component Grid */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              {Object.values(componentDetails).map((comp) => {
                const Icon = comp.icon;
                const isSelected = selectedComponent === comp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setSelectedComponent(comp.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? "bg-charcoal-900 border-teal-400 ring-2 ring-teal-400/30 shadow-lg shadow-teal-950/40"
                        : "bg-charcoal-900/60 border-charcoal-800 hover:border-charcoal-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "bg-charcoal-800 text-slate-400 border border-charcoal-700"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold font-mono ${
                        comp.score < 50 ? "text-rose-400" : comp.score < 75 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {comp.score}%
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      {comp.name.split(" ")[0]}
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-400">
                      <span>Risk:</span>
                      <span className={
                        comp.risk === "High" ? "text-rose-400 font-semibold" : comp.risk === "Medium" ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"
                      }>
                        {comp.risk}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Central Schematic Status Bar */}
            <div className="mt-4 p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 w-full max-w-xl flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                </span>
                ACTIVE INSPECTOR: <strong className="text-white">{activeComp.name}</strong>
              </span>
              <span className="text-teal-400">Click node to inspect</span>
            </div>
          </div>

          {/* Right: Selected Component Detailed Forensic Pane */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-charcoal-900/90 border border-charcoal-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  <activeComp.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {activeComp.name}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Preliminary Subsystem Telemetry
                  </span>
                </div>
              </div>

              <StatusBadge status={activeComp.riskBadge} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Observed Evidence
                </span>
                <p className="text-slate-200 bg-charcoal-950 p-2.5 rounded-xl border border-charcoal-800 font-sans leading-relaxed">
                  {activeComp.evidence}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block mb-1">
                  Suggested Diagnostic Check
                </span>
                <p className="text-slate-300 bg-charcoal-950 p-2.5 rounded-xl border border-charcoal-800 leading-relaxed font-mono text-[11px]">
                  ✓ {activeComp.suggestedCheck}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Why It Matters
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {activeComp.whyImportant}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 transition-all shadow-glow-teal"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examine in Full E-Mortem Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. DEVICE HEALTH TRENDS & TELEMETRY DEGRADATION               */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-charcoal-800 bg-charcoal-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Device Health Trends</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Telemetry Degradation Trajectory & Stress Patterns
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical performance slope calculated against 24 months of hardware operating history
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-charcoal-950 px-3 py-1.5 rounded-xl border border-charcoal-800">
            Degradation Rate: <strong className="text-amber-400 font-semibold">1.8% / mo</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trend Card 1: Battery Retention */}
          <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-rose-400" />
                <span>Battery Retention Slope</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">76% / 500 Cyc</span>
            </div>
            <ProgressBar value={76} color="rose" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Steep drop in voltage stability observed past month 20. Peak power delivery collapses during multi-app switching.
            </p>
          </div>

          {/* Trend Card 2: Thermal Efficiency */}
          <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Thermal Dissipation Index</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">61% Nominal</span>
            </div>
            <ProgressBar value={61} color="amber" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Chassis reaches 41.5°C within 12 minutes of heavy rendering. Indicates graphite sheet saturation and dust obstruction.
            </p>
          </div>

          {/* Trend Card 3: Storage & Logic Integrity */}
          <div className="p-4 rounded-2xl bg-charcoal-950/80 border border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>NAND Flash & Memory IO</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">92% Optimal</span>
            </div>
            <ProgressBar value={92} color="emerald" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Storage controller reports zero damaged memory blocks. User data, credentials, and app storage remain 100% secure.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. PLATFORM BENCHMARKS / DEMO INSIGHTS                        */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Diagnostic Platform Benchmarks
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-charcoal-800 text-teal-400 border border-charcoal-700">
            Demo Insights
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-charcoal-900/80 border border-charcoal-800">
            <span className="text-[11px] text-slate-400 block mb-1">Devices Diagnosed</span>
            <div className="text-2xl font-extrabold text-white">24</div>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">Active audits</span>
          </div>

          <div className="p-4 rounded-2xl bg-charcoal-900/80 border border-charcoal-800">
            <span className="text-[11px] text-slate-400 block mb-1">Potentially Repairable</span>
            <div className="text-2xl font-extrabold text-emerald-400">17</div>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">71% salvage rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-charcoal-900/80 border border-charcoal-800">
            <span className="text-[11px] text-slate-400 block mb-1">Repair Opportunities</span>
            <div className="text-2xl font-extrabold text-amber-400">11</div>
            <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">Component-level fixes</span>
          </div>

          <div className="p-4 rounded-2xl bg-charcoal-900/80 border border-charcoal-800">
            <span className="text-[11px] text-slate-400 block mb-1">Replacement Avoided</span>
            <div className="text-2xl font-extrabold text-cyan-300">₹1.42L</div>
            <span className="text-[10px] text-cyan-400/80 font-mono mt-1 block">Hardware CAPEX saved</span>
          </div>

          <div className="p-4 rounded-2xl bg-charcoal-900/80 border border-charcoal-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block mb-1">Most Common Issue</span>
            <div className="text-2xl font-extrabold text-white">Battery</div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">38% of all cases</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. YOUR DEVICE STORY (Visual Diagnostic Timeline)             */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-charcoal-800 bg-charcoal-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Your Device Story</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Samsung Galaxy S23 &mdash; Telemetry Progression
            </h3>
          </div>
          <span className="text-xs text-amber-300 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25">
            “Your device started showing symptoms 5 days ago.”
          </span>
        </div>

        {/* 7-Stage Chronological Breadcrumbs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { stage: "Purchased", sub: "March 2024", icon: Smartphone, color: "text-slate-400", border: "border-charcoal-800" },
            { stage: "Normal Usage", sub: "18 Months", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/30" },
            { stage: "Battery Drain", sub: "5 Days Ago", icon: Battery, color: "text-amber-400", border: "border-amber-500/40" },
            { stage: "Overheating", sub: "3 Days Ago", icon: Flame, color: "text-orange-400", border: "border-orange-500/40" },
            { stage: "Random Shutdown", sub: "2 Days Ago", icon: AlertTriangle, color: "text-rose-400", border: "border-rose-500/40" },
            { stage: "E-Mortem", sub: "Today", icon: Activity, color: "text-teal-400", border: "border-teal-500/40" },
            { stage: "Repair Viable", sub: "Battery Service", icon: ShieldCheck, color: "text-emerald-300", border: "border-emerald-400" }
          ].map((item, idx) => (
            <div
              key={item.stage}
              className={`p-3.5 rounded-2xl bg-charcoal-900/70 border ${item.border} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  {item.stage}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  {item.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. REPAIR VS REPLACE & POTENTIAL SAVINGS AVOIDED               */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-teal-500/25 bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-[#07110E]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold font-mono">
              <Scale className="w-3.5 h-3.5" />
              <span>Economic Viability Second Opinion</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Recommendation: <span className="text-teal-300">REPAIR FIRST</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              “Based on reported symptoms and secondary market valuation, investigating repair appears significantly more sensible than immediate replacement.”
            </p>

            {/* Visual Balance Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-teal-300 font-semibold">
                  ESTIMATED REPAIR: ₹1,500 – ₹3,000
                </span>
                <span className="text-slate-400">
                  CURRENT RESIDUAL VALUE: ₹18,000
                </span>
              </div>
              <div className="w-full bg-charcoal-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-teal-400 h-full w-[16%]" title="Repair cost (16% of value)" />
                <div className="bg-charcoal-700 h-full w-[84%]" title="Preserved equity (84%)" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                <span>Repair cost is only ~16% of fair device value</span>
                <span className="text-emerald-400 font-semibold">84% device equity preserved</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-charcoal-950/80 border border-teal-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase mb-1">
              Repairability Score
            </span>
            <div className="text-4xl font-black text-teal-300 mb-1">
              78 <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              High Repairability Viability
            </span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              Extends hardware lifespan +18–24 months
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 9. COMMON FAILURE PATTERNS & RECOVERY OPPORTUNITIES            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Common Failure Patterns */}
        <div className="lg:col-span-7 e-panel-elevated p-6 sm:p-7 rounded-3xl border-charcoal-800 bg-charcoal-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block mb-0.5">
                Heuristic Database
              </span>
              <h4 className="text-base font-bold text-white">
                Common Electronic Failure Patterns
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Sample of 1,200+ Cases
            </span>
          </div>

          <div className="space-y-2.5">
            {failurePatterns.map((pat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-charcoal-950/80 border border-charcoal-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{pat.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      pat.color === "rose" ? "text-rose-400 border-rose-500/30 bg-rose-500/10" :
                      pat.color === "amber" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                      pat.color === "cyan" ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" :
                      pat.color === "teal" ? "text-teal-400 border-teal-500/30 bg-teal-500/10" :
                      "text-violet-400 border-violet-500/30 bg-violet-500/10"
                    }`}>
                      {pat.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {pat.impact}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-slate-200 shrink-0">
                  {pat.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Opportunities & Salvage */}
        <div className="lg:col-span-5 e-panel-elevated p-6 sm:p-7 rounded-3xl border-charcoal-800 bg-charcoal-900/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  Component Salvage
                </span>
                <h4 className="text-base font-bold text-white">
                  Recovery & Harvest Opportunities
                </h4>
              </div>
              <Recycle className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Modular Battery Assembly</span>
                  <span className="text-teal-300 font-mono text-[11px]">Primary Fix</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Replacing just the 3900 mAh Li-ion cell resolves random shutdowns at ~16% of total device cost.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">AMOLED Display Panel</span>
                  <span className="text-emerald-400 font-mono text-[11px]">94% Intact</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  High-value sub-assembly is fully operational. Can be preserved through repair or harvested for ~₹6,500 parts equity.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">User Data & Storage (UFS)</span>
                  <span className="text-cyan-400 font-mono text-[11px]">100% Salvageable</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Memory partition healthy. Offline backups can be taken without requiring motherboard reflow.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/insights"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 transition-all border border-charcoal-700"
            >
              <span>Explore E-Waste Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 10. PROMINENT EMERGENCY INTAKE CALLOUT                        */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/30 via-charcoal-900 to-charcoal-950 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Cross-Device Continuity Engine</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              «The device may have died. The investigation doesn't.»
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If your phone, tablet, or laptop won't turn on or boot past the logo, don't worry. Your device profile and incident history are safely stored in your E-Mortem account. You can diagnose the dead device from another phone, laptop, or desktop browser right now.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> No physical connection needed
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Postmortem from any browser
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/emergency"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-lg shadow-rose-500/25 active:scale-95"
            >
              <span>Diagnose Failed Device →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 11. SUSTAINABILITY & WASTE PREVENTION IMPACT                  */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border-charcoal-800 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-[#08120E] flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Waste Prevention Impact</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Repair before replacement.
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            “Every device repaired is potentially one less device discarded prematurely.”
          </p>

          <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-2.5 font-mono text-xs">
            <div className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              The Sustainable Path
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-200">
              <span className="px-2.5 py-1 rounded-lg bg-charcoal-800 text-[11px]">Device Failure</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px]">E-Mortem Autopsy</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">Targeted Repair</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">+18–24 Mo Life</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px]">Zero Waste</span>
            </div>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400">
            🌱 Less e-waste. A healthier planet.
          </span>
          <Link
            to="/insights"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5"
          >
            <span>Explore E-Waste Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
