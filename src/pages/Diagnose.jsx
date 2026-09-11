import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Monitor,
  Tv,
  Plug,
  Battery,
  PowerOff,
  RotateCw,
  Flame,
  Hourglass,
  Zap,
  Eye,
  Wifi,
  Volume2,
  Camera,
  HardDrive,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Activity,
  CheckCircle2,
  Calendar,
  DollarSign
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";
import ParallaxElement from "../components/effects/ParallaxElement";

export default function Diagnose() {
  const navigate = useNavigate();
  const { diagnoseDevice, showToast } = useProducts();

  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animIndex, setAnimIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    id: `EM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "Smartphone",
    brand: "",
    model: "",
    purchaseDate: "2024-03-15",
    purchasePrice: "",
    previousRepairs: "No",
    previousRepairDetails: "",
    currentCondition: "Frequently crashing",
    symptoms: ["battery_drain", "shutdown"],
    userStory: "",
    priorEvent: "No obvious event",
    priorEventDetails: "",
    followUpAnswers: {}
  });

  const deviceTypes = [
    { label: "Smartphone", icon: Smartphone },
    { label: "Laptop", icon: Laptop },
    { label: "Tablet", icon: Tablet },
    { label: "Headphones / Earbuds", icon: Headphones },
    { label: "Smartwatch", icon: Watch },
    { label: "Monitor", icon: Monitor },
    { label: "Television", icon: Tv },
    { label: "Other Electronics", icon: Plug }
  ];

  const conditionOptions = [
    {
      id: "Working with problems",
      title: "Working with problems",
      desc: "Device functions for basic tasks but exhibits noticeable quirks or errors."
    },
    {
      id: "Partially working",
      title: "Partially working",
      desc: "Key hardware (e.g. audio, camera, ports) is offline but OS boots."
    },
    {
      id: "Frequently crashing",
      title: "Frequently crashing",
      desc: "Shuts down, freezes, or reboots during routine day-to-day use."
    },
    {
      id: "Barely usable",
      title: "Barely usable",
      desc: "Must remain plugged into charger or freezes after 2 minutes."
    },
    {
      id: "Not working",
      title: "Not working",
      desc: "Completely dark / dead boot sequence."
    }
  ];

  const symptomList = [
    { id: "battery_drain", label: "Battery drains quickly", icon: Battery },
    { id: "shutdown", label: "Random shutdowns", icon: PowerOff },
    { id: "restart", label: "Unexpected restarts", icon: RotateCw },
    { id: "overheating", label: "Device overheating", icon: Flame },
    { id: "sluggish", label: "Device becoming slow", icon: Hourglass },
    { id: "charging", label: "Charging problems", icon: Zap },
    { id: "screen", label: "Screen problems", icon: Eye },
    { id: "network", label: "Network problems", icon: Wifi },
    { id: "audio", label: "Speaker / microphone problems", icon: Volume2 },
    { id: "camera", label: "Camera problems", icon: Camera },
    { id: "storage", label: "Storage problems", icon: HardDrive },
    { id: "physical", label: "Physical damage", icon: AlertTriangle },
    { id: "app_crash", label: "Apps crashing / freezing", icon: XCircle },
    { id: "other", label: "Other symptoms", icon: HelpCircle }
  ];

  const priorEvents = [
    "Device was dropped",
    "Device got wet",
    "Software update",
    "Installed new application",
    "Charging problem",
    "Battery gradually degraded",
    "Device became unusually hot",
    "No obvious event",
    "Other"
  ];

  const animationSteps = [
    "Examining reported symptoms…",
    "Reviewing device history…",
    "Comparing failure patterns…",
    "Evaluating component risk…",
    "Estimating repairability…",
    "Preparing E-Mortem Report…"
  ];

  // Quick Demo Autofill (Samsung Galaxy S23)
  const handleAutofillDemo = () => {
    setFormData({
      id: "EM-2026-1024",
      type: "Smartphone",
      brand: "Samsung",
      model: "Galaxy S23",
      purchaseDate: "2024-03-15",
      purchasePrice: "65000",
      previousRepairs: "No",
      previousRepairDetails: "",
      currentCondition: "Frequently crashing",
      symptoms: ["shutdown", "battery_drain", "overheating", "sluggish"],
      userStory: "Phone started shutting down randomly after becoming hot. Shuts down around 15% charge.",
      priorEvent: "Device was dropped",
      priorEventDetails: "The device was lightly dropped two weeks ago but continued functioning normally afterward.",
      followUpAnswers: {
        shutdownTrigger: "When battery is low",
        batteryDrainSpeed: "2–4 hours",
        heatingLocation: "Center/back",
        chargingBehavior: "Charges normally"
      }
    });
    showToast("Autofilled with Samsung Galaxy S23 demo case!", "info");
  };

  const toggleSymptom = (symId) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(symId);
      const updated = exists
        ? prev.symptoms.filter((s) => s !== symId)
        : [...prev.symptoms, symId];
      return { ...prev, symptoms: updated };
    });
  };

  const updateFollowUp = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      followUpAnswers: { ...prev.followUpAnswers, [key]: value }
    }));
  };

  const validateCurrentStep = () => {
    if (step === 2) {
      if (!formData.brand.trim()) {
        showToast("Please enter device brand (e.g. Samsung)", "error");
        return false;
      }
      if (!formData.model.trim()) {
        showToast("Please enter device model (e.g. Galaxy S23)", "error");
        return false;
      }
    } else if (step === 3) {
      if (formData.symptoms.length === 0) {
        showToast("Please select at least one symptom", "error");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runAnalysis = () => {
    if (!validateCurrentStep()) return;
    navigate("/diagnose/analyzing", { state: { formData } });
  };

  const stepsList = [
    { num: "01", name: "Device" },
    { num: "02", name: "Information" },
    { num: "03", name: "Symptoms" },
    { num: "04", name: "Prior Events" },
    { num: "05", name: "Investigation" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-mono font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Hardware Intake Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-slate-900 dark:text-white">Begin Your</span>
            <span className="text-gradient-aurora">E-Mortem</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            “Tell us what your device has been experiencing. We'll investigate the symptoms and generate a preliminary electronic postmortem.”
          </p>
        </div>

        <MagneticButton strength={0.25}>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-md shadow-teal-500/20 transition-all self-start sm:self-auto active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Try Demo (Galaxy S23)</span>
          </button>
        </MagneticButton>
      </div>

      {/* Progress Bar */}
      <div className="graveyard-card p-4">
        <div className="flex items-center justify-between">
          {stepsList.map((s, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <React.Fragment key={s.num}>
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => {
                    if (stepNum < step) setStep(stepNum);
                  }}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-emerald-500 text-white dark:text-slate-950 shadow-sm shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-emerald-50 dark:bg-emerald-500/20 border-2 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      isCurrent
                        ? "text-slate-900 dark:text-white font-semibold"
                        : isDone
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {s.name}
                  </span>
                </div>

                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      step > stepNum ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Content */}
      <div className="graveyard-card p-6 sm:p-8">
        {/* STEP 1: SELECT DEVICE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Step 1: Select Your Device Category
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Choose the hardware classification of the electronic device experiencing problems.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {deviceTypes.map((dt) => {
                const Icon = dt.icon;
                const isSelected = formData.type === dt.label;
                return (
                  <TiltCard
                    key={dt.label}
                    maxTilt={7}
                    glare={true}
                    glareColor={isSelected ? "rgba(16, 185, 129, 0.2)" : "rgba(6, 182, 212, 0.12)"}
                    glowBorder={true}
                    className="rounded-2xl"
                  >
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: dt.label })}
                      className={`w-full p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all ${
                        isSelected
                          ? "bg-teal-50/90 dark:bg-emerald-500/15 border-teal-500 dark:border-emerald-400 text-teal-800 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald"
                          : "bg-slate-50 dark:bg-charcoal-900/60 border-slate-200 dark:border-charcoal-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-charcoal-700"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${isSelected ? "bg-teal-100 dark:bg-emerald-500/20 text-teal-700 dark:text-emerald-300" : "bg-slate-200 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-center">{dt.label}</span>
                    </button>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DEVICE INFORMATION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Step 2: Device Information
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter manufacturer details, acquisition date, and prior repair history.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Brand (e.g. Samsung, Apple, Dell)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samsung"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Model (e.g. Galaxy S23, Inspiron 15)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Galaxy S23"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Date of Purchase
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Purchase Price (Approx. ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 dark:text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 74999"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg pl-8 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Previous Repairs Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Has this device been repaired previously?
              </label>
              <div className="flex items-center gap-3">
                {["No", "Yes"].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFormData({ ...formData, previousRepairs: opt })}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      formData.previousRepairs === opt
                        ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300"
                        : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {formData.previousRepairs === "Yes" && (
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    What was repaired? (e.g. Screen replaced, battery swap, charging pin fixed)
                  </label>
                  <input
                    type="text"
                    placeholder="Describe previous repairs..."
                    value={formData.previousRepairDetails}
                    onChange={(e) => setFormData({ ...formData, previousRepairDetails: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Current Condition */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Operational Condition
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {conditionOptions.map((opt) => {
                  const isSelected = formData.currentCondition === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, currentCondition: opt.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald"
                          : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SYMPTOMS & USER DESCRIPTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Step 3: What symptoms are you experiencing?
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select all hardware and operational anomalies currently affecting the device.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {symptomList.map((s) => {
                const Icon = s.icon;
                const isSelected = formData.symptoms.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate">{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Conversational Description Box */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Tell us what happened in your own words
              </label>
              <textarea
                rows={4}
                placeholder="“My phone was working normally until five days ago. It started heating while using social media, the battery began draining quickly, and yesterday it shut down even though the battery showed 40%.”"
                value={formData.userStory}
                onChange={(e) => setFormData({ ...formData, userStory: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 4: PRIOR EVENTS */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Step 4: What happened before the problem?
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Understanding the trigger event provides vital clues for isolating root causes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {priorEvents.map((evt) => {
                const isSelected = formData.priorEvent === evt;
                return (
                  <div
                    key={evt}
                    onClick={() => setFormData({ ...formData, priorEvent: evt })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-sm dark:shadow-glow-emerald"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{evt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Describe the specific event details
              </label>
              <textarea
                rows={3}
                placeholder="Provide context: Was it a high drop? Did water touch it? Did an update stall midway?"
                value={formData.priorEventDetails}
                onChange={(e) => setFormData({ ...formData, priorEventDetails: e.target.value })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 5: SMART CONTEXTUAL FOLLOW-UP QUESTIONS */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Step 5: Smart Follow-Up Investigation</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                E-Mortem generated these specific forensic inquiries tailored directly to your reported symptoms.
              </p>
            </div>

            <div className="space-y-4">
              {/* Question for Random Shutdown */}
              {formData.symptoms.includes("shutdown") && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>For: Random Shutdown</span>
                  </span>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    When does the shutdown usually happen?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "While charging",
                      "During heavy usage",
                      "When battery is low",
                      "Completely randomly",
                      "When device becomes hot"
                    ].map((ans) => {
                      const isSel = formData.followUpAnswers.shutdownTrigger === ans;
                      return (
                        <button
                          type="button"
                          key={ans}
                          onClick={() => updateFollowUp("shutdownTrigger", ans)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            isSel
                              ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question for Battery Drain */}
              {formData.symptoms.includes("battery_drain") && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5" />
                    <span>For: Battery Drain</span>
                  </span>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    How quickly does the battery drain?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Less than 2 hours",
                      "2–4 hours",
                      "4–8 hours",
                      "Slightly faster than normal"
                    ].map((ans) => {
                      const isSel = formData.followUpAnswers.batteryDrainSpeed === ans;
                      return (
                        <button
                          type="button"
                          key={ans}
                          onClick={() => updateFollowUp("batteryDrainSpeed", ans)}
                          className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                            isSel
                              ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question for Overheating */}
              {formData.symptoms.includes("overheating") && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>For: Overheating</span>
                  </span>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    Where does the device become hot?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Near camera",
                      "Near charging port",
                      "Center/back",
                      "Screen area",
                      "Entire device"
                    ].map((ans) => {
                      const isSel = formData.followUpAnswers.heatingLocation === ans;
                      return (
                        <button
                          type="button"
                          key={ans}
                          onClick={() => updateFollowUp("heatingLocation", ans)}
                          className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                            isSel
                              ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question for Charging Problems */}
              {formData.symptoms.includes("charging") && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>For: Charging Problems</span>
                  </span>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    What happens when you connect the charger?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Charges normally",
                      "Charges slowly",
                      "Charges intermittently",
                      "Does not charge",
                      "Shows charging but percentage does not increase"
                    ].map((ans) => {
                      const isSel = formData.followUpAnswers.chargingBehavior === ans;
                      return (
                        <button
                          type="button"
                          key={ans}
                          onClick={() => updateFollowUp("chargingBehavior", ans)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            isSel
                              ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question for Screen Problems */}
              {formData.symptoms.includes("screen") && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>For: Screen Problems</span>
                  </span>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                    What kind of display problem are you seeing?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Cracked screen",
                      "Black screen",
                      "Flickering",
                      "Lines on display",
                      "Touch not responding",
                      "Dead pixels"
                    ].map((ans) => {
                      const isSel = formData.followUpAnswers.screenIssue === ans;
                      return (
                        <button
                          type="button"
                          key={ans}
                          onClick={() => updateFollowUp("screenIssue", ans)}
                          className={`p-2.5 rounded-lg border text-center text-xs transition-all ${
                            isSel
                              ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 font-semibold"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Investigation Sequence Animation Overlay */}
            {isAnalyzing ? (
              <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-[#0A0E14] border border-emerald-500/40 text-center relative overflow-hidden shadow-2xl">
                <div className="ai-scan-line" />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4 animate-pulse">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                  Performing Electronic Postmortem...
                </h3>

                <div className="max-w-md mx-auto space-y-1.5 text-left py-2 text-xs">
                  {animationSteps.slice(0, animIndex + 1).map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700 mt-4">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${((animIndex + 1) / animationSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={runAnalysis}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 active:scale-[0.99] transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>🔍 Perform E-Mortem</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        {!isAnalyzing && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-6">
            {step > 1 ? (
              <MagneticButton strength={0.2}>
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </MagneticButton>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <MagneticButton strength={0.25}>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all shadow-md shadow-teal-500/20 active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            ) : (
              <MagneticButton strength={0.25}>
                <button
                  type="button"
                  onClick={runAnalysis}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all shadow-md shadow-teal-500/25 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🔍 Perform E-Mortem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
