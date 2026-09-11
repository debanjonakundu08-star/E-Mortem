import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  trend,
  trendPositive = true,
  icon: Icon,
  accentColor = "emerald"
}) {
  const accentClasses = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    red: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    blue: "text-sky-400 bg-sky-500/10 border-sky-500/20"
  }[accentColor] || "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div className="graveyard-card p-5 relative overflow-hidden group hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${accentClasses}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
          {value}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <p className="truncate mr-2">{description}</p>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 font-medium whitespace-nowrap px-1.5 py-0.5 rounded text-[11px] ${
              trendPositive
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-rose-400 bg-rose-500/10"
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
