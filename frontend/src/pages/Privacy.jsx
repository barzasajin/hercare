import React, { useState } from "react";
import { ShieldCheck, Lock, Download, Trash2, Database, EyeOff, CheckCircle } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getCycles, getHealthLogs, getPregnancyProfile, resetDemoData } from "../api";

export default function Privacy() {
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notice, setNotice] = useState("");

  const handleExportData = async () => {
    try {
      setExporting(true);
      const [cycles, logs, preg] = await Promise.all([
        getCycles(),
        getHealthLogs(100),
        getPregnancyProfile()
      ]);

      const exportBundle = {
        exported_at: new Date().toISOString(),
        application: "HerCare AI",
        user: "Sarah Chen",
        records: {
          cycles: cycles || [],
          health_logs: logs || [],
          pregnancy_profile: preg || {}
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `hercare_ai_health_export_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setNotice("Health data package exported successfully as JSON!");
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("WARNING: This will erase all cycles and health logs from your local database. Do you wish to proceed?")) {
      try {
        setResetting(true);
        await resetDemoData();
        setNotice("All cycle and symptom records have been safely erased.");
        setTimeout(() => setNotice(""), 4000);
      } catch (err) {
        alert("Reset failed: " + err.message);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          Data Privacy & Health Information Governance
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          HerCare AI operates under strict privacy-by-design principles. Your personal health records belong solely to you.
        </p>
      </div>

      <HealthDisclaimer />

      {notice && (
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
          <span>{notice}</span>
        </div>
      )}

      {/* Core Privacy Pillars */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        <div className="card">
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
            <Lock size={20} />
          </div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>Local Data Isolation</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            All intimate menstrual logs, symptoms, and pregnancy details are stored directly within your local SQLite database without external ad tracking or data brokers.
          </p>
        </div>

        <div className="card">
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
            <EyeOff size={20} />
          </div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>Zero AI Model Training</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            AI pattern detection and cycle predictions are computed locally via deterministic machine learning algorithms. Your logs are never used to train public language models.
          </p>
        </div>

        <div className="card">
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
            <Database size={20} />
          </div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>PostgreSQL Ready</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            The SQLAlchemy ORM architecture is fully abstracted, allowing seamless migration to enterprise encrypted PostgreSQL instances with zero schema friction.
          </p>
        </div>
      </div>

      {/* User Data Governance & Controls */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Data Portability & Management Controls
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          You retain unmitigated control over your health telemetry. Download a copy of your full records for your physician or wipe your database at any time.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="btn btn-primary"
          >
            <Download size={16} />
            <span>{exporting ? "Preparing Bundle..." : "Export Health Data (JSON)"}</span>
          </button>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="btn btn-secondary"
            style={{ color: "var(--primary-600)" }}
          >
            <Trash2 size={16} />
            <span>{resetting ? "Erasing..." : "Erase All Health Records"}</span>
          </button>
        </div>
      </div>

      {/* Legal & Medical Disclaimer Accordion */}
      <div className="card">
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Regulatory & Scope Classification
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          HerCare AI is classified as a general health, wellness, and self-care tracking platform. Predictions regarding menstrual cycle phases, ovulation windows, and symptom patterns are statistical estimates calculated through statistical linear regression, moving averages, and correlation engines.
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          This software does not offer medical diagnoses, does not prescribe treatments, and must never be utilized as a reliable contraception method or emergency medical assessment tool.
        </p>
      </div>
    </div>
  );
}
