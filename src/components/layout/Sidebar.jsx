import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Smartphone,
  FileSpreadsheet,
  TrendingUp,
  Settings,
  Sparkles,
  Zap,
  X,
  Activity,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";

import MagneticButton from "../effects/MagneticButton";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { getDemoDevice, diagnoseDevice, showToast, devices, isBackendConnected } = useProducts();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard, color: "text-cyan-500 dark:text-cyan-400" },
    { name: "Diagnose Device", path: "/diagnose", icon: Stethoscope, color: "text-teal-500 dark:text-teal-400" },
    { name: "Device Monitoring", path: "/monitoring", icon: Activity, color: "text-emerald-500 dark:text-emerald-400" },
    { name: "Emergency Intake", path: "/emergency", icon: AlertTriangle, color: "text-rose-500 dark:text-rose-400" },
    { name: "Demo Mode", path: "/demo", icon: Zap, color: "text-amber-500 dark:text-amber-400" },
    { name: "My Devices", path: "/devices", icon: Smartphone, badge: devices.length, color: "text-violet-500 dark:text-violet-400" },
    { name: "E-Mortem Reports", path: "/reports", icon: FileSpreadsheet, color: "text-cyan-500 dark:text-cyan-400" },
    { name: "Insights", path: "/insights", icon: TrendingUp, color: "text-purple-500 dark:text-purple-400" }
  ];

  const handleDemoClick = () => {
    const demo = getDemoDevice();
    const existing = devices.find((d) => d.id === "EM-2026-1024");
    if (!existing) {
      diagnoseDevice(demo);
    }
    showToast("Loaded Samsung Galaxy S23 demo autopsy!", "info");
    navigate("/report/EM-2026-1024");
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-charcoal-950 border-r border-slate-200 dark:border-charcoal-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header with Glowing Multi-Color Holographic Logo */}
        <div className="h-20 px-6 border-b border-slate-200 dark:border-charcoal-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-glow-multi shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-tight flex items-center gap-1.5 font-sans">
                <span className="bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-700 dark:from-white dark:via-cyan-200 dark:to-teal-300 bg-clip-text text-transparent">E-Mortem</span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-pulse"></span>
              </div>
              <div className="text-[10px] font-medium tracking-normal text-teal-600 dark:text-cyan-400/90 leading-tight">
                The Autopsy of Electronic Waste.
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Banner with Aurora Glow */}
        <div className="p-3.5 mx-3.5 my-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-cyan-500/5 to-violet-500/5 dark:from-charcoal-900/90 dark:via-cyan-950/20 dark:to-violet-950/20 border border-cyan-500/25 dark:border-cyan-500/30 shadow-sm dark:shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1">
            <Zap className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500 dark:fill-cyan-400 dark:text-cyan-400" />
            <span>Digital Second Opinion</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5 leading-relaxed">
            Test the autopsy flow with Samsung Galaxy S23 sample data.
          </p>
          <MagneticButton strength={0.2} className="w-full">
            <button
              onClick={handleDemoClick}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-500 via-cyan-500 to-violet-600 hover:from-teal-400 hover:to-violet-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Try Demo Diagnosis</span>
            </button>
          </MagneticButton>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            Diagnostic Center
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-violet-500/15 text-teal-900 dark:text-cyan-200 border-l-4 border-cyan-500 dark:border-cyan-400 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-charcoal-900/80"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Settings & Forensic Engine Card */}
        <div className="p-3.5 border-t border-slate-200 dark:border-charcoal-800/80 space-y-2">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-800 border border-teal-200 dark:text-teal-300 dark:bg-teal-500/15 dark:border-teal-500/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-charcoal-900/80"
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100/90 dark:bg-charcoal-900/80 border border-slate-200 dark:border-charcoal-800/80">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
              EM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                Forensic Analysis Unit
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 inline-block animate-pulse"></span>
                Autopsy Engine Active
              </div>
            </div>
          </div>

          <div className="pt-2 pb-1 text-center border-t border-slate-200 dark:border-charcoal-800/50">
            <p className="text-[10px] font-mono text-slate-500 tracking-wide">
              🌱 Less e-waste. A healthier planet.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
