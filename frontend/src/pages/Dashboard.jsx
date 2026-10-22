import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Sparkles,
  ClipboardList,
  TrendingUp,
  BarChart2,
  Heart,
  ChevronRight,
  Droplet,
  Moon,
  Zap,
  Smile
} from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getCyclePrediction, getHealthLogs, getAIInsights } from "../api";

export default function Dashboard() {
  const [prediction, setPrediction] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [predData, logsData, aiData] = await Promise.all([
        getCyclePrediction().catch(() => null),
        getHealthLogs(3).catch(() => []),
        getAIInsights().catch(() => ({ insights: [] }))
      ]);
      setPrediction(predData);
      setRecentLogs(logsData || []);
      setInsights(aiData?.insights || []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentPhase = prediction?.current_phase || "Follicular Phase";
  const cycleDay = prediction?.current_cycle_day || 1;
  const cycleLength = prediction?.estimated_cycle_length || 28;
  const nextPeriod = prediction?.next_period_start || "Calculating...";

  return (
    <div className="page-container">
      <HealthDisclaimer />

      {/* Hero Welcome Card */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 50%, #F5F3FF 100%)",
        border: "1px solid var(--primary-200)",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>
            🌸 Personal Wellness Dashboard
          </span>
          <h1 className="serif-heading" style={{ fontSize: "2rem", color: "var(--primary-700)", marginBottom: "0.5rem" }}>
            Welcome to HerCare AI 🌸
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", marginBottom: "1.5rem" }}>
            Holistic cycle intelligence, symptom tracking, and supportive AI wellness guidance tailored to your body's rhythm.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)"
          }}>
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>
                Current Phase
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary-600)" }}>
                {currentPhase}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Day {cycleDay} of {cycleLength}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>
                Next Period Estimate
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                {nextPeriod}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--sage-600)" }}>
                {prediction?.confidence_level || "Analyzing baseline"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>
                Ovulation Window
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--lilac-600)" }}>
                {prediction?.ovulation_date ? String(prediction.ovulation_date) : "Estimated"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Fertile Window Estimate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>Explore Health Insights</span>
        </h2>
        <div className="grid-4">
          <Link to="/health-log" style={{ textDecoration: "none" }}>
            <div className="card" style={{ height: "100%", padding: "1.25rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-100)",
                color: "var(--primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <ClipboardList size={20} />
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                Health Log
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Log flow, pain, mood, sleep & symptoms
              </div>
            </div>
          </Link>

          <Link to="/ai-insights" style={{ textDecoration: "none" }}>
            <div className="card" style={{ height: "100%", padding: "1.25rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--lilac-100)",
                color: "var(--lilac-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <Sparkles size={20} />
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                AI Insights
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Hormonal phase & rhythm analysis
              </div>
            </div>
          </Link>

          <Link to="/patterns" style={{ textDecoration: "none" }}>
            <div className="card" style={{ height: "100%", padding: "1.25rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--sage-100)",
                color: "var(--sage-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <BarChart2 size={20} />
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                Patterns
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Sleep vs. energy & mood trend charts
              </div>
            </div>
          </Link>

          <Link to="/what-changed" style={{ textDecoration: "none" }}>
            <div className="card" style={{ height: "100%", padding: "1.25rem" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                background: "var(--amber-100)",
                color: "var(--amber-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem"
              }}>
                <TrendingUp size={20} />
              </div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                What Changed?
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Compare recent 7 days to baseline
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: AI Highlight & Recent Health Logs */}
      <div className="grid-2">
        {/* AI Insight Summary */}
        <div className="card">
          <div className="card-title">
            <Sparkles size={20} color="var(--primary-500)" />
            <span>AI Health Intelligence Snapshot</span>
          </div>
          {insights.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {insights.slice(0, 2).map((ins, idx) => (
                <div key={idx} style={{
                  padding: "1rem",
                  background: "var(--bg-app)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>
                      {ins.title}
                    </span>
                    <span className="badge badge-lilac">{ins.category}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    {ins.summary}
                  </p>
                  {ins.scientific_context && (
                    <div style={{ fontSize: "0.775rem", color: "var(--text-light)", fontStyle: "italic" }}>
                      💡 {ins.scientific_context}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/ai-insights" className="btn btn-outline" style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                <span>View Full Insights Report</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No insights yet. Use "Load Demo Data" or log symptoms to generate observations.
            </p>
          )}
        </div>

        {/* Recent Health Logs */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="card-title" style={{ margin: 0 }}>
              <ClipboardList size={20} color="var(--primary-500)" />
              <span>Recent Health Records</span>
            </div>
            <Link to="/health-log" className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
              Log Entry
            </Link>
          </div>

          {recentLogs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentLogs.map((log) => (
                <div key={log.id} style={{
                  padding: "0.85rem 1rem",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                      {log.log_date}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      <span>😊 Mood: {log.mood}</span>
                      <span>⚡ Energy: {log.energy_level}/10</span>
                      <span>💤 Sleep: {log.sleep_hours}h</span>
                    </div>
                  </div>
                  {log.period_flow && log.period_flow !== "none" && (
                    <span className="badge badge-primary">
                      Flow: {log.period_flow}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-muted)" }}>
              <p>No health logs recorded yet.</p>
              <Link to="/health-log" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Add Today's Health Log
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
