import React, { useState } from "react";
import { Sparkles, Database, Check, User } from "lucide-react";
import { seedDemoData } from "../api";

export default function Navbar({ currentPhase, cycleDay, onDataRefreshed }) {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedDemoData();
      setSeedSuccess(true);
      if (onDataRefreshed) onDataRefreshed();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
          📅 {todayStr}
        </span>
        {currentPhase && (
          <span className="badge badge-primary">
            🌸 {currentPhase} {cycleDay ? `· Day ${cycleDay}` : ""}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="btn btn-secondary"
          style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
          title="Seed realistic historical cycles and health logs for demonstration"
        >
          {seedSuccess ? (
            <>
              <Check size={14} color="#10B981" />
              <span>Data Ready</span>
            </>
          ) : (
            <>
              <Database size={14} />
              <span>{seeding ? "Loading..." : "Load Demo Data"}</span>
            </>
          )}
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "#FFFFFF",
          padding: "0.4rem 0.85rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)"
        }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary-400), var(--lilac-500))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}>
            <User size={14} />
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
            Sarah Chen
          </span>
        </div>
      </div>
    </header>
  );
}
