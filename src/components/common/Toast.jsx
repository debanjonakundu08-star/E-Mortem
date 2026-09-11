import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const typeStyles = {
    success: {
      border: "border-emerald-500/40",
      bg: "bg-[#0c1813]",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      text: "text-emerald-200"
    },
    error: {
      border: "border-rose-500/40",
      bg: "bg-[#1f0f13]",
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      text: "text-rose-200"
    },
    info: {
      border: "border-sky-500/40",
      bg: "bg-[#0b1622]",
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
      text: "text-sky-200"
    }
  }[toast.type || "success"];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${typeStyles.bg} ${typeStyles.border}`}
      >
        {typeStyles.icon}
        <div className="flex-1 text-sm font-medium text-slate-100">
          {toast.message}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
