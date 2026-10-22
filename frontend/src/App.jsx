import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";
import Dashboard from "./pages/Dashboard";
import CycleTracker from "./pages/CycleTracker";
import HealthLog from "./pages/HealthLog";
import AIInsights from "./pages/AIInsights";
import WhatChanged from "./pages/WhatChanged";
import Patterns from "./pages/Patterns";
import PregnancyMode from "./pages/PregnancyMode";
import PersonalizedSupport from "./pages/PersonalizedSupport";
import Privacy from "./pages/Privacy";
import { getCyclePrediction } from "./api";

export default function App() {
  const [currentPhase, setCurrentPhase] = useState("Follicular Phase");
  const [cycleDay, setCycleDay] = useState(1);

  const refreshCycleStats = async () => {
    try {
      const pred = await getCyclePrediction();
      if (pred) {
        setCurrentPhase(pred.current_phase || "Follicular Phase");
        setCycleDay(pred.current_cycle_day || 1);
      }
    } catch (err) {
      console.log("Could not load navbar cycle prediction yet:", err);
    }
  };

  useEffect(() => {
    refreshCycleStats();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar
          currentPhase={currentPhase}
          cycleDay={cycleDay}
          onDataRefreshed={refreshCycleStats}
        />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cycle-tracker" element={<CycleTracker />} />
            <Route path="/health-log" element={<HealthLog />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/what-changed" element={<WhatChanged />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/pregnancy-mode" element={<PregnancyMode />} />
            <Route path="/personalized-support" element={<PersonalizedSupport />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
