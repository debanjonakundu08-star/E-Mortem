import React, { useState, useMemo } from "react";
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
  Laptop,
  Headphones,
  Search,
  Sparkles,
  HelpCircle,
  Clock,
  Flame,
  Battery,
  HardDrive,
  Monitor,
  Scale,
  RefreshCw,
  PlusCircle,
  Compass,
  FileSpreadsheet,
  AlertOctagon
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

  const howItWorks = [
    {
      num: "01",
      title: "REPORT",
      desc: "Tell us what your device is doing, past maintenance history, and pre-failure incidents."
    },
    {
      num: "02",
      title: "INVESTIGATE",
      desc: "E-Mortem asks dynamic follow-up questions tailored specifically to your exact symptoms."
    },
    {
      num: "03",
      title: "AUTOPSY",
      desc: "The system analyzes failure patterns, component wear, and computes objective health scores."
    },
    {
      num: "04",
      title: "ACT",
      desc: "Repair, recover, refurbish, recycle or replace &mdash; armed with evidence and technician questions."
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION WITH GLOWING SCANNING VISUAL                   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0B1017] via-[#090D13] to-[#06090D] border border-cyan-500/20 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>E-Mortem</span>
              <span className="text-slate-600">•</span>
              <span>The Autopsy of Electronic Waste.</span>
              {isBackendConnected && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-sans font-semibold">
                  SQLite Live
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Before you repair it,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                understand it.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-cyan-300 font-medium leading-relaxed">
              E-Mortem gives your failing device a digital second opinion. Describe the symptoms, investigate the evidence and make a smarter repair-or-replace decision.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Understand what may have happened, probable causes, component wear risk, salvageable parts/data, and exactly what to ask a repair technician before you spend money.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 group"
              >
                <Stethoscope className="w-4 h-4 text-slate-950" />
                <span>RUN E-MORTEM</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/monitoring"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>MONITOR A DEVICE</span>
              </Link>

              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 transition-all"
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
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/50 to-emerald-500/20 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 flex items-center justify-center">
              {/* Inner device silhouette */}
              <div className="relative w-full h-full rounded-[22px] bg-[#070A0E] overflow-hidden p-5 flex flex-col justify-between">
                {/* Laser scan line moving across device */}
                <div className="ai-scan-line" />

                {/* Device top speaker bar */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-1.5 rounded-full bg-slate-800 mx-auto" />
                </div>

                {/* Circuit board telemetry graphics in center */}
                <div className="space-y-4 my-auto text-center">
                  <div className="relative mx-auto w-20 h-20 rounded-full border border-cyan-500/40 bg-cyan-950/20 flex items-center justify-center shadow-inner">
                    <Activity className="w-10 h-10 text-cyan-400 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-25" />
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase block">
                      DIAGNOSTIC SCANNER
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Samsung Galaxy S23
                    </span>
                  </div>

                  {/* Micro circuit status bars */}
                  <div className="space-y-1.5 px-3">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>BATTERY IMPEDANCE</span>
                      <span className="text-amber-400">HIGH (72%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[72%]" />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>THERMAL DISSIPATION</span>
                      <span className="text-amber-400">51% PEAK</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[51%]" />
                    </div>
                  </div>
                </div>

                {/* Device bottom status */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                  <span>POSTMORTEM READY</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1.5 THREE MAJOR CONNECTED EXPERIENCES: MONITOR | DIAGNOSE | EMERGENCY */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Three Connected Experiences</span>
          </h2>
          <span className="text-[11px] font-mono text-cyan-400">Account-Based Cloud Continuity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. MONITOR */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0E1520] to-[#0A0E14] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                🛡 01 &mdash; MONITOR
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Keep an eye on your devices.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Track warning signs, battery health trends, and thermal stress while your device is still working.
              </p>
            </div>
            <Link
              to="/monitoring"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Start Monitoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. DIAGNOSE */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0D1A16] to-[#08100E] border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                🔍 02 &mdash; DIAGNOSE
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Something isn't right?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Tell E-Mortem what your device is doing. Receive ranked causes, component risk breakdown, and repair vs replace economics.
              </p>
            </div>
            <Link
              to="/diagnose"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Run E-Mortem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3. EMERGENCY */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C0E14] to-[#11080C] border border-rose-500/30 hover:border-rose-400/60 transition-all flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                🚨 03 &mdash; EMERGENCY
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                Device suddenly died?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
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
      {/* 2. DASHBOARD TOP SECTION: LARGE DEVICE HEALTH OVERVIEW CARD    */}
      {/* ------------------------------------------------------------- */}
      <div className="graveyard-card p-6 sm:p-8 border-cyan-500/20 bg-gradient-to-br from-[#0C1118] via-[#090D13] to-[#080B0F] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Device Health Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Samsung Galaxy S23
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Purchased March 2024 • Model SM-S911B • Diagnosis ID: EM-2026-1024
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Attention Required
            </span>
            <button
              onClick={handleDemoClick}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-sm"
            >
              View Full E-Mortem →
            </button>
          </div>
        </div>

        {/* Big Health Score + 6 Animated Subsystem Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          {/* Main Health Score Ring */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 pr-0 lg:pr-6">
            <ScoreRing
              score={64}
              size={110}
              strokeWidth={9}
              label="Health Score"
              sublabel="Out of 100"
            />
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Overall Health Score
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                64 <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-amber-400 font-medium mt-1">
                🟡 Attention Required
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
                <div key={comp.id} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-cyan-400">
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
                    color={comp.score < 50 ? "rose" : comp.score < 75 ? "amber" : "emerald"}
                    showValue={false}
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Risk: <span className={comp.risk === "High" ? "text-rose-400 font-semibold" : comp.risk === "Medium" ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>{comp.risk}</span></span>
                    <span className="truncate max-w-[140px]">{comp.suggestedCheck.split("&")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2.5 SIGNATURE VISUAL: DIGITAL AUTOPSY VISUALIZATION (Section 12) */}
      {/* ------------------------------------------------------------- */}
      <div className="graveyard-card p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-[#0B1017] via-[#080D14] to-[#05080C] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
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
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30 self-start sm:self-center">
            Preliminary model-based estimate
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center: Stylized Circuit Board Device with Surrounding Component Nodes */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* 6 Subsystem Nodes Grid surrounding central silhouette */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              {Object.values(componentDetails).map((comp) => {
                const Icon = comp.icon;
                const isSelected = selectedComponent === comp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setSelectedComponent(comp.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-950"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold font-mono ${
                        comp.score < 50 ? "text-rose-400" : comp.score < 75 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {comp.score}%
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
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
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Central Schematic Banner */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 w-full max-w-xl flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ACTIVE INSPECTOR: <strong className="text-white">{activeComp.name}</strong>
              </span>
              <span className="text-cyan-400">Click node to inspect</span>
            </div>
          </div>

          {/* Right: Selected Component Detailed Forensic Evidence Pane */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0A0D12] border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
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

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                activeComp.risk === "High"
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : activeComp.risk === "Medium"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              }`}>
                {activeComp.riskBadge}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Observed Evidence
                </span>
                <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans leading-relaxed">
                  {activeComp.evidence}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  Suggested Diagnostic Check
                </span>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed font-mono text-[11px]">
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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examine in Full E-Mortem Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. DASHBOARD KPI CARDS (Clearly Labeled Demo Insights)         */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Diagnostic Platform Benchmarks
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
            Demo Insights
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Devices Diagnosed</span>
            <div className="text-2xl font-extrabold text-white">24</div>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Active audits</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Potentially Repairable</span>
            <div className="text-2xl font-extrabold text-emerald-400">17</div>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">71% salvage rate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Repair Opportunities</span>
            <div className="text-2xl font-extrabold text-amber-400">11</div>
            <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">Component-level fixes</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Replacement Avoided</span>
            <div className="text-2xl font-extrabold text-cyan-300">₹1.42L</div>
            <span className="text-[10px] text-cyan-400/80 font-mono mt-1 block">Hardware CAPEX saved</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block mb-1">Most Common Issue</span>
            <div className="text-2xl font-extrabold text-white">Battery</div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">38% of cases</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. "YOUR DEVICE STORY" SECTION (Visual Diagnostic Timeline)   */}
      {/* ------------------------------------------------------------- */}
      <div className="graveyard-card p-6 sm:p-7 border-slate-800/80 bg-[#0A0E14]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Your Device Story</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Samsung Galaxy S23 &mdash; Telemetry Progression
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/20">
            “Your device started showing symptoms 5 days ago.”
          </span>
        </div>

        {/* Timeline Progression Horizontal / Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative">
          {[
            { stage: "Purchased", sub: "March 2024", icon: Smartphone, color: "text-slate-400", border: "border-slate-800" },
            { stage: "Normal Usage", sub: "18 Months", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/30" },
            { stage: "Battery Drain", sub: "5 Days Ago", icon: Battery, color: "text-amber-400", border: "border-amber-500/40" },
            { stage: "Overheating", sub: "3 Days Ago", icon: Flame, color: "text-orange-400", border: "border-orange-500/40" },
            { stage: "Random Shutdown", sub: "2 Days Ago", icon: AlertTriangle, color: "text-rose-400", border: "border-rose-500/40" },
            { stage: "E-Mortem", sub: "Today", icon: Activity, color: "text-cyan-400", border: "border-cyan-500/40" },
            { stage: "Repair Viable", sub: "Battery Service", icon: ShieldCheck, color: "text-emerald-300", border: "border-emerald-400" }
          ].map((item, idx) => (
            <div
              key={item.stage}
              className={`p-3.5 rounded-xl bg-slate-900/60 border ${item.border} flex flex-col justify-between`}
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

      {/* ============================================================= */}
      {/* 5. RECENT E-MORTEM REPORT CARD (ID: EM-2026-1024)              */}
      {/* ============================================================= */}
      <div className="graveyard-card p-6 sm:p-7 border-slate-800/80 bg-gradient-to-br from-[#0B0F15] via-[#090D13] to-[#070A0F] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Recent E-Mortem Postmortem</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Samsung Galaxy S23 &mdash; Autopsy Summary
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Case ID: <span className="font-mono text-cyan-300">EM-2026-1024</span> • Diagnosed Today • Dual Heuristic Analysis
            </p>
          </div>

          <button
            onClick={handleDemoClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95 self-start sm:self-center"
          >
            <span>VIEW REPORT →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Scores Overview */}
          <div className="md:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Health Score</span>
              <div className="text-2xl font-black text-amber-400">64 / 100</div>
              <span className="text-[10px] text-amber-300 font-mono mt-1 block">Attention Required</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Repairability</span>
              <div className="text-2xl font-black text-emerald-400">78 / 100</div>
              <span className="text-[10px] text-emerald-300 font-mono mt-1 block">High Viability</span>
            </div>

            <div className="col-span-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">Economic Verdict:</span>
              <span className="text-xs font-mono font-bold text-emerald-400">REPAIR FIRST</span>
            </div>
          </div>

          {/* Top 3 Probable Causes */}
          <div className="md:col-span-8 space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Top Ranked Probable Causes
            </span>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-rose-500/10 text-rose-400 font-mono font-bold text-[11px] flex items-center justify-center">1</span>
                <div>
                  <div className="font-semibold text-white">Primary Battery Degradation & Internal Impedance</div>
                  <div className="text-[10px] text-slate-400">Chemical Li-ion breakdown causes voltage sag under current draw</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                High Risk (82%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold text-[11px] flex items-center justify-center">2</span>
                <div>
                  <div className="font-semibold text-white">Thermal Throttling & Vapor Chamber Saturation</div>
                  <div className="text-[10px] text-slate-400">SoC drops clock frequencies to avoid thermal junction breach</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                High Risk (76%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold text-[11px] flex items-center justify-center">3</span>
                <div>
                  <div className="font-semibold text-white">USB-C Receptacle Pin Oxidation & Lint Compaction</div>
                  <div className="text-[10px] text-slate-400">Power delivery negotiation fails intermittently during fast charging</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Medium (64%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 5.5 PROMINENT EMERGENCY INTAKE CARD                           */}
      {/* ============================================================= */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/40 via-[#130B10] to-[#0A0D12] border border-rose-500/40 shadow-2xl relative overflow-hidden">
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
      {/* 6. REPAIR VS REPLACE COMPARISON CARD                          */}
      {/* ------------------------------------------------------------- */}
      <div className="graveyard-card p-6 sm:p-8 border-emerald-500/30 bg-gradient-to-r from-[#09110E] via-[#0A1312] to-[#080E14]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <Scale className="w-3.5 h-3.5" />
              <span>Economic Viability Second Opinion</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Recommendation: <span className="text-emerald-400">REPAIR FIRST</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              “Based on the information provided, repair appears worth investigating.”
            </p>

            {/* Visual Balance Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-emerald-400 font-semibold">
                  ESTIMATED REPAIR: ₹1,500 – ₹3,000
                </span>
                <span className="text-slate-400">
                  CURRENT RESIDUAL VALUE: ₹18,000
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[16%]" title="Repair cost (16% of value)" />
                <div className="bg-slate-700/60 h-full w-[84%]" title="Remaining equity (84%)" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Repair cost is only ~16% of fair device value</span>
                <span>84% equity preserved</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 text-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase mb-1">
              Repairability Score
            </span>
            <div className="text-4xl font-black text-emerald-400 mb-1">
              78 <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-xs text-emerald-300 font-semibold">
              High Repairability Viability
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Extends device life 18–24 months
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. SIGNATURE VISUAL: ELECTRONIC POSTMORTEM FLOWCHART          */}
      {/* ------------------------------------------------------------- */}
      <div className="graveyard-card p-6 sm:p-8 border-cyan-500/20 bg-[#080C12]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Electronic Postmortem</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            What happened to your device?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            The signature E-Mortem diagnostic sequence that transforms symptoms into actionable evidence
          </p>
        </div>

        {/* 7-Stage Interactive Flowchart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {processSteps.map((step, idx) => (
            <div
              key={step.num}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 relative flex flex-col justify-between group hover:border-cyan-500/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                  {step.num}
                </span>
                <h4 className="text-xs font-bold text-white mb-1">
                  {step.name}
                </h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                {step.desc}
              </p>
              {idx < processSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 text-slate-600 group-hover:text-cyan-400 transition-colors">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. HOW IT WORKS (4 Large Stages)                              */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="mb-5">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Methodology
          </span>
          <h3 className="text-xl font-bold text-white">
            How E-Mortem Works
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {howItWorks.map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-2">
                  {item.num} &mdash; {item.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 8. E-MORTEM INTELLIGENCE & WASTE PREVENTION                   */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3 Metrics Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              E-Mortem Intelligence
            </span>
            <span className="text-[10px] font-mono text-slate-500">Benchmark Telemetry</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl font-black text-cyan-300">42%</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              of premature device replacements are caused by simple, replaceable battery degradation that users mistake for total motherboard failure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl font-black text-emerald-400">68%</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              of investigated components can be repaired or serviced for under 25% of the cost of buying a new replacement device.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors">
            <div className="text-2xl font-black text-amber-400">3x</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              higher repair quote accuracy when users bring E-Mortem technician questions to their local repair shop.
            </p>
          </div>
        </div>

        {/* Sustainability Flow */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-cyan-950/20 border border-emerald-500/20 flex flex-col justify-between shadow-xl">
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

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 font-mono text-xs">
              <div className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                The Sustainable Path
              </div>
              <div className="flex flex-wrap items-center gap-2 text-slate-200">
                <span className="px-2 py-1 rounded bg-slate-800 text-[11px]">Device Failure</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px]">E-Mortem Autopsy</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[11px]">Targeted Repair</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="px-2 py-1 rounded bg-emerald-900/40 text-emerald-200 text-[11px]">+18–24 Mo Life</span>
                <span className="text-slate-500">&rarr;</span>
                <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[11px]">Zero Waste</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-400">
              🌱 Less e-waste. A healthier planet.
            </span>
            <Link
              to="/insights"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <span>Explore E-Waste Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
