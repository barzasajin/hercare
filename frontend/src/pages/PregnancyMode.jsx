import React, { useState, useEffect } from "react";
import { Baby, Calendar, Heart, ShieldAlert, Sparkles, Check, Info } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getPregnancyProfile, updatePregnancyProfile } from "../api";

export default function PregnancyMode() {
  const [profile, setProfile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getPregnancyProfile();
      setProfile(data);
      setIsActive(data.is_active || false);
      setLastPeriodDate(data.last_period_date || "");
      setConceptionDate(data.conception_date || "");
      setDueDate(data.due_date || "");
      setNotes(data.notes || "");
    } catch (err) {
      console.error("Error fetching pregnancy profile:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updatePregnancyProfile({
        is_active: isActive,
        last_period_date: lastPeriodDate || null,
        conception_date: conceptionDate || null,
        due_date: dueDate || null,
        notes: notes || null
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Error saving pregnancy profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          Pregnancy Journey & Wellness Mode
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Track gestational progress, baby development milestones, and trimester-tailored supportive wellness guidance.
        </p>
      </div>

      <HealthDisclaimer />

      {/* Pregnancy Status Switch Card */}
      <div className="card" style={{
        background: isActive ? "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)" : "#FFFFFF",
        border: isActive ? "1.5px solid var(--primary-300)" : "1px solid var(--border-light)",
        marginBottom: "2rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Baby size={22} color="var(--primary-500)" />
              <h2 style={{ fontSize: "1.25rem", color: "var(--text-main)", margin: 0 }}>
                Pregnancy Mode {isActive ? "Active" : "Disabled"}
              </h2>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {isActive
                ? "Cycle predictions are paused; maternal wellness milestones and due date guidance are active."
                : "Enable to calculate gestational week, trimester milestones, and maternal nutrition advice."}
            </p>
          </div>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`btn ${isActive ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.6rem 1.25rem" }}
          >
            {isActive ? "Turn Off Pregnancy Mode" : "Activate Pregnancy Mode"}
          </button>
        </div>
      </div>

      {isActive && profile && (
        <>
          {/* Active Pregnancy Snapshot */}
          <div className="grid-3" style={{ marginBottom: "2rem" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                GESTATIONAL PROGRESS
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-600)", margin: "0.25rem 0" }}>
                Week {profile.current_week || "—"}
              </div>
              <span className="badge badge-lilac">
                Trimester {profile.current_trimester || "1"}
              </span>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                BABY SIZE ANALOGY
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)", margin: "0.5rem 0" }}>
                🥑 {profile.baby_size || "Developing"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Approximate developmental scale
              </div>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                COUNTDOWN TO DUE DATE
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--sage-600)", margin: "0.25rem 0" }}>
                {profile.days_remaining !== null ? `${profile.days_remaining} Days` : "—"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Estimated EDD: {profile.due_date || "Not set"}
              </div>
            </div>
          </div>

          {/* Trimester Wellness Guidance */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div className="card-title">
              <Sparkles size={20} color="var(--primary-500)" />
              <span>Trimester {profile.current_trimester || "1"} Supportive Wellness Protocol</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(profile.trimester_tips && profile.trimester_tips.length > 0 ? profile.trimester_tips : [
                "Stay consistently hydrated with 8-10 glasses of water daily.",
                "Prioritize small, frequent meals with iron and folate.",
                "Allow yourself ample restorative naps during early weeks."
              ]).map((tip, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.85rem 1rem",
                  background: "var(--bg-app)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)"
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--primary-100)",
                    color: "var(--primary-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pregnancy Dates & Settings Form */}
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>
          Pregnancy Parameters & Journal
        </h2>

        {saveSuccess && (
          <div style={{
            background: "var(--sage-100)",
            color: "var(--sage-600)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            fontWeight: 600
          }}>
            <Check size={18} />
            <span>Pregnancy profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Last Menstrual Period Date (LMP)</label>
              <input
                type="date"
                className="form-input"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                Used to calculate gestational age and estimated due date (40 weeks).
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Conception Date (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={conceptionDate}
                onChange={(e) => setConceptionDate(e.target.value)}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                Alternative reference date if LMP is uncertain.
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Maternal Reflections & Personal Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Record baby kicks, cravings, midwife appointment notes, or personal milestones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: "0.65rem 1.75rem" }}
            >
              {saving ? "Saving..." : "Save Pregnancy Settings"}
            </button>
          </div>
        </form>
      </div>

      <div style={{
        marginTop: "2rem",
        background: "var(--bg-card)",
        padding: "1rem 1.25rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.825rem",
        color: "var(--text-muted)"
      }}>
        <Info size={18} color="var(--primary-500)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Prenatal Care Reminder:</strong> Always attend scheduled appointments with your obstetrician or midwife. HerCare AI is designed solely for personal day-to-day comfort and lifestyle habit tracking.
        </span>
      </div>
    </div>
  );
}
