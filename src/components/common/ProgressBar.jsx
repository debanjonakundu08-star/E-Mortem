import React from "react";

export default function ProgressBar({
  label,
  value = 0,
  max = 100,
  unit = "%",
  color = "emerald",
  showValue = true
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColors = {
    emerald: "bg-emerald-500 shadow-emerald-500/30",
    amber: "bg-amber-500 shadow-amber-500/30",
    orange: "bg-orange-500 shadow-orange-500/30",
    rose: "bg-rose-500 shadow-rose-500/30",
    sky: "bg-sky-500 shadow-sky-500/30"
  }[color] || "bg-emerald-500 shadow-emerald-500/30";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        {showValue && (
          <span className="font-semibold text-slate-100">
            {value}{unit}
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${barColors}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
