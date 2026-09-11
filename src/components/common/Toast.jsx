import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const typeStyles = {
    success: {
      border: "border-emerald-300 dark:border-emerald-500/40",
      bg: "bg-emerald-50 dark:bg-[#0c1813]",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      text: "text-emerald-900 dark:text-emerald-200"
    },
    error: {
      border: "border-rose-300 dark:border-rose-500/40",
      bg: "bg-rose-50 dark:bg-[#1f0f13]",
      icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
      text: "text-rose-900 dark:text-rose-200"
    },
    info: {
      border: "border-sky-300 dark:border-sky-500/40",
      bg: "bg-sky-50 dark:bg-[#0b1622]",
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
      text: "text-sky-900 dark:text-sky-200"
    }
  }[toast.type || "success"];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl dark:shadow-2xl backdrop-blur-md ${typeStyles.bg} ${typeStyles.border}`}
      >
        {typeStyles.icon}
        <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
          {toast.message}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
