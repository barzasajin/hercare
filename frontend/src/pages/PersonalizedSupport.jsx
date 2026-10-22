import React, { useState, useEffect } from "react";
import { Heart, Droplet, Moon, Apple, Sparkles, Check, Coffee, Sun } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import BreathingWidget from "../components/BreathingWidget";
import { getAIRecommendations, getCyclePrediction } from "../api";

export default function PersonalizedSupport() {
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Hydration Counter
  const [waterGlasses, setWaterGlasses] = useState(4);
  const DAILY_GOAL = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recsData, predData] = await Promise.all([
        getAIRecommendations(),
        getCyclePrediction()
      ]);
      setRecommendations(recsData || []);
      setPrediction(predData);
    } catch (err) {
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const addGlass = () => {
    if (waterGlasses < 12) setWaterGlasses(waterGlasses + 1);
  };

  const removeGlass = () => {
    if (waterGlasses > 0) setWaterGlasses(waterGlasses - 1);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          Personalized Wellness Support & Daily Rituals
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Targeted hydration, nutritional synchronization, nervous system relaxation, and supportive affirmations.
        </p>
      </div>

      <HealthDisclaimer />

      {/* Daily Affirmation Hero */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #FFF1F2 0%, #EDE9FE 100%)",
        border: "1px solid var(--primary-200)",
        marginBottom: "2rem",
        textAlign: "center",
        padding: "2rem"
      }}>
        <div style={{ fontSize: "0.8rem", color: "var(--primary-600)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          🌸 Daily Mindful Affirmation
        </div>
        <blockquote className="serif-heading" style={{ fontSize: "1.35rem", color: "var(--text-main)", fontStyle: "italic", marginBottom: "0.5rem" }}>
          "Your body is a wise, self-regulating sanctuary. Honor your rhythm, celebrate your strength, and meet yourself with gentle grace today."
        </blockquote>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Curated for {prediction?.current_phase || "Daily Wellness"} · Day {prediction?.current_cycle_day || 1}
        </div>
      </div>

      {/* Hydration Tracker & Breathing Widget Grid */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        {/* Hydration Coach */}
        <div className="card">
          <div className="card-title">
            <Droplet size={20} color="#0284C7" />
            <span>Interactive Hydration Tracker</span>
          </div>

          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Adequate cellular hydration eases premenstrual cramping, reduces fluid retention bloating, and optimizes cognitive stamina.
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            margin: "1.5rem 0"
          }}>
            {Array.from({ length: DAILY_GOAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => setWaterGlasses(i + 1)}
                style={{
                  width: "42px",
                  height: "52px",
                  borderRadius: "6px",
                  border: i < waterGlasses ? "2px solid #0284C7" : "1px dashed var(--border-subtle)",
                  background: i < waterGlasses ? "linear-gradient(180deg, #BAE6FD, #0284C7)" : "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: i < waterGlasses ? "white" : "var(--text-light)",
                  transition: "all 0.2s ease"
                }}
                title={`Glass ${i + 1}`}
              >
                <Droplet size={18} fill={i < waterGlasses ? "white" : "none"} />
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0284C7" }}>
              {waterGlasses} / {DAILY_GOAL} Glasses
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Approx. {(waterGlasses * 0.25).toFixed(2)} Liters · {waterGlasses >= DAILY_GOAL ? "🎉 Daily Goal Achieved!" : `${DAILY_GOAL - waterGlasses} glasses to reach 2L goal`}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
            <button onClick={addGlass} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
              + Log Glass
            </button>
            <button onClick={removeGlass} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
              - Remove Glass
            </button>
          </div>
        </div>

        {/* Mindful Breathing Sanctuary */}
        <BreathingWidget />
      </div>

      {/* Personalized AI Recommendations Feed */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Sparkles size={20} color="var(--primary-500)" />
        <span>Personalized Phase Suggestions ({recommendations.length})</span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {recommendations.map((rec) => (
          <div key={rec.id} className="card" style={{ borderLeft: "4px solid var(--lilac-500)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <span className="badge badge-lilac" style={{ marginBottom: "0.35rem" }}>
                  {rec.phase_relevance}
                </span>
                <h3 style={{ fontSize: "1.15rem", color: "var(--text-main)" }}>
                  {rec.title}
                </h3>
              </div>
              <span className="badge badge-sage">{rec.category}</span>
            </div>

            <p style={{ fontSize: "0.925rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {rec.advice}
            </p>

            <div style={{
              background: "var(--bg-app)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontWeight: 700, color: "var(--primary-600)", fontSize: "0.85rem" }}>
                🎯 Daily Action:{" "}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                {rec.action_item}
              </span>
            </div>

            <div style={{ fontSize: "0.825rem", color: "var(--text-light)", fontStyle: "italic" }}>
              "{rec.supportive_quote}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
