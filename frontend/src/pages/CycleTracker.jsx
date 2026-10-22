import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getCycles, createCycle, deleteCycle, getCyclePrediction } from "../api";

export default function CycleTracker() {
  const [cycles, setCycles] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [flowIntensity, setFlowIntensity] = useState("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cyclesData, predData] = await Promise.all([
        getCycles(),
        getCyclePrediction()
      ]);
      setCycles(cyclesData || []);
      setPrediction(predData);
    } catch (err) {
      console.error("Error loading cycles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCycle = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createCycle({
        start_date: startDate,
        end_date: endDate || null,
        cycle_length: parseInt(cycleLength, 10),
        period_duration: parseInt(periodDuration, 10),
        flow_intensity: flowIntensity,
        notes: notes || null
      });
      setShowModal(false);
      setNotes("");
      fetchData();
    } catch (err) {
      alert("Failed to save cycle record: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this cycle record?")) {
      try {
        await deleteCycle(id);
        fetchData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
            Cycle Tracker & Prediction
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Track menstrual cycle history, ovulation, and statistical next-period projections.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Log New Cycle</span>
        </button>
      </div>

      <HealthDisclaimer />

      {/* Prediction & Current Phase Card */}
      {prediction && (
        <div className="card" style={{
          background: "linear-gradient(135deg, #FFFFFF, #FFF1F2)",
          border: "1.5px solid var(--primary-200)",
          marginBottom: "2rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div className="card-title" style={{ margin: 0 }}>
              <Sparkles size={22} color="var(--primary-500)" />
              <span>AI Cycle Estimate & Fertile Window</span>
            </div>
            <span className="badge badge-primary" style={{ padding: "0.4rem 0.85rem" }}>
              Estimated Model · {prediction.confidence_level} ({Math.round(prediction.confidence_score * 100)}%)
            </span>
          </div>

          <div className="grid-4" style={{ marginBottom: "1.25rem" }}>
            <div style={{ background: "#FFF", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 700 }}>ESTIMATED NEXT PERIOD</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary-600)" }}>
                {prediction.next_period_start}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Until ~ {prediction.next_period_end}
              </div>
            </div>

            <div style={{ background: "#FFF", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 700 }}>CURRENT CYCLE DAY</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
                Day {prediction.current_cycle_day}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--sage-600)", fontWeight: 600 }}>
                {prediction.current_phase}
              </div>
            </div>

            <div style={{ background: "#FFF", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 700 }}>ESTIMATED OVULATION</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--lilac-600)" }}>
                {prediction.ovulation_date}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Mid-Cycle Phase Peak
              </div>
            </div>

            <div style={{ background: "#FFF", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: 700 }}>ESTIMATED FERTILE WINDOW</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--amber-500)", marginTop: "0.25rem" }}>
                {prediction.fertile_window_start}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                to {prediction.fertile_window_end}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: "0.825rem",
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            borderLeft: "3px solid var(--primary-400)"
          }}>
            ℹ️ {prediction.disclaimer}
          </div>
        </div>
      )}

      {/* Cycle History Table */}
      <div className="card">
        <div className="card-title">
          <Calendar size={20} color="var(--primary-500)" />
          <span>Historical Cycles ({cycles.length} recorded)</span>
        </div>

        {cycles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            <p>No menstrual cycles recorded yet.</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Record First Cycle
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "0.75rem" }}>Start Date</th>
                  <th style={{ padding: "0.75rem" }}>Period Duration</th>
                  <th style={{ padding: "0.75rem" }}>Cycle Length</th>
                  <th style={{ padding: "0.75rem" }}>Flow Intensity</th>
                  <th style={{ padding: "0.75rem" }}>Notes</th>
                  <th style={{ padding: "0.75rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600 }}>{c.start_date}</td>
                    <td style={{ padding: "0.85rem 0.75rem" }}>{c.period_duration} days</td>
                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <span className="badge badge-lilac">{c.cycle_length} days</span>
                    </td>
                    <td style={{ padding: "0.85rem 0.75rem", textTransform: "capitalize" }}>{c.flow_intensity}</td>
                    <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-muted)" }}>{c.notes || "—"}</td>
                    <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn btn-secondary"
                        style={{ padding: "0.3rem 0.6rem", color: "var(--primary-600)" }}
                        title="Delete cycle"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Cycle Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", margin: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Record Menstrual Cycle</h2>
            <form onSubmit={handleAddCycle}>
              <div className="form-group">
                <label className="form-label">Period Start Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Cycle Length (Days)</label>
                  <input
                    type="number"
                    min="18"
                    max="60"
                    className="form-input"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bleeding Days</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    className="form-input"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Flow Intensity</label>
                <select
                  className="form-select"
                  value={flowIntensity}
                  onChange={(e) => setFlowIntensity(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="E.g. Travel, stress, or unusual symptoms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? "Saving..." : "Save Cycle Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
