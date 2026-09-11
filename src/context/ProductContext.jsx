import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_DEVICES } from "../data/mockProducts";
import { analyzeDevice } from "../utils/analysisEngine";
import api from "../services/api";

const ProductContext = createContext(null);
const STORAGE_KEY = "e_mortem_devices_v1";

export function ProductProvider({ children }) {
  const [devices, setDevices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load E-Mortem devices from localStorage:", e);
    }
    return INITIAL_DEVICES;
  });

  const [toast, setToast] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = "success", duration = 4000) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((current) => (current && current.message === message ? null : current));
    }, duration);
  };

  // Sync with backend SQLite on mount
  const syncWithBackend = useCallback(async () => {
    try {
      const health = await api.getHealth();
      if (health && health.status === "ok") {
        setIsBackendConnected(true);
        // Fetch all reports from SQLite backend
        const backendReports = await api.getReports();
        if (Array.isArray(backendReports) && backendReports.length > 0) {
          // Merge / hydrate reports with full autopsy details
          const fullReports = await Promise.all(
            backendReports.slice(0, 15).map(async (r) => {
              try {
                const detail = await api.getReport(r.diagnosis_id);
                return {
                  id: detail.diagnosis_id,
                  device: detail.device_name,
                  type: detail.device_type,
                  brand: detail.brand,
                  model: detail.model,
                  purchaseDate: detail.purchase_date || "March 2024",
                  purchasePrice: detail.purchase_price || 65000,
                  currentValue: detail.current_value || 18000,
                  healthScore: detail.health_score,
                  repairabilityScore: detail.repairability_score,
                  status: detail.status,
                  probableCauses: detail.probable_causes,
                  componentHealth: detail.component_health,
                  recoveryAnalysis: detail.recovery_options,
                  repairVsReplace: {
                    repairCostRange: "₹1,500–₹3,000",
                    currentValue: detail.current_value || 18000,
                    recommendation: detail.recommendation === "REPAIR_FIRST" ? "REPAIR FIRST" : detail.recommendation,
                    verdictDescription: detail.recommendation_reason,
                    decisionConfidence: 89
                  },
                  whatProbablyHappened: detail.what_probably_happened,
                  actionPlan: detail.action_plan,
                  technicianQuestions: detail.technician_questions,
                  createdAt: detail.created_at || new Date().toISOString()
                };
              } catch (e) {
                return null;
              }
            })
          );
          const validReports = fullReports.filter(Boolean);
          if (validReports.length > 0) {
            setDevices(validReports);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validReports));
          }
        }
      }
    } catch (err) {
      console.log("Backend offline or unreachable, using local persistent cache.", err.message);
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch (e) {
      console.error("Failed to persist E-Mortem devices:", e);
    }
  }, [devices]);

  // Submit device diagnosis to backend API (or fallback to client-side engine)
  const diagnoseDevice = async (formData) => {
    setIsLoading(true);
    let report = null;

    try {
      // Send to FastAPI / SQLite
      const response = await api.diagnoseDevice({
        device_type: formData.type || "Smartphone",
        brand: formData.brand || "Generic",
        model: formData.model || "Device",
        purchase_date: formData.purchaseDate || "",
        purchase_price: Number(formData.purchasePrice) || 0,
        current_value: Number(formData.currentValue) || 0,
        repair_cost: Number(formData.repairCost) || 2500,
        symptoms: formData.symptoms || [],
        history: {
          dropped: formData.priorEvent === "Device was dropped",
          water_damage: formData.priorEvent === "Got wet or exposed to liquid",
          software_update: formData.priorEvent === "Recent software update",
          charging_problem: formData.priorEvent === "Charging problem occurred"
        },
        description: formData.userStory || "",
        context_answers: formData.contextAnswers || {}
      });

      if (response && response.diagnosis_id) {
        report = {
          id: response.diagnosis_id,
          device: response.device_name || `${formData.brand} ${formData.model}`,
          type: response.device_type,
          brand: response.brand,
          model: response.model,
          purchaseDate: response.purchase_date || formData.purchaseDate,
          purchasePrice: response.purchase_price || formData.purchasePrice,
          currentValue: response.current_value || formData.currentValue,
          healthScore: response.health_score,
          repairabilityScore: response.repairability_score,
          status: response.status,
          probableCauses: response.probable_causes,
          componentHealth: response.component_health,
          recoveryAnalysis: response.recovery_options,
          repairVsReplace: {
            repairCostRange: formData.repairCost ? `₹${formData.repairCost}` : "₹1,500–₹3,000",
            currentValue: response.current_value || formData.currentValue,
            recommendation: response.recommendation === "REPAIR_FIRST" ? "REPAIR FIRST" : response.recommendation,
            verdictDescription: response.recommendation_reason,
            decisionConfidence: 89
          },
          whatProbablyHappened: response.what_probably_happened,
          actionPlan: response.action_plan,
          technicianQuestions: response.technician_questions,
          createdAt: response.created_at || new Date().toISOString()
        };
        setIsBackendConnected(true);
      }
    } catch (backendError) {
      console.warn("Backend diagnosis unavailable, using local client-side analysis engine:", backendError.message);
      report = analyzeDevice(formData);
    } finally {
      setIsLoading(false);
    }

    if (!report) {
      report = analyzeDevice(formData);
    }

    setDevices((prev) => [report, ...prev]);
    showToast(`Electronic Postmortem completed for ${report.device} (${report.id})!`, "success");
    return report;
  };

  const getDeviceById = (id) => {
    if (!id) return null;
    return devices.find((d) => d.id.toLowerCase() === id.toLowerCase()) || null;
  };

  const getDemoDevice = () => {
    // Check if EM-2026-1024 exists in current devices
    const found = devices.find((d) => d.id === "EM-2026-1024");
    if (found) return found;

    return analyzeDevice({
      id: "EM-2026-1024",
      type: "Smartphone",
      brand: "Samsung",
      model: "Galaxy S23",
      purchaseDate: "March 2024",
      age: 2.5,
      purchasePrice: 65000,
      currentValue: 18000,
      currentCondition: "Frequently crashing",
      symptoms: ["shutdown", "battery_drain", "overheating", "sluggish"],
      userStory: "Problems started five days ago. The device was lightly dropped two weeks ago but continued functioning normally afterward.",
      priorEvent: "Device was dropped"
    });
  };

  const resetToDefault = () => {
    setDevices(INITIAL_DEVICES);
    localStorage.removeItem(STORAGE_KEY);
    showToast("E-Mortem registry reset to default diagnostic records.", "info");
    syncWithBackend();
  };

  // Aggregate Metrics for Dashboard & Reports
  const totalCount = devices.length;
  const repairableCount = devices.filter(
    (d) => d.repairVsReplace?.recommendation === "REPAIR FIRST" || d.repairabilityScore >= 70
  ).length;
  const attentionCount = devices.filter((d) => d.status === "Attention Required" || d.status === "Needs Attention").length;
  const highRiskCount = devices.filter((d) => d.status === "High Risk" || d.status?.includes("Critical")).length;

  return (
    <ProductContext.Provider
      value={{
        devices,
        diagnoseDevice,
        getDeviceById,
        getDemoDevice,
        resetToDefault,
        toast,
        showToast,
        isBackendConnected,
        isLoading,
        syncWithBackend,
        kpis: {
          devicesDiagnosed: 24,
          potentiallyRepairablePct: 17,
          repairOpportunitiesCount: 11,
          replacementAvoidedValue: "₹1.42L",
          mostCommonIssue: "Battery",
          totalCount,
          repairableCount,
          attentionCount,
          highRiskCount
        }
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return ctx;
}
