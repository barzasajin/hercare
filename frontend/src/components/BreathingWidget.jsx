import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Heart } from "lucide-react";

export default function BreathingWidget() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Inhale"); // Inhale, Hold, Exhale
  const [timer, setTimer] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === "Inhale") {
              setPhase("Hold");
              return 4;
            } else if (phase === "Hold") {
              setPhase("Exhale");
              return 4;
            } else {
              setPhase("Inhale");
              setCompletedCycles((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive && timer <= 0) {
      setTimer(4);
      setPhase("Inhale");
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase("Inhale");
    setTimer(4);
    setCompletedCycles(0);
  };

  return (
    <div className="card" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div className="card-title" style={{ justifyContent: "center" }}>
        <Heart size={20} color="var(--primary-500)" />
        <span>Mindful Relaxation Sanctuary</span>
      </div>
      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        Box breathing rhythm to activate the parasympathetic nervous system and relieve luteal or menstrual tension.
      </p>

      <div className="breathing-circle-outer">
        <div className={`breathing-circle-inner ${isActive && phase === "Inhale" ? "breathing-inhale" : (isActive && phase === "Exhale" ? "breathing-exhale" : "")}`}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{isActive ? phase : "Ready"}</div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{isActive ? timer : "4"}s</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
            {phase === "Inhale" ? "Breathe in slowly" : phase === "Hold" ? "Gently retain" : "Release tension"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={toggleExercise} className="btn btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          <span>{isActive ? "Pause" : "Start 4-4-4 Rhythm"}</span>
        </button>
        <button onClick={resetExercise} className="btn btn-secondary" style={{ padding: "0.6rem 1rem" }}>
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-light)" }}>
        Completed Breath Cycles: <strong>{completedCycles}</strong>
      </div>
    </div>
  );
}
