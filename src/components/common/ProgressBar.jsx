import React from "react";

export default function ProgressBar({
  label,
  value = 0,
  max = 100,
  unit = "%",
  color = "emerald",
  showValue = true,
  height = "h-2"
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColors = {
    emerald: "bg-gradient-to-r from-teal-500 to-emerald-400 shadow-sm shadow-emerald-500/20",
    cyan: "bg-gradient-to-r from-cyan-500 to-teal-400 shadow-sm shadow-cyan-500/20",
    amber: "bg-gradient-to-r from-amber-500 to-orange-400 shadow-sm shadow-amber-500/20",
    orange: "bg-gradient-to-r from-orange-500 to-amber-400 shadow-sm shadow-orange-500/20",
    rose: "bg-gradient-to-r from-rose-500 to-red-500 shadow-sm shadow-rose-500/20",
    violet: "bg-gradient-to-r from-indigo-500 to-violet-400 shadow-sm shadow-violet-500/20",
    sky: "bg-gradient-to-r from-sky-500 to-blue-400 shadow-sm shadow-sky-500/20"
  }[color] || "bg-gradient-to-r from-teal-500 to-emerald-400";

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
          {showValue && (
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${height} bg-slate-200 dark:bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColors}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
