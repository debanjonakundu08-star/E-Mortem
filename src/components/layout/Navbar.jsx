import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Stethoscope, Zap, Search, Sun, Moon, Laptop } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useTheme } from "../../context/ThemeContext";

import MagneticButton from "../effects/MagneticButton";

export default function Navbar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { isBackendConnected } = useProducts();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/reports?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-charcoal-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-charcoal-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left side: Mobile menu toggle + Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-charcoal-800/80 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block group">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices, reports, or ask E-Mortem..."
            className="w-full pl-10 pr-12 py-1.5 rounded-xl bg-slate-100/90 dark:bg-charcoal-900/90 border border-slate-200 dark:border-charcoal-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-violet-500 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-violet-500/20 transition-all font-sans"
          />
          <kbd className="hidden md:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-charcoal-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-charcoal-700/60 pointer-events-none">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right side: Live SQLite Indicator + Theme Toggle + Demo Mode + Diagnose Device */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live Engine Indicator with Emerald/Cyan Pulse */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-charcoal-900/90 border border-emerald-500/25 dark:border-emerald-500/30 text-[11px] font-mono text-slate-600 dark:text-slate-400 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">{isBackendConnected ? "SQLite Live" : "Local Engine"}</span>
        </div>

        {/* Quick Theme Toggle Button with Magnetic Pull */}
        <MagneticButton strength={0.25}>
          <button
            onClick={toggleTheme}
            title={`Current: ${theme} mode (Click to toggle)`}
            aria-label="Toggle light/dark theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-charcoal-800 bg-slate-100/90 dark:bg-charcoal-900/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-charcoal-800 hover:text-violet-500 dark:hover:text-violet-400 transition-all shadow-sm"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>
        </MagneticButton>

        {/* Button 1: Demo Mode */}
        <MagneticButton strength={0.22}>
          <Link
            to="/demo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-400/40 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:border-violet-400 dark:hover:border-violet-500/50 transition-all shadow-sm active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 fill-violet-500 text-violet-500 dark:fill-violet-400 dark:text-violet-400" />
            <span>⚡ Demo Mode</span>
          </Link>
        </MagneticButton>

        {/* Button 2: Diagnose Device with Vibrant Aurora Gradient */}
        <MagneticButton strength={0.25}>
          <Link
            to="/diagnose"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-600 hover:from-teal-400 hover:via-cyan-400 hover:to-violet-500 text-white transition-all shadow-md shadow-cyan-500/25 active:scale-[0.98]"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>🔍 Diagnose Device</span>
          </Link>
        </MagneticButton>
      </div>
    </header>
  );
}
