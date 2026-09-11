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
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";
import ParallaxElement from "../components/effects/ParallaxElement";
import { computeClientMarketPricing } from "../utils/pricingService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { kpis, getDemoDevice, diagnoseDevice, showToast, devices, isBackendConnected } = useProducts();
  const [selectedComponent, setSelectedComponent] = useState("battery");

  const activeDevice = devices && devices.length > 0 ? devices[0] : null;
  const pricing = activeDevice?.pricingData || computeClientMarketPricing({
    brand: activeDevice?.brand || "Samsung",
    model: activeDevice?.model || "Galaxy S23",
    deviceType: activeDevice?.type || "Smartphone",
    ageYears: Number(activeDevice?.age) || 2.5,
    condition: activeDevice?.currentCondition || "Working with problems",
    symptoms: activeDevice?.symptoms || ["battery_drain", "shutdown"],
    purchasePrice: Number(activeDevice?.purchasePrice) || 74999
  });

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
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-white dark:bg-gradient-to-br dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#06080D] border border-slate-200 dark:border-charcoal-800 shadow-sm dark:shadow-panel group">
        {/* Luminous multi-color ambient glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-1/3 -right-12 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <ParallaxElement depth={0.05}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-charcoal-900/90 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-mono font-medium shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 dark:bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 dark:bg-teal-400" />
                </span>
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-violet-600 dark:from-teal-300 dark:via-cyan-300 dark:to-violet-400">
                  E-Mortem
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-slate-700 dark:text-slate-300">The Autopsy of Electronic Waste.</span>
                {isBackendConnected && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-sans font-bold border border-emerald-300 dark:border-emerald-500/30">
                    SQLite Live
                  </span>
                )}
              </div>
            </ParallaxElement>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Before you repair it,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 via-violet-500 to-emerald-400 dark:from-teal-300 dark:via-cyan-300 dark:via-violet-300 dark:to-emerald-400">
                understand it.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-teal-800 dark:text-teal-200/90 font-medium leading-relaxed">
              E-Mortem gives your failing electronics a digital second opinion. Describe the symptoms, investigate the evidence and make a smarter repair-or-replace decision.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Understand what may have happened, probable causes, component wear risk, salvageable parts/data, and exactly what to ask a repair technician before you spend money.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton strength={0.25}>
                <Link
                  to="/diagnose"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 transition-all shadow-md shadow-teal-500/20 active:scale-95 group"
                >
                  <Stethoscope className="w-4 h-4 text-white dark:text-slate-950" />
                  <span>RUN E-MORTEM</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Link
                  to="/monitoring"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-charcoal-900/90 hover:bg-slate-200 dark:hover:bg-charcoal-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-charcoal-700 transition-all"
                >
                  <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>MONITOR A DEVICE</span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Link
                  to="/emergency"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 transition-all"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>DEVICE SUDDENLY DIED?</span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 transition-all shadow-xs"
                >
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                  <span>Demo Mode</span>
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Hero Right: Animated Holographic Diagnostic Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard maxTilt={8} glare={true} glareColor="rgba(6, 182, 212, 0.2)" glowBorder={true} className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl p-1 bg-gradient-to-b from-teal-500/30 via-charcoal-800 to-violet-500/25 border border-teal-500/40 shadow-2xl flex items-center justify-center">
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
                  <ParallaxElement depth={0.15}>
                    <div className="relative mx-auto w-20 h-20 rounded-full border border-teal-500/40 bg-teal-950/20 flex items-center justify-center shadow-inner">
                      <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-25" />
                      <div className="absolute -inset-1 rounded-full border border-violet-500/20" />
                    </div>
                  </ParallaxElement>

                  <div>
                    <span className="text-[11px] font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 tracking-wider uppercase block font-bold">
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
            </TiltCard>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. THREE CONNECTED EXPERIENCES: MONITOR | DIAGNOSE | EMERGENCY */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Three Connected Experiences</span>
          </h2>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold">Continuous Lifecycle Protection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. MONITOR */}
          <TiltCard maxTilt={5} glare={true} className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-charcoal-900 dark:to-charcoal-950 border border-slate-200 dark:border-cyan-500/25 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xs dark:shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                🛡 01 &mdash; MONITOR
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Keep an eye on your devices.
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                Track early warning signs, battery degradation trajectories, and thermal stress while your hardware is still functioning.
              </p>
            </div>
            <Link
              to="/monitoring"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Start Monitoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </TiltCard>

          {/* 2. DIAGNOSE */}
          <TiltCard maxTilt={5} glare={true} className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-charcoal-900 dark:to-charcoal-950 border border-slate-200 dark:border-emerald-500/25 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xs dark:shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                🔍 02 &mdash; DIAGNOSE
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Something isn't right?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                Tell E-Mortem what your device is doing. Receive ranked causes, component risk breakdown, and repair vs replace economics.
              </p>
            </div>
            <Link
              to="/diagnose"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Run E-Mortem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </TiltCard>

          {/* 3. EMERGENCY */}
          <TiltCard maxTilt={5} glare={true} className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-charcoal-900 dark:to-charcoal-950 border border-slate-200 dark:border-rose-500/25 hover:border-rose-500/50 transition-all flex flex-col justify-between group shadow-xs dark:shadow-lg">
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-1">
                🚨 03 &mdash; EMERGENCY
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Device suddenly died?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                Access its history from another phone, laptop, or browser. «The device may have died. The investigation doesn't.»
              </p>
            </div>
            <Link
              to="/emergency"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-500/20"
            >
              <span>Diagnose Failed Device</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </TiltCard>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PROMINENT DEVICE HEALTH OVERVIEW CARD                      */}
      {/* ------------------------------------------------------------- */}
      <TiltCard maxTilt={3.5} glare={true} glareColor="rgba(20, 184, 166, 0.15)" glowBorder={true} className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-teal-500/25 bg-white dark:bg-gradient-to-br dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#070B10]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-charcoal-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Device Health Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Samsung Galaxy S23</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/30">
                SM-S911B
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Purchased March 2024 • Diagnosis ID: <span className="font-mono text-teal-700 dark:text-cyan-300 font-bold">EM-2026-1024</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status="Attention Required" size="md" />
            <MagneticButton strength={0.25}>
              <button
                onClick={handleDemoClick}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-500 hover:from-teal-400 hover:to-violet-400 text-white transition-all shadow-md shadow-teal-500/20 active:scale-95"
              >
                View Full E-Mortem →
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Big Health Score + 6 Subsystem Progress Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          {/* Main Health Score Ring with Micro-Depth Parallax */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-charcoal-800 pb-6 lg:pb-0 pr-0 lg:pr-6">
            <ParallaxElement depth={0.1}>
              <ScoreRing
                score={64}
                size={120}
                strokeWidth={10}
                label="Health Score"
                sublabel="Electronic Integrity"
              />
            </ParallaxElement>
            <div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase block">
                Overall Health Score
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                64 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
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
                <div key={comp.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-900/70 border border-slate-200 dark:border-charcoal-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-charcoal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-charcoal-700/60">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{comp.name.split(" ")[0]}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      comp.score < 50 ? "text-rose-600 dark:text-rose-400" : comp.score < 75 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
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
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>Risk: <strong className={comp.risk === "High" ? "text-rose-600 dark:text-rose-400" : comp.risk === "Medium" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}>{comp.risk}</strong></span>
                    <span className="truncate max-w-[140px] text-slate-500">{comp.suggestedCheck.split("&")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TiltCard>

      {/* ------------------------------------------------------------- */}
      {/* 4. DIGITAL AUTOPSY VISUALIZATION (Subsystem Forensics)         */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-gradient-to-br dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#080C12]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Digital Autopsy Visualization</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Electronic Autopsy &mdash; Subsystem Forensics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Click any component node around the device to inspect telemetry evidence and diagnostic checks
            </p>
          </div>
          <span className="text-[11px] font-mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-500/30 self-start sm:self-center">
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
                        ? "bg-teal-50/80 dark:bg-charcoal-900 border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/30 dark:ring-teal-400/30 shadow-md"
                        : "bg-slate-50 dark:bg-charcoal-900/60 border-slate-200 dark:border-charcoal-800 hover:border-slate-300 dark:hover:border-charcoal-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30" : "bg-slate-200 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-charcoal-700"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold font-mono ${
                        comp.score < 50 ? "text-rose-600 dark:text-rose-400" : comp.score < 75 ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {comp.score}%
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {comp.name.split(" ")[0]}
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span>Risk:</span>
                      <span className={
                        comp.risk === "High" ? "text-rose-600 dark:text-rose-400 font-semibold" : comp.risk === "Medium" ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-emerald-700 dark:text-emerald-400 font-semibold"
                      }>
                        {comp.risk}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Central Schematic Status Bar */}
            <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 w-full max-w-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 dark:bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 dark:bg-teal-400" />
                </span>
                ACTIVE INSPECTOR: <strong className="text-slate-900 dark:text-white">{activeComp.name}</strong>
              </span>
              <span className="text-teal-700 dark:text-teal-400 font-bold">Click node to inspect</span>
            </div>
          </div>

          {/* Right: Selected Component Detailed Forensic Pane */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-charcoal-900/90 border border-slate-200 dark:border-charcoal-800 space-y-4 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-charcoal-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <activeComp.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {activeComp.name}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Preliminary Subsystem Telemetry
                  </span>
                </div>
              </div>

              <StatusBadge status={activeComp.riskBadge} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Observed Evidence
                </span>
                <p className="text-slate-800 dark:text-slate-200 bg-white dark:bg-charcoal-950 p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-800 font-sans leading-relaxed">
                  {activeComp.evidence}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                  Suggested Diagnostic Check
                </span>
                <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-charcoal-950 p-2.5 rounded-xl border border-slate-200 dark:border-charcoal-800 leading-relaxed font-mono text-[11px]">
                  ✓ {activeComp.suggestedCheck}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Why It Matters
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {activeComp.whyImportant}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold transition-all shadow-md shadow-teal-500/20 active:scale-95"
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
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Device Health Trends</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Telemetry Degradation Trajectory & Stress Patterns
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Historical performance slope calculated against 24 months of hardware operating history
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-charcoal-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-charcoal-800">
            Degradation Rate: <strong className="text-amber-700 dark:text-amber-400 font-semibold">1.8% / mo</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trend Card 1: Battery Retention */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Battery Retention Slope</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">76% / 500 Cyc</span>
            </div>
            <ProgressBar value={76} color="rose" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Steep drop in voltage stability observed past month 20. Peak power delivery collapses during multi-app switching.
            </p>
          </div>

          {/* Trend Card 2: Thermal Efficiency */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Thermal Dissipation Index</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">61% Nominal</span>
            </div>
            <ProgressBar value={61} color="amber" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Chassis reaches 41.5°C within 12 minutes of heavy rendering. Indicates graphite sheet saturation and dust obstruction.
            </p>
          </div>

          {/* Trend Card 3: Storage & Logic Integrity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>NAND Flash & Memory IO</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">92% Optimal</span>
            </div>
            <ProgressBar value={92} color="emerald" showValue={false} height="h-2" />
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
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
          <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Diagnostic Platform Benchmarks
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-charcoal-800 text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-charcoal-700">
            Demo Insights
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <TiltCard maxTilt={6} glare={true} glareColor="rgba(6, 182, 212, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-cyan-500/25 dark:border-cyan-500/20 hover:border-cyan-500/50 shadow-xs transition-all">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Devices Diagnosed</span>
            <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">24</div>
            <span className="text-[10px] text-cyan-700 dark:text-cyan-400/80 font-mono mt-1 block font-semibold">Active audits</span>
          </TiltCard>

          <TiltCard maxTilt={6} glare={true} glareColor="rgba(16, 185, 129, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-emerald-500/25 dark:border-emerald-500/20 hover:border-emerald-500/50 shadow-xs transition-all">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Potentially Repairable</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">17</div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400/80 font-mono mt-1 block font-semibold">71% salvage rate</span>
          </TiltCard>

          <TiltCard maxTilt={6} glare={true} glareColor="rgba(139, 92, 246, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-violet-500/25 dark:border-violet-500/20 hover:border-violet-500/50 shadow-xs transition-all">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Repair Opportunities</span>
            <div className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">11</div>
            <span className="text-[10px] text-violet-700 dark:text-violet-400/80 font-mono mt-1 block font-semibold">Component-level fixes</span>
          </TiltCard>

          <TiltCard maxTilt={6} glare={true} glareColor="rgba(20, 184, 166, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-teal-500/25 dark:border-teal-500/20 hover:border-teal-500/50 shadow-xs transition-all">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Replacement Avoided</span>
            <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-300">₹1.42L</div>
            <span className="text-[10px] text-teal-700 dark:text-teal-400/80 font-mono mt-1 block font-semibold">Hardware CAPEX saved</span>
          </TiltCard>

          <TiltCard maxTilt={6} glare={true} glareColor="rgba(244, 63, 94, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-amber-500/25 dark:border-amber-500/20 hover:border-amber-500/50 shadow-xs col-span-2 sm:col-span-1 transition-all">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Most Common Issue</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">Battery</div>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono mt-1 block font-semibold">38% of all cases</span>
          </TiltCard>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. YOUR DEVICE STORY (Visual Diagnostic Timeline)             */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Your Device Story</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Samsung Galaxy S23 &mdash; Telemetry Progression
            </h3>
          </div>
          <span className="text-xs text-amber-800 dark:text-amber-300 font-mono bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-500/25">
            “Your device started showing symptoms 5 days ago.”
          </span>
        </div>

        {/* 7-Stage Chronological Breadcrumbs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { stage: "Purchased", sub: "March 2024", icon: Smartphone, color: "text-slate-500 dark:text-slate-400", border: "border-slate-200 dark:border-charcoal-800", glare: "rgba(148, 163, 184, 0.1)" },
            { stage: "Normal Usage", sub: "18 Months", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-300 dark:border-emerald-500/30", glare: "rgba(16, 185, 129, 0.15)" },
            { stage: "Battery Drain", sub: "5 Days Ago", icon: Battery, color: "text-amber-600 dark:text-amber-400", border: "border-amber-300 dark:border-amber-500/40", glare: "rgba(245, 158, 11, 0.15)" },
            { stage: "Overheating", sub: "3 Days Ago", icon: Flame, color: "text-orange-600 dark:text-orange-400", border: "border-orange-300 dark:border-orange-500/40", glare: "rgba(249, 115, 22, 0.15)" },
            { stage: "Random Shutdown", sub: "2 Days Ago", icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400", border: "border-rose-300 dark:border-rose-500/40", glare: "rgba(244, 63, 94, 0.15)" },
            { stage: "E-Mortem", sub: "Today", icon: Activity, color: "text-teal-600 dark:text-teal-400", border: "border-teal-300 dark:border-teal-500/40", glare: "rgba(20, 184, 166, 0.15)" },
            { stage: "Repair Viable", sub: "Battery Service", icon: ShieldCheck, color: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-400 dark:border-emerald-400", glare: "rgba(16, 185, 129, 0.2)" }
          ].map((item, idx) => (
            <TiltCard
              key={item.stage}
              maxTilt={7}
              glare={true}
              glareColor={item.glare}
              glowBorder={true}
              className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-900/70 border ${item.border} flex flex-col justify-between transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">0{idx + 1}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                  {item.stage}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 block">
                  {item.sub}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. REPAIR VS REPLACE & POTENTIAL SAVINGS AVOIDED               */}
      {/* ------------------------------------------------------------- */}
      <TiltCard maxTilt={3} glare={true} className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-white dark:bg-gradient-to-r dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#07110E] shadow-xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-bold font-mono">
                <Scale className="w-3.5 h-3.5" />
                <span>Economic Viability Second Opinion • {pricing.deviceName || "Active Device"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Recommendation: <span className="text-teal-700 dark:text-teal-300">{pricing.recommendation || "REPAIR FIRST"}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                {pricing.verdictReason || "Based on reported symptoms and secondary market valuation, investigating repair appears significantly more sensible than immediate replacement."}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-teal-500/20 text-center shrink-0 min-w-[160px]">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1">
                Repairability Score
              </span>
              <div className="text-3xl sm:text-4xl font-black text-teal-700 dark:text-teal-300 mb-1">
                {activeDevice?.repairabilityScore || 78} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ 100</span>
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                High Repairability Viability
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Extends lifespan +18–24 months
              </span>
            </div>
          </div>

          {/* 4 Dynamic Pricing Cards - Cyan, Violet, Teal, Emerald Spectrum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: CURRENT REPLACEMENT PRICE - Electric Cyan */}
            <TiltCard maxTilt={6} glare={true} glareColor="rgba(6, 182, 212, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/70 border border-cyan-500/30 hover:border-cyan-400/60 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
                  Current Market Price
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-300 font-mono">
                {pricing.newMarketPriceFormatted || `₹${Number(pricing.newMarketPrice || 54999).toLocaleString("en-IN")}`}
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                Same / equivalent new device
              </span>
            </TiltCard>

            {/* Card 2: ESTIMATED DEVICE VALUE - Royal Violet */}
            <TiltCard maxTilt={6} glare={true} glareColor="rgba(139, 92, 246, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/70 border border-violet-500/30 hover:border-violet-400/60 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-700 dark:text-violet-400 font-bold">
                  Estimated Device Value
                </span>
                <span className="text-[10px] font-mono text-violet-700 dark:text-violet-400 font-semibold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/20">Resale Fair</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-violet-600 dark:text-violet-300 font-mono">
                {pricing.usedMarketValueFormatted || `₹${Number(pricing.usedMarketValue || 24000).toLocaleString("en-IN")}`}
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-1">
                Based on age + condition ({pricing.costToValueRatioPct ? `~${pricing.costToValueRatioPct}% repair ratio` : "market curve"})
              </span>
            </TiltCard>

            {/* Card 3: ESTIMATED REPAIR - Vivid Teal */}
            <TiltCard maxTilt={6} glare={true} glareColor="rgba(20, 184, 166, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/70 border border-teal-500/30 hover:border-teal-400/60 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold">
                  Estimated Repair
                </span>
                <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-500/20">Targeted</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-300 font-mono">
                {pricing.repairEstimate || `₹${pricing.repairEstimateMin?.toLocaleString("en-IN")} – ₹${pricing.repairEstimateMax?.toLocaleString("en-IN")}`}
              </div>
              <span className="text-[11px] text-teal-800 dark:text-teal-300/90 block mt-1 truncate" title={pricing.repairComponent}>
                For this reported issue ({pricing.repairComponent?.split(" ")[0] || "Component"})
              </span>
            </TiltCard>

            {/* Card 4: POTENTIAL REPLACEMENT COST AVOIDED - Neon Emerald */}
            <TiltCard maxTilt={6} glare={true} glareColor="rgba(16, 185, 129, 0.15)" glowBorder={true} className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-400/40 dark:border-emerald-500/40 hover:border-emerald-400/80 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold">
                  Replacement Cost Avoided
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {pricing.replacementCostAvoidedFormatted || `₹${Number(pricing.replacementCostAvoided || 48000).toLocaleString("en-IN")}`}
              </div>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400/90 block mt-1 font-semibold">
                {pricing.equityRetainedPct || 84}% device equity preserved
              </span>
            </TiltCard>
          </div>

          {/* Visual Balance Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-slate-200 dark:bg-charcoal-800 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-teal-500 dark:bg-teal-400 h-full transition-all duration-700"
                style={{ width: `${Math.max(8, Math.min(60, pricing.costToValueRatioPct || 14))}%` }}
                title={`Repair cost (~${pricing.costToValueRatioPct || 14}% of value)`}
              />
              <div
                className="bg-emerald-500 dark:bg-emerald-600 h-full transition-all duration-700"
                style={{ width: `${Math.max(40, 100 - (pricing.costToValueRatioPct || 14))}%` }}
                title={`Preserved equity (${pricing.equityRetainedPct || 84}%)`}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Repair cost is ~{pricing.costToValueRatioPct || 14}% of fair device residual value</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{pricing.equityRetainedPct || 84}% device equity preserved</span>
            </div>
          </div>

          {/* Price Source / Last Checked Indicator Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 px-1 text-xs text-slate-500 dark:text-slate-400 font-mono border-t border-slate-200 dark:border-charcoal-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Price Benchmark Source:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {pricing.sources ? pricing.sources[0] : "Amazon India & Cashify Electronics Index"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-charcoal-700">
                Last Checked: {pricing.lastChecked || "March 2026"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20">
                {pricing.confidence || "High (Verified Model Benchmark)"}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* ------------------------------------------------------------- */}
      {/* 9. COMMON FAILURE PATTERNS & RECOVERY OPPORTUNITIES            */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Common Failure Patterns */}
        <div className="lg:col-span-7 e-panel-elevated p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-charcoal-800">
            <div>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-0.5">
                Heuristic Database
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Common Electronic Failure Patterns
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Sample of 1,200+ Cases
            </span>
          </div>

          <div className="space-y-2.5">
            {failurePatterns.map((pat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{pat.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      pat.color === "rose" ? "text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10" :
                      pat.color === "amber" ? "text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10" :
                      pat.color === "cyan" ? "text-cyan-800 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10" :
                      pat.color === "teal" ? "text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/10" :
                      "text-violet-700 dark:text-violet-400 border-violet-300 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10"
                    }`}>
                      {pat.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pat.impact}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 shrink-0">
                  {pat.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Opportunities & Salvage */}
        <div className="lg:col-span-5 e-panel-elevated p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-charcoal-800 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">
                  Component Salvage
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Recovery & Harvest Opportunities
                </h4>
              </div>
              <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">Modular Battery Assembly</span>
                  <span className="text-teal-700 dark:text-teal-300 font-mono text-[11px]">Primary Fix</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Replacing just the 3900 mAh Li-ion cell resolves random shutdowns at ~16% of total device cost.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">AMOLED Display Panel</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">94% Intact</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  High-value sub-assembly is fully operational. Can be preserved through repair or harvested for ~₹6,500 parts equity.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">User Data & Storage (UFS)</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-mono text-[11px]">100% Salvageable</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Memory partition healthy. Offline backups can be taken without requiring motherboard reflow.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <MagneticButton strength={0.2} className="w-full">
              <Link
                to="/insights"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-slate-200 transition-all border border-slate-200 dark:border-charcoal-700 hover:border-teal-500/40"
              >
                <span>Explore E-Waste Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 10. PROMINENT EMERGENCY INTAKE CALLOUT                        */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-3xl p-6 sm:p-8 bg-rose-50/80 dark:bg-gradient-to-r dark:from-rose-950/30 dark:via-charcoal-900 dark:to-charcoal-950 border border-rose-200 dark:border-rose-500/30 shadow-md dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-mono font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Cross-Device Continuity Engine</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              «The device may have died. The investigation doesn't.»
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              If your phone, tablet, or laptop won't turn on or boot past the logo, don't worry. Your device profile and incident history are safely stored in your E-Mortem account. You can diagnose the dead device from another phone, laptop, or desktop browser right now.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> No physical connection needed
              </span>
              <span className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Postmortem from any browser
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/emergency"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-500/25 active:scale-95"
            >
              <span>Diagnose Failed Device →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 11. SUSTAINABILITY & WASTE PREVENTION IMPACT                  */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-gradient-to-br dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#08120E] flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Waste Prevention Impact</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Repair before replacement.
          </h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            “Every device repaired is potentially one less device discarded prematurely.”
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-2.5 font-mono text-xs">
            <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              The Sustainable Path
            </div>
            <div className="flex flex-wrap items-center gap-2 text-slate-800 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-charcoal-800 text-[11px]">Device Failure</span>
              <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-[11px]">E-Mortem Autopsy</span>
              <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px]">Targeted Repair</span>
              <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px]">+18–24 Mo Life</span>
              <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-[11px]">Zero Waste</span>
            </div>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-200 dark:border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            🌱 Less e-waste. A healthier planet.
          </span>
          <Link
            to="/insights"
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1.5"
          >
            <span>Explore E-Waste Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
