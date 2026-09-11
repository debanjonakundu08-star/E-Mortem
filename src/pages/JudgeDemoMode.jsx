import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles, Smartphone, Laptop, Headphones, Droplets, Battery, Flame, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function JudgeDemoMode() {
  const navigate = useNavigate();
  const { showToast } = useProducts();

  const demoCases = [
    {
      id: "case-1",
      title: "Smartphone — Battery Voltage Collapse",
      device: "Samsung Galaxy S23",
      type: "Smartphone",
      badge: "Flagship Phone",
      icon: Smartphone,
      color: "amber",
      symptoms: ["random_shutdown", "battery_drain", "overheating", "slow_performance"],
      description: "Phone started shutting down randomly when reaching ~15–20% charge. Shuts down immediately when opening the camera or loading heavy apps.",
      priorEvent: "Device was dropped",
      purchasePrice: 65000,
      currentValue: 18000,
      repairCost: 2500,
      history: { dropped: true, water_damage: false, software_update: true, charging_problem: true }
    },
    {
      id: "case-2",
      title: "Laptop — Thermal Throttling & Dust Clog",
      device: "Dell Inspiron 15 3520",
      type: "Laptop",
      badge: "Productivity Laptop",
      icon: Laptop,
      color: "orange",
      symptoms: ["overheating", "random_shutdown", "slow_performance"],
      description: "Fans spin loudly at 100% within 5 minutes of powering on. Device abruptly powers off during video calls due to CPU hitting 98°C thermal ceiling.",
      priorEvent: "Device became unusually hot",
      purchasePrice: 55000,
      currentValue: 14000,
      repairCost: 1500,
      history: { dropped: false, water_damage: false, software_update: false, charging_problem: false }
    },
    {
      id: "case-3",
      title: "Earbuds — Charge Case Pin Corrosion",
      device: "Sony WF-1000XM4",
      type: "Headphones",
      badge: "Wireless Audio",
      icon: Headphones,
      color: "purple",
      symptoms: ["charging_problem", "battery_drain"],
      description: "Right earbud fails to charge inside the cradle. Requires wiggling into place. Left earbud charges normally to 100%.",
      priorEvent: "Charging problem occurred",
      purchasePrice: 19990,
      currentValue: 7500,
      repairCost: 1200,
      history: { dropped: false, water_damage: false, software_update: false, charging_problem: true }
    },
    {
      id: "case-4",
      title: "Smartphone — Liquid Ingress & Corrosion",
      device: "Apple iPhone 13",
      type: "Smartphone",
      badge: "Water Ingress Case",
      icon: Droplets,
      color: "rose",
      symptoms: ["liquid_damage", "random_shutdown", "charging_problem"],
      description: "Splashed with rainwater 3 days ago. Phone boots intermittently, displays 'Liquid in Lightning Connector', and powers off after 1 minute.",
      priorEvent: "Got wet or exposed to liquid",
      purchasePrice: 69900,
      currentValue: 24000,
      repairCost: 7500,
      history: { dropped: false, water_damage: true, software_update: false, charging_problem: true }
    }
  ];

  const handleRunDemo = (demoCase) => {
    const payload = {
      id: `EM-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      type: demoCase.type,
      brand: demoCase.device.split(" ")[0],
      model: demoCase.device.split(" ").slice(1).join(" "),
      purchaseDate: "2024-02-15",
      purchasePrice: demoCase.purchasePrice,
      currentValue: demoCase.currentValue,
      repairCost: demoCase.repairCost,
      currentCondition: "Frequently crashing",
      symptoms: demoCase.symptoms,
      priorEvent: demoCase.priorEvent,
      userStory: demoCase.description,
      history: demoCase.history
    };

    showToast(`Loading Demo: ${demoCase.device}...`, "info");
    // Forward directly to the processing screen
    navigate("/diagnose/analyzing", { state: { formData: payload } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-20">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Evaluation Suite</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Demo Mode</span>
        </h1>
        <p className="text-sm text-slate-300">
          One-click evaluation profiles to verify dynamic heuristics without typing.
        </p>
      </div>

      {/* Grid of 4 Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {demoCases.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="graveyard-card p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        {c.badge}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {c.device}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
                    Est. ₹{c.repairCost.toLocaleString("en-IN")} Fix
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-200">
                  {c.title}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {c.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.symptoms.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Value: ₹{c.currentValue.toLocaleString("en-IN")}
                </span>
                <button
                  type="button"
                  onClick={() => handleRunDemo(c)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Live Demo →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
