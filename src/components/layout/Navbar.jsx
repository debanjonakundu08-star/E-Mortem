import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Stethoscope, Zap, Search } from "lucide-react";
import { useProducts } from "../../context/ProductContext";

export default function Navbar({ onOpenMobileMenu }) {
  const navigate = useNavigate();
  const { getDemoDevice, diagnoseDevice, showToast, devices } = useProducts();
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
    <header className="h-16 sticky top-0 z-30 bg-[#080B0E]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + Global Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices, reports, or ask E-Mortem..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
        </form>
      </div>

      {/* Right side: 3 Action Buttons + Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Button 1: Demo Mode */}
        <Link
          to="/demo"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 hover:border-amber-500/50 transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Demo Mode</span>
        </Link>

        {/* Button 2: Try Demo Diagnosis */}
        <button
          onClick={handleDemoClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          <span>⚡ Try Demo Diagnosis</span>
        </button>

        {/* Button 3: Diagnose CTA */}
        <Link
          to="/diagnose"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.98]"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>🔍 Diagnose Device</span>
        </Link>
      </div>
    </header>
  );
}
