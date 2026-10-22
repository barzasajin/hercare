import React, { useState, useEffect } from "react";
import { Sparkles, Brain, Activity, ShieldCheck, Info, HeartHandshake } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getAIInsights, getCyclePrediction } from "../api";

export default function AIInsights() {
  const [insightsData, setInsightsData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [aiRes, predRes] = await Promise.all([
        getAIInsights(),
        getCyclePrediction()
      ]);
      setInsightsData(aiRes);
      setPrediction(predRes);
    } catch (err) {
      console.error("Error loading insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const insightsList = insightsData?.insights || [];

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          AI Health Intelligence & Insights
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Algorithmic pattern mining and biological context synthesized from your cycle history and daily wellness logs.
        </p>
      </div>

      <HealthDisclaimer />

      {/* Cycle Phase Intelligence Banner */}
      {prediction && (
        <div className="card" style={{
          background: "linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%)",
          border: "1px solid var(--lilac-100)",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span className="badge badge-lilac">
              Current Biological Phase
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Cycle Day {prediction.current_cycle_day}
            </span>
          </div>

          <h2 style={{ fontSize: "1.4rem", color: "var(--lilac-600)", marginBottom: "0.5rem" }}>
            {prediction.current_phase}
          </h2>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            {prediction.current_phase === "Menstrual Phase" &&
              "Estrogen and progesterone are at baseline as the uterine lining renews. Cellular energy is focused inward. Prioritize warmth, iron replenishment, and deep restorative sleep."}
            {prediction.current_phase === "Follicular Phase" &&
              "Follicle-stimulating hormone (FSH) stimulates rising estrogen, which enhances focus, mental clarity, insulin sensitivity, and creative drive."}
            {prediction.current_phase === "Ovulatory Phase" &&
              "Estrogen and luteinizing hormone (LH) crest together. This is your monthly peak in social confidence, physical stamina, and reproductive fertility."}
            {prediction.current_phase === "Luteal Phase" &&
              "Progesterone rises to stabilize the body. Resting body temperature and basal metabolic rate elevate. Support this phase with magnesium, complex carbohydrates, and gentle boundaries."}
          </p>
        </div>
      )}

      {/* Dynamic Insights Grid */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Sparkles size={20} color="var(--primary-500)" />
        <span>Synthesized Observations ({insightsList.length})</span>
      </h2>

      {insightsList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)" }}>
            Awaiting additional records to generate rich AI observations.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {insightsList.map((item, idx) => (
            <div key={idx} className="card" style={{ borderLeft: "4px solid var(--primary-500)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: "0.35rem" }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", color: "var(--text-main)" }}>
                    {item.title}
                  </h3>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 600 }}>
                  Confidence: {Math.round(item.confidence * 100)}%
                </span>
              </div>

              <p style={{ fontSize: "0.925rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                {item.summary}
              </p>

              {item.scientific_context && (
                <div style={{
                  background: "var(--bg-app)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.825rem",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem"
                }}>
                  <Info size={16} color="var(--lilac-500)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                  <div>
                    <strong>Scientific Context:</strong> {item.scientific_context}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
