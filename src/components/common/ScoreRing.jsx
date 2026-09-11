import React from "react";

export default function ScoreRing({
  score = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label = "",
  sublabel = "",
  colorScheme
}) {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = `score-gradient-${Math.round(score)}-${size}`;

  let stopStart = "#10B981";
  let stopEnd = "#14B8A6";
  let glowColor = "rgba(20, 184, 166, 0.35)";

  if (colorScheme === "cyan" || (!colorScheme && percentage >= 80)) {
    stopStart = "#06B6D4";
    stopEnd = "#10B981";
    glowColor = "rgba(6, 182, 212, 0.35)";
  } else if (colorScheme === "emerald" || percentage >= 70) {
    stopStart = "#10B981";
    stopEnd = "#0D9488";
    glowColor = "rgba(16, 185, 129, 0.35)";
  } else if (colorScheme === "amber" || percentage >= 50) {
    stopStart = "#F59E0B";
    stopEnd = "#F97316";
    glowColor = "rgba(245, 158, 11, 0.35)";
  } else {
    stopStart = "#F43F5E";
    stopEnd = "#E11D48";
    glowColor = "rgba(244, 63, 94, 0.35)";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transition-all duration-700 ease-out"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stopStart} />
              <stop offset="100%" stopColor={stopEnd} />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-white/10"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated gradient stroke circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              {score}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-0.5">/{max}</span>
          </div>
          {label && (
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5 font-mono">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center max-w-[140px] leading-relaxed">
          {sublabel}
        </span>
      )}
    </div>
  );
}
