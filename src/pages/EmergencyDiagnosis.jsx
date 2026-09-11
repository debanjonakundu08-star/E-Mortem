import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon, Flame, PowerOff, BatteryCharging, Droplets, ArrowRight, ShieldAlert, Sparkles, Smartphone, Laptop, Headphones } from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function EmergencyDiagnosis() {
  const navigate = useNavigate();
  const { devices, showToast } = useProducts();

  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || "");
  const [deviceModel, setDeviceModel] = useState("Samsung Galaxy S23");
  const [deviceType, setDeviceType] = useState("Smartphone");
  const [immediateEvent, setImmediateEvent] = useState("overheating_and_shut");
  const [wasCharging, setWasCharging] = useState(true);
  const [wasDropped, setWasDropped] = useState(false);
  const [hadLiquid, setHadLiquid] = useState(false);
  const [previousWarnings, setPreviousWarnings] = useState("Battery was draining faster than usual over the last week.");
  const [userNotes, setUserNotes] = useState("The screen suddenly went black while watching a video. The upper rear section felt very warm and it refused to boot even when connected to the charger.");

  const handleDeviceChange = (devId) => {
    setSelectedDeviceId(devId);
    const found = devices.find((d) => d.id === devId);
    if (found) {
      setDeviceModel(found.device || `${found.brand} ${found.model}`);
      setDeviceType(found.type || "Smartphone");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map symptoms
    const symptoms = [];
    if (immediateEvent.includes("shut")) symptoms.push("shutdown");
    if (immediateEvent.includes("heat")) symptoms.push("overheating");
    if (wasCharging) symptoms.push("charging_problem");
    if (hadLiquid) symptoms.push("liquid_damage");
    if (wasDropped) symptoms.push("screen_issue");
    symptoms.push("battery_drain");

    const payload = {
      id: `EM-FAIL-${Math.floor(1000 + Math.random() * 9000)}`,
      type: deviceType,
      brand: deviceModel.split(" ")[0] || "Generic",
      model: deviceModel.split(" ").slice(1).join(" ") || "Device",
      purchaseDate: "2024-01-15",
      purchasePrice: 65000,
      currentValue: 18000,
      repairCost: 2500,
      currentCondition: "Not working",
      symptoms: symptoms,
      priorEvent: hadLiquid ? "Device got wet" : wasDropped ? "Device was dropped" : "Device became unusually hot",
      userStory: `[EMERGENCY POSTMORTEM]: ${userNotes}. Previous warning signs: ${previousWarnings}`,
      history: {
        dropped: wasDropped,
        water_damage: hadLiquid,
        software_update: false,
        charging_problem: wasCharging
      }
    };

    showToast("Initiating Emergency Autopsy sequence...", "info");
    navigate("/diagnose/analyzing", { state: { formData: payload } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Emergency Diagnostic Protocol</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Device Suddenly Died?
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Access E-Mortem from another phone, laptop, or browser to investigate sudden device death.
        </p>
      </div>

      {/* Signature Statement Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-rose-100/30 dark:from-rose-950/30 dark:via-slate-900 dark:to-[#0A0D12] border border-rose-200 dark:border-rose-500/30 flex items-center justify-between gap-4 shadow-sm dark:shadow-none">
        <div className="space-y-1">
          <span className="text-xs font-mono text-rose-700 dark:text-rose-400 uppercase tracking-wider font-bold">
            Electronic Forensics Mandate
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            «The device may have died. The investigation doesn't.»
          </p>
        </div>
        <ShieldAlert className="w-10 h-10 text-rose-600 dark:text-rose-400 shrink-0 opacity-80" />
      </div>

      {/* Emergency Intake Form */}
      <form onSubmit={handleSubmit} className="graveyard-card p-6 sm:p-8 space-y-6">
        {/* Device Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
            Select Previously Saved Device or Enter New
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            >
              <option value="">-- Enter Custom Unresponsive Device --</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.device || `${d.brand} ${d.model}`} ({d.id})
                </option>
              ))}
            </select>

            <input
              type="text"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              placeholder="e.g. Samsung Galaxy S23"
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>
        </div>

        {/* Immediate Failure Circumstances */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
            What happened immediately before failure?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "overheating_and_shut", label: "Became Hot & Shut Down", icon: Flame },
              { id: "charging_stopped", label: "Was Plugged In & Died", icon: BatteryCharging },
              { id: "sudden_blackout", label: "Instant Black Screen / Freeze", icon: PowerOff }
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setImmediateEvent(opt.id)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  immediateEvent === opt.id
                    ? "bg-rose-50 dark:bg-rose-500/15 border-rose-400 text-rose-800 dark:text-rose-300 font-semibold"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <opt.icon className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Incident Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <label className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
            wasCharging
              ? "bg-rose-50 dark:bg-slate-900 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-white font-medium"
              : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            <input
              type="checkbox"
              checked={wasCharging}
              onChange={(e) => setWasCharging(e.target.checked)}
              className="accent-rose-500"
            />
            <span>Was charging at failure</span>
          </label>

          <label className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
            wasDropped
              ? "bg-rose-50 dark:bg-slate-900 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-white font-medium"
              : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            <input
              type="checkbox"
              checked={wasDropped}
              onChange={(e) => setWasDropped(e.target.checked)}
              className="accent-rose-500"
            />
            <span>Dropped recently</span>
          </label>

          <label className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs ${
            hadLiquid
              ? "bg-rose-50 dark:bg-slate-900 border-rose-300 dark:border-rose-500/40 text-slate-900 dark:text-white font-medium"
              : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            <input
              type="checkbox"
              checked={hadLiquid}
              onChange={(e) => setHadLiquid(e.target.checked)}
              className="accent-rose-500"
            />
            <span>Exposed to water / moisture</span>
          </label>
        </div>

        {/* Warning Signs */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
            Were there previous warning signs in recent days?
          </label>
          <input
            type="text"
            value={previousWarnings}
            onChange={(e) => setPreviousWarnings(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
            Final Moments Description (In Your Words)
          </label>
          <textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-400 text-white dark:text-slate-950 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Diagnose Failed Device →</span>
        </button>
      </form>
    </div>
  );
}
