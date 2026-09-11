import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Cpu, Wrench } from "lucide-react";

export default function StatusBadge({ status, size = "md" }) {
  const norm = (status || "").toLowerCase();

  let config = {
    label: status || "Under Investigation",
    bg: "bg-slate-800",
    text: "text-slate-300",
    border: "border-slate-700",
    icon: AlertCircle
  };

  if (norm.includes("healthy") || norm.includes("repair first") || norm.includes("stable")) {
    config = {
      label: norm.includes("repair first") ? "Repair First" : "Healthy",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: CheckCircle2
    };
  } else if (norm.includes("attention") || norm.includes("warning") || norm.includes("investigate")) {
    config = {
      label: "Needs Attention",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      icon: AlertTriangle
    };
  } else if (norm.includes("high risk") || norm.includes("danger") || norm.includes("fail")) {
    config = {
      label: "High Risk",
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      icon: AlertCircle
    };
  } else if (norm.includes("recovery") || norm.includes("component")) {
    config = {
      label: "Component Recovery",
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
      icon: Cpu
    };
  }

  const IconComponent = config.icon;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <IconComponent className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{config.label}</span>
    </span>
  );
}
