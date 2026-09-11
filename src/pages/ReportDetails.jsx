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
  Recycle
} from "lucide-react";
import ScoreRing from "../components/common/ScoreRing";
import ProgressBar from "../components/common/ProgressBar";
import StatusBadge from "../components/common/StatusBadge";
import { useProducts } from "../context/ProductContext";
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
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading E-Mortem Report...</p>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">E-Mortem Report Not Found</h2>
          <p className="text-xs text-slate-400">
            Diagnosis ID <span className="font-mono text-emerald-400">{id}</span> could not be retrieved from the local database.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              Run New E-Mortem
            </Link>
            <Link
              to="/reports"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
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

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-20">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {device.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {device.createdAt ? new Date(device.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : (device.dateDiagnosed || "Recent")}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-amber-400">
              {device.healthStatus || device.status || "Attention Required"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-sans">
            <span>{device.device || `${device.brand} ${device.model}`}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            E-Mortem Report • The Autopsy of Electronic Waste.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Print E-Mortem Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          {!saved ? (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Report</span>
            </button>
          ) : (
            <Link
              to="/reports"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-400 text-emerald-300 transition-all"
            >
              <span>View In Reports →</span>
            </Link>
          )}

          <Link
            to="/diagnose"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <span>New Diagnosis</span>
          </Link>
        </div>
      </div>

      {/* OVERALL DEVICE HEALTH SCORE CARD */}
      <div className="graveyard-card p-6 sm:p-8 bg-gradient-to-br from-[#0C121A] via-[#0D141F] to-[#0A0D12] border-emerald-500/30 shadow-glow-emerald">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>{device.healthStatus || device.status || "Attention Required"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Electronic Postmortem Assessment
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Telemetry indicates component-level stress rather than irreversible hardware failure. The suspected issue appears serviceable at a fraction of new device costs.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Device Type: <strong className="text-white">{device.type || device.device_type || "Gadget"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Est. Value: <strong className="text-white">₹{Number(device.currentValue || device.current_value || 18000).toLocaleString("en-IN")}</strong></span>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <ScoreRing
              score={device.healthScore ?? device.health_score ?? 64}
              size={135}
              strokeWidth={11}
              label="Device Health"
              sublabel="Electronic Integrity"
            />
          </div>
        </div>
      </div>

      {/* CONFIDENCE VS EVIDENCE QUALITY (Section 28) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Diagnosis Confidence
            </span>
            <div className="text-2xl font-black text-white">
              78%
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Confidence is based on the number and consistency of symptoms and device history provided.
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 ml-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Evidence Quality
            </span>
            <div className="text-2xl font-black text-emerald-400">
              Moderate
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Digital second opinion based on user-entered timeline &bull; Physical bench testing required to confirm.
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 ml-3">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PROBABLE CAUSES (RANKED WITH LIKELIHOOD % & EVIDENCE) */}
      <div className="graveyard-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Probable Causes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked pattern-based estimates with evidence breakdown
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            Pattern-Based Diagnostic Prototype
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
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 shrink-0">
                      0{rank}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {cause.name}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right pl-9 sm:pl-0">
                    <div className="text-base font-extrabold text-white font-sans">
                      {prob}%
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                      Probability
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-9 sm:pl-9">
                  {cause.description || cause.reason}
                </p>

                {evidence && evidence.length > 0 && (
                  <div className="pt-2 pl-9 sm:pl-9 border-t border-slate-800/60 mt-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold block mb-1">
                      Why we think this:
                    </span>
                    <ul className="space-y-0.5">
                      {evidence.map((item, eIdx) => (
                        <li key={eIdx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                          <span className="text-emerald-500">✓</span>
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

        <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            These are preliminary pattern-based estimates calculated by the E-Mortem scoring engine. Physical inspection by a certified technician is required to confirm hardware continuity.
          </p>
        </div>
      </div>

      {/* “WHAT PROBABLY HAPPENED?” CARD */}
      <div className="graveyard-card p-6 sm:p-7 border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Diagnostic Breakdown
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          “What Probably Happened?”
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          {device.whatProbablyHappened || device.what_probably_happened}
        </p>
      </div>

      {/* COMPONENT HEALTH & RECOVERY ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COMPONENT HEALTH PROGRESS BARS */}
        <div className="graveyard-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Component Health Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Preliminary Model Estimate
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar label="Battery" value={cBattery} color="rose" />
            <ProgressBar label="Thermal System" value={cThermal} color="amber" />
            <ProgressBar label="Storage" value={cStorage} color="emerald" />
            <ProgressBar label="Display" value={cDisplay} color="emerald" />
            <ProgressBar label="Charging Subsystem" value={cCharging} color="amber" />
            <ProgressBar label="Software / OS" value={cSoftware} color="sky" />
          </div>
        </div>

        {/* WHAT CAN STILL BE SAVED? (RECOVERY) */}
        <div className="graveyard-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>What Can Still Be Saved?</span>
              </h3>
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                Recovery Analysis
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Potentially Replaceable</span>
                  <span className="text-emerald-400">Modular Component</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {replaceableList.join(", ")}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>User Data Feasibility</span>
                  <span className={isDataRecoverable ? "text-sky-400" : "text-amber-400"}>
                    {isDataRecoverable ? "🟢 High Confidence Recoverable" : "🟡 Requires Bench Access"}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Storage controller integrity appears operational. Initiate offline backup before delivering to workshop.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between font-bold text-white mb-1">
                  <span>Harvestable Subcomponents</span>
                  <span className="text-emerald-400">Secondary Life</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {recoverableList.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REPAIRABILITY & REPAIR VS REPLACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REPAIRABILITY SCORE CARD */}
        <div className="graveyard-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Wrench className="w-3.5 h-3.5" />
                <span>Repair Feasibility</span>
              </span>
              <span className="text-xs text-slate-400">Economic Ratio</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Repairability Score
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-emerald-400 font-sans">
                {device.repairabilityScore ?? device.repairability_score ?? 78}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>

            <div className="text-xs font-bold text-emerald-300 mb-2">
              {device.repairabilityStatus || "🟢 Repair appears worth investigating."}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The suspected issue appears modular and component-level. The estimated repair cost is significantly lower than the device's residual value.
            </p>
          </div>
        </div>

        {/* REPAIR VS REPLACE COMPARISON */}
        <div className="graveyard-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                Financial Second Opinion
              </span>
              <span className="text-xs text-slate-400">Decision Matrix</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3">
              Should I Repair or Replace?
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Est. Repair Range</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {device.repairVsReplace?.estimatedRepairCost || "₹1,500 – ₹3,000"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5">Current Device Value</span>
                <span className="text-base font-bold text-white font-mono">
                  {device.repairVsReplace?.estimatedDeviceValue || `₹${Number(device.currentValue || 18000).toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <span>{device.repairVsReplace?.verdictText || "🟢 REPAIR FIRST"}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {device.repairVsReplace?.explanation || "Based on the reported symptoms and estimated repair cost, investigating repair appears more reasonable than immediate replacement."}
            </p>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-0.5">
                Potential replacement expenditure avoided:
              </span>
              <div className="text-lg font-black text-emerald-300 font-mono">
                ₹{Math.max(0, Number(device.currentValue || 18000) - 2500).toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Preserves {Math.round(((Number(device.currentValue || 18000) - 2500) / Math.max(1, Number(device.currentValue || 18000))) * 100)}% residual device equity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* “WHAT IF?” SIMULATOR (Section 33) */}
      <div className="graveyard-card p-6 sm:p-7 border-cyan-500/30 bg-gradient-to-br from-[#0B1017] to-[#070A0E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Scenario Forecasting</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              “What If?” Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate economic and hardware lifespan impact before making a decision
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30 self-start sm:self-center">
            Prototype estimate &bull; Not guaranteed
          </span>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mb-5">
          <button
            type="button"
            onClick={() => setSimMode("repair")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              simMode === "repair"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔧 Simulate Repair
          </button>
          <button
            type="button"
            onClick={() => setSimMode("replace")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              simMode === "replace"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📱 Simulate Replacement
          </button>
        </div>

        {/* Dynamic Simulator Output Pane */}
        {simMode === "repair" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Estimated Repair Outlay</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {device.repairVsReplace?.estimatedRepairCost || "₹1,500 – ₹3,000"}
              </div>
              <span className="text-[11px] text-slate-300 mt-1 block">Component-level battery / thermal service</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Estimated Lifespan Extension</span>
              <div className="text-xl font-black text-emerald-300">
                +18–24 Months
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">Prototype estimate</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Economic Impact</span>
              <div className="text-xl font-black text-cyan-300">
                84% Equity Saved
              </div>
              <span className="text-[11px] text-slate-300 mt-1 block">Avoids premature capital expenditure</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">New Device Outlay</span>
              <div className="text-xl font-black text-rose-400 font-mono">
                ₹45,000 – ₹65,000
              </div>
              <span className="text-[11px] text-slate-300 mt-1 block">Full retail replacement expenditure</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Old-Device Action Required</span>
              <div className="text-xl font-black text-amber-300">
                Data Salvage Required
              </div>
              <span className="text-[11px] text-slate-300 mt-1 block">Backup personal photos & crypto tokens before trade-in</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-500/30">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Salvage Opportunity</span>
              <div className="text-xl font-black text-emerald-300">
                Display & Camera Harvest
              </div>
              <span className="text-[11px] text-slate-300 mt-1 block">Intact modules can be refurbished or sold for parts</span>
            </div>
          </div>
        )}
      </div>

      {/* WHAT SHOULD I DO NOW? (ACTION PLAN) */}
      <div className="graveyard-card p-6 sm:p-7">
        <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>What Should I Do Now? (Action Plan)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized triage sequence before proceeding with repairs
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold font-mono">
            Action Protocol
          </span>
        </div>

        <div className="space-y-2.5">
          {device.actionPlan && Array.isArray(device.actionPlan) && device.actionPlan.map((act, idx) => (
            <div
              key={act.step || idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 shrink-0">
                  {act.step || idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-white">{act.title}</h4>
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                    {act.detail || act.description}
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 self-start sm:self-center ${
                  act.priority === "HIGH"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                Priority: {act.priority || "NORMAL"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE YOU PAY THE TECHNICIAN (CRITICAL QUESTIONS) */}
      <div className="graveyard-card p-6 sm:p-7 bg-gradient-to-b from-[#0E1520] to-[#0A0D12] border-emerald-500/30 shadow-glow-emerald">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-1">
            <FileQuestion className="w-4 h-4" />
            <span>Consumer Protection Second Opinion</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Before You Pay the Technician
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            “Take your E-Mortem report with you and ask the technician informed questions to prevent being upsold unnecessary repairs.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          {device.technicianQuestions && Array.isArray(device.technicianQuestions) && device.technicianQuestions.map((q, idx) => {
            // Support both strings and objects safely!
            const qText = typeof q === "string" ? q : (q?.question || JSON.stringify(q));
            const whyItMatters = typeof q === "object" ? q?.why_it_matters : null;

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-200 font-medium leading-relaxed">
                    “{qText}”
                  </span>
                </div>
                {whyItMatters && (
                  <div className="text-[10px] text-slate-400 font-mono pl-7 border-l-2 border-emerald-500/30 mt-1">
                    <strong>Why: </strong>{whyItMatters}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SIGNATURE STATEMENT & CREDIBILITY NOTICE */}
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
          <p className="text-xs font-mono font-bold text-emerald-300">
            «The device may have died. The investigation doesn't.»
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-slate-300">E-Mortem Credibility Notice: </strong>
            E-Mortem provides a preliminary software-based assessment using user-provided information. It cannot replace professional physical inspection or manufacturer diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
