import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Diagnose from "./pages/Diagnose";
import AnalysisProcessing from "./pages/AnalysisProcessing";
import EmergencyDiagnosis from "./pages/EmergencyDiagnosis";
import PreventiveMonitoring from "./pages/PreventiveMonitoring";
import JudgeDemoMode from "./pages/JudgeDemoMode";
import ReportDetails from "./pages/ReportDetails";
import MyDevices from "./pages/MyDevices";
import ReportsHistory from "./pages/ReportsHistory";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <Layout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/diagnose" element={<Diagnose />} />
              <Route path="/diagnose/analyzing" element={<AnalysisProcessing />} />
              <Route path="/emergency" element={<EmergencyDiagnosis />} />
              <Route path="/monitoring" element={<PreventiveMonitoring />} />
              <Route path="/demo" element={<JudgeDemoMode />} />
              <Route path="/add-product" element={<Navigate to="/diagnose" replace />} />
              <Route path="/devices" element={<MyDevices />} />
              <Route path="/reports" element={<ReportsHistory />} />
              <Route path="/report/:id" element={<ReportDetails />} />
              <Route path="/analysis/:id" element={<ReportDetails />} />
              <Route path="/analysis" element={<Navigate to="/report/EM-2026-1024" replace />} />
              <Route path="/graveyard/:id" element={<ReportDetails />} />
              <Route path="/graveyard" element={<Navigate to="/devices" replace />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </BrowserRouter>
    </ProductProvider>
  );
}
