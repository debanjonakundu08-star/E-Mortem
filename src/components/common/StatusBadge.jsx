import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Cpu, Wrench, Shield, RefreshCw } from "lucide-react";

export default function StatusBadge({ status, size = "md", showDot = true }) {
  const norm = (status || "").toLowerCase();

  let config = {
    label: status || "Under Investigation",
    bg: "bg-slate-100 dark:bg-charcoal-800/70",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700/60",
    dot: "bg-slate-500 dark:bg-slate-400",
    icon: AlertCircle
  };

  if (norm.includes("healthy") || norm.includes("stable") || norm.includes("optimal") || norm.includes("passed")) {
    config = {
      label: "Healthy & Stable",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-500/25",
      dot: "bg-emerald-500 dark:bg-emerald-400",
      icon: CheckCircle2
    };
  } else if (norm.includes("repair first") || norm.includes("repairable") || norm.includes("repair viable")) {
    config = {
      label: "Repair First",
      bg: "bg-teal-50 dark:bg-teal-500/15",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-300 dark:border-teal-500/30",
      dot: "bg-teal-500 dark:bg-teal-400",
      icon: Wrench
    };
  } else if (norm.includes("attention") || norm.includes("warning") || norm.includes("investigate") || norm.includes("moderate")) {
    config = {
      label: "Attention Required",
      bg: "bg-amber-50 dark:bg-amber-500/15",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-500/30",
      dot: "bg-amber-500 dark:bg-amber-400",
      icon: AlertTriangle
    };
  } else if (norm.includes("high risk") || norm.includes("danger") || norm.includes("fail") || norm.includes("critical")) {
    config = {
      label: "High Risk",
      bg: "bg-rose-50 dark:bg-rose-500/15",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-300 dark:border-rose-500/30",
      dot: "bg-rose-500 dark:bg-rose-400",
      icon: AlertCircle
    };
  } else if (norm.includes("recovery") || norm.includes("component") || norm.includes("salvage")) {
    config = {
      label: "Component Recovery",
      bg: "bg-violet-50 dark:bg-violet-500/15",
      text: "text-violet-700 dark:text-violet-300",
      border: "border-violet-300 dark:border-violet-500/30",
      dot: "bg-violet-500 dark:bg-violet-400",
      icon: Cpu
    };
  } else if (norm.includes("monitoring") || norm.includes("active") || norm.includes("live")) {
    config = {
      label: status || "Monitoring Active",
      bg: "bg-cyan-50 dark:bg-cyan-500/15",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "border-cyan-300 dark:border-cyan-500/30",
      dot: "bg-cyan-500 dark:bg-cyan-400",
      icon: Shield
    };
  } else if (norm.includes("replace") || norm.includes("recycle")) {
    config = {
      label: norm.includes("recycle") ? "Responsible Recycle" : "Replace Advised",
      bg: "bg-orange-50 dark:bg-orange-500/15",
      text: "text-orange-800 dark:text-orange-300",
      border: "border-orange-300 dark:border-orange-500/30",
      dot: "bg-orange-500 dark:bg-orange-400",
      icon: RefreshCw
    };
  }

  const IconComponent = config.icon;
  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-[11px] gap-1.5"
    : size === "lg"
    ? "px-3 py-1.5 text-xs sm:text-sm gap-2"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-xs tracking-tight ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${config.dot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </span>
      )}
      <IconComponent className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span className="font-semibold">{config.label}</span>
    </span>
  );
}
