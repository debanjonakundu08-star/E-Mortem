import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Stethoscope, Zap, Search, Database } from "lucide-react";
import { useProducts } from "../../context/ProductContext";

export default function Navbar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { getDemoDevice, diagnoseDevice, showToast, devices, isBackendConnected } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDemoClick = () => {
    const demo = getDemoDevice();
    const existing = devices.find((d) => d.id === "EM-2026-1024");
    if (!existing) {
      diagnoseDevice(demo);
    }
    showToast("Loaded Samsung Galaxy S23 demo autopsy!", "info");
    navigate("/report/EM-2026-1024");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/reports?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-charcoal-950/85 backdrop-blur-md border-b border-charcoal-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left side: Mobile menu toggle + Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-charcoal-800/80 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block group">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices, reports, or ask E-Mortem..."
            className="w-full pl-10 pr-12 py-1.5 rounded-xl bg-charcoal-900/90 border border-charcoal-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
          <kbd className="hidden md:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-charcoal-800/80 px-1.5 py-0.5 rounded border border-charcoal-700/60 pointer-events-none">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right side: Live SQLite Indicator + 3 Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Live Engine Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal-900/80 border border-charcoal-800 text-[11px] font-mono text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-slate-300 font-medium">{isBackendConnected ? "SQLite Live" : "Local Engine"}</span>
        </div>

        {/* Button 1: Demo Mode */}
        <Link
          to="/demo"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Demo Mode</span>
        </Link>

        {/* Button 2: Try Demo Diagnosis */}
        <button
          onClick={handleDemoClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/50 transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
          <span>⚡ Try Demo Diagnosis</span>
        </button>

        {/* Button 3: Diagnose CTA */}
        <Link
          to="/diagnose"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.98]"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>🔍 Diagnose Device</span>
        </Link>
      </div>
    </header>
  );
}
