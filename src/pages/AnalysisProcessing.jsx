import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Activity, CheckCircle2, AlertTriangle, RotateCcw, ArrowLeft, ShieldCheck, Sparkles, Cpu } from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function AnalysisProcessing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnoseDevice } = useProducts();

  // Retrieve form data from navigation state or sessionStorage
  const [formData, setFormData] = useState(() => {
    if (location.state?.formData) {
      try {
        sessionStorage.setItem("e_mortem_pending_form", JSON.stringify(location.state.formData));
      } catch (e) {}
      return location.state.formData;
    }
    try {
      const stored = sessionStorage.getItem("e_mortem_pending_form");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(null);
  const hasExecutedRef = useRef(false);

  const analysisSteps = [
    "Reading device history",
    "Reviewing reported symptoms",
    "Identifying symptom patterns",
    "Evaluating component risks",
    "Estimating repairability",
    "Checking recovery opportunities",
    "Preparing your second opinion"
  ];

  useEffect(() => {
    if (!formData) {
      setError("No device information was found to analyze. Please fill in the device form first.");
      return;
    }

    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    // 1. Step animation ticker
    const interval = setInterval(() => {
      setCurrentStepIndex((idx) => {
        if (idx < analysisSteps.length - 1) return idx + 1;
        clearInterval(interval);
        return idx;
      });
    }, 550);

    // 2. Concurrently call backend API and ensure a minimum 3.8s animation
    const startTime = Date.now();

    diagnoseDevice(formData)
      .then(async (report) => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 3800 - elapsed);
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
        clearInterval(interval);
        setCurrentStepIndex(analysisSteps.length - 1);
        setIsDone(true);

        // Clean up sessionStorage
        try {
          sessionStorage.removeItem("e_mortem_pending_form");
        } catch (e) {}

        setTimeout(() => {
          navigate(`/report/${report.id || report.diagnosis_id || "EM-2026-1024"}`);
        }, 600);
      })
      .catch((err) => {
        clearInterval(interval);
        console.error("[E-Mortem Analysis Failed]:", err);
        setError(err.message || "Something went wrong while connecting to the diagnostic engine.");
      });

    return () => clearInterval(interval);
  }, [formData, diagnoseDevice, navigate]);

  const handleRetry = () => {
    setError(null);
    hasExecutedRef.current = false;
    setCurrentStepIndex(0);
    setIsDone(false);
  };

  // Error State: Under NO circumstances show a blank white screen
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 text-center shadow-xl dark:shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              E-Mortem couldn't complete the analysis
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Something went wrong while processing your device information.
            </p>
            <p className="text-[11px] font-mono text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-slate-950 p-2.5 rounded-lg border border-rose-200 dark:border-slate-800">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/diagnose")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Device Details</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Processing Screen
  const progressPct = Math.min(100, Math.round(((currentStepIndex + 1) / analysisSteps.length) * 100));

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-[#0B1017] dark:to-[#070A0E] border border-cyan-200 dark:border-cyan-500/40 shadow-xl dark:shadow-2xl relative overflow-hidden text-center space-y-7">
        {/* Laser scanline animation */}
        <div className="ai-scan-line" />

        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Pulsing Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-300 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-cyan-950/50">
          <Activity className="w-10 h-10 animate-pulse text-cyan-600 dark:text-cyan-400" />
          <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-ping opacity-25" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5 relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold block">
            E-Mortem Telemetry Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performing E-Mortem
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Analyzing the evidence you provided...
          </p>
        </div>

        {/* Animated Checkmarks Sequence */}
        <div className="max-w-md mx-auto space-y-2 text-left py-2 relative z-10">
          {analysisSteps.map((stepText, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs font-mono transition-all duration-300 ${
                  isCompleted ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-600 opacity-40"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white dark:text-slate-950 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? "✓" : ""}
                </div>
                <span className={isCurrent ? "font-bold text-cyan-700 dark:text-cyan-300" : ""}>
                  {stepText}
                </span>
                {isCurrent && !isDone && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 relative z-10">
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Synthesis In Progress</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{progressPct}%</span>
          </div>
        </div>

        {/* Signature Statement */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          «The device may have died. The investigation doesn't.»
        </div>
      </div>
    </div>
  );
}
