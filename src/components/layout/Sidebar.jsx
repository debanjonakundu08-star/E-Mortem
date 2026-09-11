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
  AlertTriangle
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { getDemoDevice, diagnoseDevice, showToast, devices } = useProducts();

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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0A0D11] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-glow-emerald shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight leading-tight flex items-center gap-1.5 font-sans">
                E-Mortem
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] font-medium tracking-normal text-emerald-400/90 leading-tight">
                The Autopsy of Electronic Waste.
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Banner */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/25 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Digital Second Opinion</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
            Test the autopsy flow with Samsung Galaxy S23 sample data.
          </p>
          <button
            onClick={handleDemoClick}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Try Demo Diagnosis</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-1.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Settings & Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              EM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                Electronic Forensic Unit
              </div>
              <div className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Autopsy Engine Active
              </div>
            </div>
          </div>

          <div className="pt-2 pb-1 text-center border-t border-slate-800/50">
            <p className="text-[10px] font-mono text-slate-500 tracking-wide">
              🌱 Less e-waste. A healthier planet.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
