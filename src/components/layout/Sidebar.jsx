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

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { getDemoDevice, diagnoseDevice, showToast, devices, isBackendConnected } = useProducts();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Diagnose Device", path: "/diagnose", icon: Stethoscope },
    { name: "Device Monitoring", path: "/monitoring", icon: Activity },
    { name: "Emergency Intake", path: "/emergency", icon: AlertTriangle },
    { name: "Demo Mode", path: "/demo", icon: Zap },
    { name: "My Devices", path: "/devices", icon: Smartphone, badge: devices.length },
    { name: "E-Mortem Reports", path: "/reports", icon: FileSpreadsheet },
    { name: "Insights", path: "/insights", icon: TrendingUp }
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-charcoal-950 border-r border-charcoal-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-charcoal-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-glow-teal shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight leading-tight flex items-center gap-1.5 font-sans">
                E-Mortem
                <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] font-medium tracking-normal text-teal-400/90 leading-tight">
                The Autopsy of Electronic Waste.
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Banner */}
        <div className="p-3.5 mx-3.5 my-3.5 rounded-2xl bg-charcoal-900/90 border border-teal-500/25 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 mb-1">
            <Zap className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
            <span>Digital Second Opinion</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
            Test the autopsy flow with Samsung Galaxy S23 sample data.
          </p>
          <button
            onClick={handleDemoClick}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 shadow-md shadow-teal-500/20 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Try Demo Diagnosis</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
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
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-charcoal-900/80"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-charcoal-800 text-slate-300 border border-charcoal-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Settings & Forensic Engine Card */}
        <div className="p-3.5 border-t border-charcoal-800/80 space-y-2">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "text-teal-300 bg-teal-500/15 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-charcoal-900/80"
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-charcoal-900/80 border border-charcoal-800/80">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
              EM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                Forensic Analysis Unit
              </div>
              <div className="text-[10px] text-teal-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block animate-pulse"></span>
                Autopsy Engine Active
              </div>
            </div>
          </div>

          <div className="pt-2 pb-1 text-center border-t border-charcoal-800/50">
            <p className="text-[10px] font-mono text-slate-500 tracking-wide">
              🌱 Less e-waste. A healthier planet.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
