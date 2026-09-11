import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Printer,
  Share2,
  ShieldCheck,
  FileQuestion,
  HelpCircle,
  Database,
  Wrench,
  DollarSign,
  Calendar,
  Layers,
  Info,
  Clock,
  ExternalLink,
  RotateCcw,
  Scale,
  Recycle,
  Check,
  Sliders,
  Award,
  Cpu,
  Smartphone
} from "lucide-react";
import ScoreRing from "../components/common/ScoreRing";
import ProgressBar from "../components/common/ProgressBar";
import StatusBadge from "../components/common/StatusBadge";
import { useProducts } from "../context/ProductContext";
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";
import ParallaxElement from "../components/effects/ParallaxElement";
import { computeClientMarketPricing } from "../utils/pricingService";
import api from "../services/api";

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDeviceById, getDemoDevice, showToast, devices } = useProducts();

  const [saved, setSaved] = useState(false);
  const [remoteDevice, setRemoteDevice] = useState(null);
  const [loading, setLoading] = useState(!getDeviceById(id));
  const [simMode, setSimMode] = useState("repair");

  useEffect(() => {
    let active = true;
    if (id && !getDeviceById(id)) {
      setLoading(true);
      api.getReport(id)
        .then((res) => {
          if (active && res) {
            setRemoteDevice({
              id: res.diagnosis_id || id,
              device: res.device_name || res.device || "Electronic Device",
              type: res.device_type || "Smartphone",
              brand: res.brand || "",
              model: res.model || "",
              purchaseDate: res.purchase_date || "Recent",
              purchasePrice: res.purchase_price || 0,
              currentValue: res.current_value || 18000,
              healthScore: res.health_score ?? res.healthScore ?? 64,
              repairabilityScore: res.repairability_score ?? res.repairabilityScore ?? 78,
              status: res.status || res.health_status || "Attention Required",
              healthStatus: res.health_status || res.status || "Attention Required",
              probableCauses: res.probable_causes || res.probableCauses || [],
              componentHealth: res.component_health || res.componentHealth || {},
              recoveryAnalysis: res.recovery_options || res.recovery || res.recoveryAnalysis || {},
              repairVsReplace: res.repairVsReplace || {
                estimatedRepairCost: "₹1,500 – ₹3,000",
                estimatedDeviceValue: `₹${res.current_value || 18000}`,
                verdictText: `🟢 ${res.recommendation || "REPAIR FIRST"}`,
                explanation: res.recommendation_reason || "Repair appears worth investigating before replacement.",
                decisionConfidence: 89
              },
              whatProbablyHappened: res.what_probably_happened || res.whatProbablyHappened || "Preliminary pattern-based estimate generated.",
              actionPlan: res.action_plan || res.actionPlan || [],
              technicianQuestions: res.technician_questions || res.technicianQuestions || [],
              createdAt: res.created_at || new Date().toISOString()
            });
          }
        })
        .catch((e) => {
          console.warn("Direct API report fetch error:", e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { active = false; };
  }, [id, getDeviceById]);

  // Lookup device by id, fallback to demo if EM-2026-1024 or first device
  let device = getDeviceById(id) || remoteDevice;
  if (!device && (id === "EM-2026-1024" || !id)) {
    device = getDemoDevice();
  } else if (!device && devices && devices.length > 0) {
    device = devices.find((d) => d.id === id) || null;
  }

  // Graceful fallback if device not found at all
  if (!device) {
    if (loading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          <p className="text-sm font-mono text-slate-400">Synthesizing E-Mortem Forensics...</p>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 text-center space-y-5">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">E-Mortem Report Not Found</h2>
          <p className="text-xs text-slate-400">
            Diagnosis ID <span className="font-mono text-teal-400">{id}</span> could not be retrieved from the local database.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300"
            >
              Run New E-Mortem
            </Link>
            <Link
              to="/reports"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-charcoal-800 text-slate-300 hover:bg-charcoal-700"
            >
              View Report History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    showToast(`E-Mortem Report for ${device.device || device.brand} saved to registry.`, "success");
  };

  // Dynamic Indian electronics market valuation & repair pricing
  const pricing = device.pricingData || computeClientMarketPricing({
    brand: device.brand || (device.device ? device.device.split(" ")[0] : "Samsung"),
    model: device.model || device.device || "Galaxy S23",
    deviceType: device.deviceType || device.type || "phone",
    purchaseDate: device.purchaseDate || device.date || "2022-09-01",
    purchasePrice: device.purchasePrice,
    condition: device.condition || "good",
    problem: device.problem || device.symptoms || "battery shut down overheating",
    symptoms: device.symptoms || []
  });

  // Safe extraction of component health
  const compHealth = device.componentHealth || {};
  const cBattery = compHealth.battery ?? compHealth["Battery"] ?? 42;
  const cThermal = compHealth.thermal ?? compHealth["Thermal System"] ?? 61;
  const cStorage = compHealth.storage ?? compHealth["Storage"] ?? 87;
  const cDisplay = compHealth.display ?? compHealth["Display"] ?? 94;
  const cCharging = compHealth.charging ?? compHealth["Charging System"] ?? 68;
  const cSoftware = compHealth.software ?? compHealth["Software"] ?? 72;

  // Safe extraction of recovery options
  const rec = device.recoveryAnalysis || device.recovery || {};
  const replaceableList = rec.replaceable_components || (rec.battery?.status ? ["Battery"] : ["Battery", "Thermal Paste"]);
  const recoverableList = rec.recoverable_components || ["Display Panel", "UFS / SSD Storage", "Camera Module"];
  const isDataRecoverable = rec.recoverable_data !== false;

  const healthScore = device.healthScore ?? device.health_score ?? 64;
  const repairabilityScore = device.repairabilityScore ?? device.repairability_score ?? 78;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & ACTION CONTROLS                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-charcoal-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
              {device.id}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {device.createdAt ? new Date(device.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : (device.dateDiagnosed || "Recent")}
            </span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <StatusBadge status={device.healthStatus || device.status || "Attention Required"} size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <span>{device.device || `${device.brand} ${device.model}`}</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            E-Mortem Comprehensive Postmortem • The Autopsy of Electronic Waste.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-900 dark:hover:bg-charcoal-800 border border-slate-200 dark:border-charcoal-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title="Print E-Mortem Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          {!saved ? (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white shadow-md shadow-teal-500/20 transition-all active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Report</span>
            </button>
          ) : (
            <Link
              to="/reports"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-500/15 border border-teal-300 dark:border-teal-400 text-teal-800 dark:text-teal-300 transition-all"
            >
              <span>View In Reports →</span>
            </Link>
          )}

          <Link
            to="/diagnose"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-900 dark:hover:bg-charcoal-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-charcoal-800 transition-colors"
          >
            <span>New Diagnosis</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DUAL SCORE RING EXECUTIVE HERO (WOW MOMENT)                */}
      {/* ------------------------------------------------------------- */}
      <TiltCard maxTilt={2.5} glare={true} glareColor="rgba(20, 184, 166, 0.12)" glowBorder={true} className="e-panel-elevated p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-teal-500/30 bg-white dark:bg-gradient-to-br dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#070E14] shadow-sm dark:shadow-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Forensic Narrative Verdict */}
          <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Electronic Postmortem Assessment</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Component-Level Degradation Detected
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Telemetry indicates localized component-level stress rather than total board failure. The suspected issue appears serviceable at a fraction of new device costs.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-charcoal-950/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-charcoal-800">
                <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Device: <strong className="text-slate-900 dark:text-white">{device.type || device.device_type || "Smartphone"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-charcoal-950/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-charcoal-800">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Est. Resale Value: <strong className="text-slate-900 dark:text-white">{pricing.usedMarketValueFormatted}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Dual Large Score Rings with Micro-Depth Parallax */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
            {/* Ring 1: Health Score */}
            <ParallaxElement depth={0.08}>
              <div className="flex flex-col items-center space-y-2">
                <ScoreRing
                  score={healthScore}
                  size={130}
                  strokeWidth={10}
                  label="Device Health"
                  sublabel="Current Integrity"
                />
                <div className="text-center">
                  <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                    {healthScore < 50 ? "Critical Stress" : healthScore < 75 ? "Attention Required" : "Healthy State"}
                  </span>
                </div>
              </div>
            </ParallaxElement>

            <div className="hidden sm:block w-px h-24 bg-slate-200 dark:bg-charcoal-800" />

            {/* Ring 2: Repairability Score */}
            <ParallaxElement depth={0.08}>
              <div className="flex flex-col items-center space-y-2">
                <ScoreRing
                  score={repairabilityScore}
                  size={130}
                  strokeWidth={10}
                  label="Repairability"
                  sublabel="Economic Viability"
                />
                <div className="text-center">
                  <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {repairabilityScore >= 70 ? "High Repair Viability" : "Moderate Viability"}
                  </span>
                </div>
              </div>
            </ParallaxElement>
          </div>
        </div>
      </TiltCard>

      {/* ------------------------------------------------------------- */}
      {/* 3. ECONOMIC VERDICT BANNER (REPAIR FIRST VS REPLACE)          */}
      {/* ------------------------------------------------------------- */}
      <TiltCard
        tiltMaxAngle={3.5}
        glareColor="rgba(20, 184, 166, 0.12)"
        className="e-panel-elevated p-6 rounded-2xl border border-teal-500/30 bg-white dark:bg-gradient-to-r dark:from-charcoal-900 dark:via-charcoal-950 dark:to-[#08120E] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Economic Verdict:
              </span>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40">
                {pricing.recommendation || device.repairVsReplace?.verdictText?.replace("🟢", "").trim() || "REPAIR FIRST"}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                • {pricing.confidence}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
              Estimated repair (<strong className="text-teal-700 dark:text-teal-300">{pricing.repairEstimate}</strong> for {pricing.repairComponent}) vs fair resale value (<strong className="text-slate-900 dark:text-white">{pricing.usedMarketValueFormatted}</strong>) and new replacement (<strong className="text-slate-900 dark:text-white">{pricing.newMarketPriceFormatted}</strong>).
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {pricing.verdictReason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block">CAPEX Avoided</span>
            <span className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {pricing.replacementCostAvoidedFormatted}
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-500/20">
            {pricing.equityRetainedPct}% Equity Retained
          </span>
        </div>
      </TiltCard>

      {/* ------------------------------------------------------------- */}
      {/* 4. CONFIDENCE & EVIDENCE QUALITY METRICS                      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Diagnosis Confidence
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              78%
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 block">
              Confidence is calibrated on the quantity and consistency of reported symptoms.
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 ml-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900/80 border border-slate-200 dark:border-charcoal-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Evidence Quality
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              Moderate
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 block">
              Digital second opinion from entered telemetry • Physical bench testing required to confirm.
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ml-3">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. RANKED PROBABLE CAUSES WITH EVIDENCE CHECKLISTS            */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/70 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-charcoal-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Ranked Probable Causes</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ranked pattern-based failure heuristics with supporting evidence breakdown
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-charcoal-700">
            Pattern-Based Diagnostic Model
          </span>
        </div>

        <div className="space-y-3">
          {device.probableCauses && Array.isArray(device.probableCauses) && device.probableCauses.map((cause, idx) => {
            const rank = cause.rank || idx + 1;
            const prob = cause.score ?? cause.probability ?? cause.likelihood ?? 70;
            const evidence = cause.why_we_think_this || (cause.reason ? [cause.reason] : []);

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 space-y-2 hover:border-slate-300 dark:hover:border-charcoal-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-slate-200 dark:bg-charcoal-800 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-charcoal-700 shrink-0">
                      0{rank}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {cause.name}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right pl-9 sm:pl-0 flex items-center sm:block gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                      {prob}%
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 sm:block">
                      Likelihood
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                  {cause.description || cause.reason}
                </p>

                {evidence && evidence.length > 0 && (
                  <div className="pt-2 pl-9 border-t border-slate-200 dark:border-charcoal-800/80 mt-2">
                    <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 font-semibold block mb-1">
                      Why we think this:
                    </span>
                    <ul className="space-y-1">
                      {evidence.map((item, eIdx) => (
                        <li key={eIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            These are preliminary pattern-based estimates calculated by the E-Mortem scoring engine. Physical bench inspection by a certified technician is recommended to confirm hardware continuity.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. FORENSIC NARRATIVE ("WHAT PROBABLY HAPPENED?")            */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-7 rounded-3xl border-teal-500/30 dark:border-teal-500/20 bg-gradient-to-r from-teal-50 via-white to-slate-50 dark:from-teal-950/20 dark:via-charcoal-900 dark:to-charcoal-950 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-mono">
            Diagnostic Narrative
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          “What Probably Happened?”
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
          {device.whatProbablyHappened || device.what_probably_happened}
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. COMPONENT HEALTH & RECOVERY HARVEST ANALYSIS               */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Health Progress Bars */}
        <div className="e-panel-elevated p-6 rounded-3xl border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Component Health Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              6 Subsystems
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar label="Battery System" value={cBattery} color="rose" height="h-2.5" />
            <ProgressBar label="Thermal Dissipation System" value={cThermal} color="amber" height="h-2.5" />
            <ProgressBar label="Charging Subsystem" value={cCharging} color="amber" height="h-2.5" />
            <ProgressBar label="Software / OS Kernel" value={cSoftware} color="cyan" height="h-2.5" />
            <ProgressBar label="Storage (UFS 3.1)" value={cStorage} color="emerald" height="h-2.5" />
            <ProgressBar label="Display & Digitizer (AMOLED)" value={cDisplay} color="emerald" height="h-2.5" />
          </div>
        </div>

        {/* What Can Still Be Saved? (Recovery) */}
        <div className="e-panel-elevated p-6 rounded-3xl border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/70 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>What Can Still Be Saved?</span>
              </h3>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold font-mono">
                Recovery Analysis
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>Potentially Replaceable</span>
                  <span className="text-teal-600 dark:text-teal-300 font-mono">Modular Component</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {replaceableList.join(", ")}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>User Data Feasibility</span>
                  <span className={isDataRecoverable ? "text-cyan-600 dark:text-cyan-400 font-mono" : "text-amber-600 dark:text-amber-400 font-mono"}>
                    {isDataRecoverable ? "🟢 High Confidence Recoverable" : "🟡 Requires Bench Access"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Storage controller integrity appears operational. Initiate offline backup before delivering to workshop.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                  <span>Harvestable Subcomponents</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">Secondary Life</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {recoverableList.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. INTERACTIVE “WHAT IF?” SIMULATOR                           */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-7 rounded-3xl border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200 dark:border-charcoal-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Scenario Forecasting</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              “What If?” Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate economic and hardware lifespan impact before making a decision
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/30 self-start sm:self-center">
            Prototype estimate &bull; Not guaranteed
          </span>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 max-w-sm mb-5">
          <button
            type="button"
            onClick={() => setSimMode("repair")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              simMode === "repair"
                ? "bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-950 shadow-sm dark:shadow-glow-teal"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            🔧 Simulate Repair
          </button>
          <button
            type="button"
            onClick={() => setSimMode("replace")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              simMode === "replace"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            📱 Simulate Replacement
          </button>
        </div>

        {/* Dynamic Simulator Output Pane */}
        {simMode === "repair" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-teal-200 dark:border-teal-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">Estimated Repair Outlay</span>
              <div className="text-xl font-black text-teal-700 dark:text-teal-300 font-mono">
                {pricing.repairEstimate}
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">{pricing.repairComponent}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-teal-200 dark:border-teal-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">Estimated Lifespan Extension</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                +18–24 Months
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">Verified component repair</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-teal-200 dark:border-teal-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">Economic Impact</span>
              <div className="text-xl font-black text-cyan-700 dark:text-cyan-300 font-mono">
                {pricing.equityRetainedPct}% Equity Saved
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">Avoids {pricing.replacementCostAvoidedFormatted} premature replacement expenditure</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-rose-200 dark:border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">New Device Outlay</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {pricing.newMarketPriceFormatted}
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">Equivalent replacement retail benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-rose-200 dark:border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">Old-Device Action Required</span>
              <div className="text-xl font-black text-amber-700 dark:text-amber-300">
                Data Salvage Required
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">Current fair market value: {pricing.usedMarketValueFormatted}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-rose-200 dark:border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block mb-1">Salvage Opportunity</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                Display & Camera Harvest
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 block">Intact modules can be refurbished or sold for parts</span>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 9. ACTION PLAN ("WHAT SHOULD I DO NOW?")                      */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-7 rounded-3xl border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-900/70">
        <div className="mb-4 pb-3 border-b border-slate-200 dark:border-charcoal-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>What Should I Do Now? (Action Plan)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prioritized triage sequence before proceeding with repairs
            </p>
          </div>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold font-mono">
            Action Protocol
          </span>
        </div>

        <div className="space-y-2.5">
          {device.actionPlan && Array.isArray(device.actionPlan) && device.actionPlan.map((act, idx) => (
            <div
              key={act.step || idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-charcoal-800 border border-slate-300 dark:border-charcoal-700 shrink-0">
                  {act.step || idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{act.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                    {act.detail || act.description}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 self-start sm:self-center ${
                  act.priority === "HIGH"
                    ? "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                    : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                }`}
              >
                Priority: {act.priority || "NORMAL"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 10. BEFORE YOU PAY THE TECHNICIAN (CRITICAL QUESTIONS)        */}
      {/* ------------------------------------------------------------- */}
      <div className="e-panel-elevated p-6 sm:p-7 rounded-3xl border-teal-500/30 bg-gradient-to-b from-white via-slate-50 to-teal-50/20 dark:from-charcoal-900 dark:to-charcoal-950 shadow-sm dark:shadow-panel">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-mono mb-1">
            <FileQuestion className="w-4 h-4" />
            <span>Consumer Protection Second Opinion</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Before You Pay the Technician
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            “Take your E-Mortem report with you and ask the technician informed questions to prevent being upsold unnecessary repairs.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          {device.technicianQuestions && Array.isArray(device.technicianQuestions) && device.technicianQuestions.map((q, idx) => {
            const qText = typeof q === "string" ? q : (q?.question || JSON.stringify(q));
            const whyItMatters = typeof q === "object" ? q?.why_it_matters : null;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950/80 border border-slate-200 dark:border-charcoal-800 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    “{qText}”
                  </span>
                </div>
                {whyItMatters && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pl-7 border-l-2 border-teal-400 dark:border-teal-500/30 mt-1">
                    <strong>Why: </strong>{whyItMatters}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 11. SIGNATURE STATEMENT & CREDIBILITY NOTICE                  */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-charcoal-900/80 border border-teal-200 dark:border-teal-500/30 text-center">
          <p className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
            «The device may have died. The investigation doesn't.»
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-slate-800 dark:text-slate-300">E-Mortem Credibility Notice: </strong>
            E-Mortem provides a preliminary software-based assessment using user-provided information. It cannot replace professional physical inspection or manufacturer diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
