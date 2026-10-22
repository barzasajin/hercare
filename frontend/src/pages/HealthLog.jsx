import React, { useState, useEffect } from "react";
import { ClipboardList, CheckCircle, Trash2, Calendar, Droplets, Smile, Zap, Moon, AlertCircle } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getHealthLogs, getTodayLog, saveHealthLog, deleteHealthLog } from "../api";

const SYMPTOMS_LIST = [
  "Cramps", "Headache", "Bloating", "Acne", "Tender Breasts",
  "Backache", "Nausea", "Cravings", "Fatigue", "Insomnia", "Constipation"
];

const MOODS_LIST = [
  { key: "happy", label: "Happy", emoji: "😊" },
  { key: "calm", label: "Calm", emoji: "😌" },
  { key: "energetic", label: "Energetic", emoji: "⚡" },
  { key: "anxious", label: "Anxious", emoji: "😰" },
  { key: "sad", label: "Sad", emoji: "😢" },
  { key: "irritable", label: "Irritable", emoji: "😤" },
  { key: "mood_swings", label: "Mood Swings", emoji: "🔄" }
];

export default function HealthLog() {
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [periodFlow, setPeriodFlow] = useState("none");
  const [painLevel, setPainLevel] = useState(0);
  const [painTypes, setPainTypes] = useState([]);
  const [mood, setMood] = useState("calm");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState("good");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getHealthLogs(30);
      setLogs(data || []);
    } catch (err) {
      console.error("Error loading logs:", err);
    }
  };

  const toggleSymptom = (sym) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveHealthLog({
        log_date: logDate,
        period_flow: periodFlow,
        pain_level: parseInt(painLevel, 10),
        pain_types: painTypes,
        mood: mood,
        energy_level: parseInt(energyLevel, 10),
        sleep_hours: parseFloat(sleepHours),
        sleep_quality: sleepQuality,
        symptoms: selectedSymptoms,
        notes: notes || null
      });
      setSuccessMsg("Health log recorded successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchLogs();
    } catch (err) {
      alert("Error saving log: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this health log entry?")) {
      try {
        await deleteHealthLog(id);
        fetchLogs();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          Daily Health & Symptom Log
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Log flow, discomfort, emotional balance, energy, and sleep to train AI pattern detection.
        </p>
      </div>

      <HealthDisclaimer />

      {successMsg && (
        <div style={{
          background: "var(--sage-100)",
          color: "var(--sage-600)",
          padding: "0.85rem 1.25rem",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: 600,
          marginBottom: "1.5rem"
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Log Form */}
      <div className="card" style={{ marginBottom: "2.5rem" }}>
        <form onSubmit={handleSave}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div className="card-title" style={{ margin: 0 }}>
              <ClipboardList size={22} color="var(--primary-500)" />
              <span>Record Daily Entry</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Date:</label>
              <input
                type="date"
                required
                className="form-input"
                style={{ width: "auto", padding: "0.4rem 0.75rem" }}
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            {/* Period Flow */}
            <div className="form-group">
              <label className="form-label">🩸 Period Flow</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["none", "spotting", "light", "medium", "heavy"].map((flow) => (
                  <button
                    key={flow}
                    type="button"
                    onClick={() => setPeriodFlow(flow)}
                    className={`btn ${periodFlow === flow ? "btn-primary" : "btn-secondary"}`}
                    style={{ textTransform: "capitalize", fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>

            {/* Pain / Discomfort Slider */}
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ margin: 0 }}>⚡ Discomfort / Pain Level</label>
                <span style={{ fontWeight: 700, color: painLevel > 5 ? "var(--primary-600)" : "var(--text-main)" }}>
                  {painLevel} / 10 {painLevel === 0 ? "(None)" : painLevel <= 3 ? "(Mild)" : painLevel <= 6 ? "(Moderate)" : "(Severe)"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(e.target.value)}
                style={{ width: "100%", accentColor: "var(--primary-500)" }}
              />
            </div>
          </div>

          {/* Mood Selection */}
          <div className="form-group">
            <label className="form-label">😊 Predominant Mood</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {MOODS_LIST.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m.key)}
                  className={`btn ${mood === m.key ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            {/* Energy Level */}
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ margin: 0 }}>⚡ Daytime Energy</label>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                  {energyLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                style={{ width: "100%", accentColor: "var(--amber-500)" }}
              />
            </div>

            {/* Sleep Hours & Quality */}
            <div className="form-group">
              <label className="form-label">💤 Sleep Duration & Quality</label>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  className="form-input"
                  style={{ width: "110px" }}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>hours</span>
                <select
                  className="form-select"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                >
                  <option value="poor">Poor Rest</option>
                  <option value="fair">Fair Rest</option>
                  <option value="good">Good Rest</option>
                  <option value="excellent">Excellent Deep Sleep</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms Chips */}
          <div className="form-group">
            <label className="form-label">🏷️ Symptoms & Sensations</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {SYMPTOMS_LIST.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected ? "1.5px solid var(--primary-500)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "var(--primary-100)" : "#FFFFFF",
                      color: isSelected ? "var(--primary-700)" : "var(--text-muted)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">📝 Reflections & Personal Notes</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="How are you feeling today? Any changes in appetite, hydration, or stress?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: "0.75rem 2rem" }}
            >
              {saving ? "Saving..." : "Save Today's Health Log"}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Logs List */}
      <div className="card">
        <div className="card-title">
          <Calendar size={20} color="var(--primary-500)" />
          <span>Recent Health Log History ({logs.length} entries)</span>
        </div>

        {logs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            No health entries recorded yet. Complete the form above to record your first day.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "var(--bg-card)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{log.log_date}</span>
                    {log.period_flow && log.period_flow !== "none" && (
                      <span className="badge badge-primary">Flow: {log.period_flow}</span>
                    )}
                    <span className="badge badge-sage">Energy: {log.energy_level}/10</span>
                    <span className="badge badge-lilac">Sleep: {log.sleep_hours}h ({log.sleep_quality})</span>
                  </div>

                  <div style={{ fontSize: "0.825rem", color: "var(--text-muted)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span>Mood: <strong>{log.mood}</strong></span>
                    <span>Discomfort: <strong>{log.pain_level}/10</strong></span>
                    {log.symptoms && log.symptoms.length > 0 && (
                      <span>Symptoms: {log.symptoms.join(", ")}</span>
                    )}
                  </div>
                  {log.notes && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-light)", fontStyle: "italic", marginTop: "0.3rem" }}>
                      "{log.notes}"
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(log.id)}
                  className="btn btn-secondary"
                  style={{ padding: "0.4rem 0.7rem", color: "var(--primary-600)" }}
                  title="Remove log entry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
