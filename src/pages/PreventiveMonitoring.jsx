import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ShieldCheck, Battery, Flame, Zap, HardDrive, CheckCircle2, Clock, Plus, ArrowRight, TrendingDown } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import TiltCard from "../components/effects/TiltCard";
import MagneticButton from "../components/effects/MagneticButton";

export default function PreventiveMonitoring() {
  const navigate = useNavigate();
  const { devices, showToast } = useProducts();

  const [observations, setObservations] = useState([
    {
      id: 1,
      date: "Month 0 &mdash; Initial Setup",
      status: "Healthy",
      statusColor: "emerald",
      notes: "Device purchased new. Battery health 100%, cool charging, instant app launch.",
      score: 95
    },
    {
      id: 2,
      date: "Month 12 &mdash; Normal Use",
      status: "Battery Decline",
      statusColor: "cyan",
      notes: "Minor capacity loss noticed. SOT reduced from 8 hours to 6.5 hours. No thermal issues.",
      score: 84
    },
    {
      id: 3,
      date: "Month 18 &mdash; First Warning",
      status: "Overheating",
      statusColor: "amber",
      notes: "Device runs noticeably warm while charging or playing games. Fans/vapor chamber under load.",
      score: 72
    },
    {
      id: 4,
      date: "Month 22 &mdash; Active Glitches",
      status: "Frequent Shutdowns",
      statusColor: "orange",
      notes: "Shut down twice when battery reached 20% under camera use. Battery calibration drifting.",
      score: 64
    },
    {
      id: 5,
      date: "Month 24 &mdash; Pre-Failure Risk",
      status: "High Risk",
      statusColor: "rose",
      notes: "Shutdowns occurring daily. Full E-Mortem recommended to avoid complete motherboard stress.",
      score: 48
    }
  ]);

  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("Overheating");

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newLog = {
      id: Date.now(),
      date: "Just Now",
      status: newStatus,
      statusColor: newStatus === "Healthy" ? "emerald" : newStatus === "Overheating" ? "amber" : "rose",
      notes: newNote,
      score: newStatus === "Healthy" ? 90 : newStatus === "Overheating" ? 68 : 52
    };

    setObservations((prev) => [newLog, ...prev]);
    setNewNote("");
    showToast("Observation logged to hardware timeline.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Preventive Observation Protocol</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-slate-900 dark:text-white">Device Health</span>
          <span className="text-gradient-cyan-teal">Monitoring</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Periodically record physical observations while your device is still operational to detect early component wear before sudden death.
        </p>
      </div>

      {/* Observation Input Card */}
      <form onSubmit={handleAddLog} className="graveyard-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Log New Device Observation</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Condition Category</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Healthy">Healthy / Low Concern</option>
              <option value="Battery Decline">Battery Decline</option>
              <option value="Overheating">Overheating</option>
              <option value="Charging Anomaly">Charging Anomaly</option>
              <option value="Frequent Shutdowns">Frequent Shutdowns</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400">Observed Behavior & Notes</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Fan spins loudly during Zoom calls, device gets hot near charge port..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <MagneticButton strength={0.25}>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  Log Entry
                </button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </form>

      {/* Lifecycle Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Hardware Health Degradation Timeline</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Prototype Observation Model</span>
        </div>

        <div className="space-y-3">
          {observations.map((item) => (
            <TiltCard
              key={item.id}
              maxTilt={3.5}
              glare={true}
              glareColor="rgba(6, 182, 212, 0.1)"
              glowBorder={true}
              className="rounded-2xl"
            >
              <div
                className="graveyard-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 font-semibold" dangerouslySetInnerHTML={{ __html: item.date }} />
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.statusColor === "emerald"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                        : item.statusColor === "amber"
                        ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                        : item.statusColor === "rose"
                        ? "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                        : "bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {item.notes}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right font-mono">
                    <span className="text-lg font-black text-slate-900 dark:text-white">{item.score}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                  {item.score < 70 && (
                    <Link
                      to="/diagnose"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 transition-colors"
                    >
                      Diagnose Now →
                    </Link>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
