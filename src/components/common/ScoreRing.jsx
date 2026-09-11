import React from "react";

export default function ScoreRing({
  score = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label = "",
  sublabel = ""
}) {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = "#10B981"; // Emerald
  let glowColor = "rgba(16, 185, 129, 0.3)";
  if (percentage < 40) {
    strokeColor = "#EF4444"; // Red
    glowColor = "rgba(239, 68, 68, 0.3)";
  } else if (percentage < 65) {
    strokeColor = "#F97316"; // Orange
    glowColor = "rgba(249, 115, 22, 0.3)";
  } else if (percentage < 75) {
    strokeColor = "#F59E0B"; // Amber
    glowColor = "rgba(245, 158, 11, 0.3)";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 6px ${glowColor})`,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
              {score}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-0.5">/{max}</span>
          </div>
          {label && (
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <span className="text-xs text-slate-400 mt-2 text-center max-w-[140px]">
          {sublabel}
        </span>
      )}
    </div>
  );
}
