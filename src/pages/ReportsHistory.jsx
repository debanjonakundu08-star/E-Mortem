import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Search,
  ExternalLink,
  Plus,
  Activity,
  ArrowRight,
  ShieldCheck,
  Filter
} from "lucide-react";
import StatusBadge from "../components/common/StatusBadge";
import { useProducts } from "../context/ProductContext";
import MagneticButton from "../components/effects/MagneticButton";
import api from "../services/api";

export default function ReportsHistory() {
  const navigate = useNavigate();
  const { devices, syncWithBackend, showToast } = useProducts();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = devices.filter((d) => {
    const matchesSearch =
      d.device?.toLowerCase().includes(search.toLowerCase()) ||
      d.id?.toLowerCase().includes(search.toLowerCase()) ||
      d.probableCauses?.[0]?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 uppercase">
              Forensic Archives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="text-slate-900 dark:text-white">E-Mortem</span>
            <span className="text-gradient-aurora">Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Past electronic postmortems, root cause probability models, and repair shop second opinions.
          </p>
        </div>

        <MagneticButton strength={0.25}>
          <Link
            to="/diagnose"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white transition-all shadow-md shadow-teal-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Diagnosis</span>
          </Link>
        </MagneticButton>
      </div>

      {/* Search & Filter Bar */}
      <div className="graveyard-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report by ID, device name, or suspected issue..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          <option value="Smartphone">Smartphones</option>
          <option value="Laptop">Laptops</option>
          <option value="Headphones">Headphones</option>
          <option value="Tablet">Tablets</option>
          <option value="Monitor">Monitors</option>
          <option value="Printer">Printers</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="graveyard-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-300">
            {filtered.length} Archived E-Mortem Reports
          </span>
          <span className="text-slate-500">
            Click any report to view complete electronic postmortem
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Report ID</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Suspected Cause</th>
                <th className="px-5 py-3">Health</th>
                <th className="px-5 py-3">Repairability</th>
                <th className="px-5 py-3">Recommendation</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    <button
                      onClick={() => navigate(`/report/${d.id}`)}
                      className="hover:underline flex items-center gap-1.5"
                    >
                      <span>{d.id}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
                    </button>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {d.device}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {d.purchaseDate || "Recent"}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    <span className="text-amber-700 dark:text-amber-400">{d.probableCauses?.[0]?.name || "Component Wear"}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {d.probableCauses?.[0]?.probability || d.probableCauses?.[0]?.likelihood || 72}% probability
                    </span>
                  </td>

                  <td className="px-5 py-3.5 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{d.healthScore}</span>
                    <span className="text-slate-500">/100</span>
                  </td>

                  <td className="px-5 py-3.5 font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{d.repairabilityScore}</span>
                    <span className="text-slate-500">/100</span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">
                      {d.repairVsReplace?.recommendation || "REPAIR FIRST"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/report/${d.id}`)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
                    >
                      View Report
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await api.deleteReport(d.id);
                        } catch (err) {}
                        syncWithBackend();
                        showToast(`Report ${d.id} deleted.`, "info");
                      }}
                      className="px-2 py-1 rounded text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30"
                      title="Delete Report"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
