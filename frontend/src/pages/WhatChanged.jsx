import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getAIChanges } from "../api";

export default function WhatChanged() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChanges();
  }, []);

  const fetchChanges = async () => {
    try {
      setLoading(true);
      const data = await getAIChanges();
      setReport(data);
    } catch (err) {
      console.error("Error loading change detection:", err);
    } finally {
      setLoading(false);
    }
  };

  const changesList = report?.changes || [];

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          What Changed? — Temporal Health Comparison
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Automated comparison between your recent 7-day observation window and historical baselines.
        </p>
      </div>

      <HealthDisclaimer />

      {/* AI Narrative Summary Card */}
      {report && (
        <div className="card" style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)",
          border: "1px solid var(--amber-100)",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span className="badge badge-amber">
              {report.analysis_period || "Comparative Window"}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 600 }}>
              AI Baseline Comparison
            </span>
          </div>

          <h2 style={{ fontSize: "1.25rem", color: "var(--text-main)", marginBottom: "0.75rem" }}>
            Observation Synthesis
          </h2>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
            {report.overall_summary}
          </p>

          <div style={{
            background: "rgba(255, 255, 255, 0.8)",
            padding: "0.85rem 1rem",
            borderRadius: "var(--radius-md)",
            borderLeft: "3px solid var(--amber-500)",
            fontSize: "0.85rem",
            color: "var(--text-muted)"
          }}>
            🌿 <strong>Supportive Wellness Guidance:</strong> {report.non_alarmist_advice}
          </div>
        </div>
      )}

      {/* Changes Metric Cards */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Comparative Shift Metrics
      </h2>

      {changesList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)" }}>
            Log health records across multiple days to unlock baseline shift metrics.
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {changesList.map((c, idx) => {
            const isIncrease = c.delta > 0;
            const isDecrease = c.delta < 0;
            return (
              <div key={idx} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-main)" }}>
                    {c.metric}
                  </span>
                  <span className={`badge ${c.is_significant ? "badge-primary" : "badge-sage"}`}>
                    {c.is_significant ? "Shift Noted" : "Stable Baseline"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase" }}>Recent: </span>
                    <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
                      {c.recent_value}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase" }}>Baseline: </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-muted)" }}>
                      {c.baseline_value}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: isIncrease ? "var(--primary-600)" : (isDecrease ? "var(--lilac-600)" : "var(--sage-600)")
                  }}>
                    {isIncrease ? <ArrowUpRight size={18} /> : (isDecrease ? <ArrowDownRight size={18} /> : <Minus size={18} />)}
                    <span>{c.delta > 0 ? `+${c.delta}` : c.delta}</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  {c.summary_text}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* New Symptoms Detected */}
      {report?.new_symptoms && report.new_symptoms.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <div className="card-title">
            <AlertCircle size={20} color="var(--primary-500)" />
            <span>Newly Reported Symptoms This Week</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            The following symptoms appeared recently that were less frequent in your historical baseline:
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {report.new_symptoms.map((s, idx) => (
              <span key={idx} className="badge badge-primary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.825rem" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
