import React from "react";
import { AlertCircle } from "lucide-react";

export default function HealthDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.75rem",
        color: "var(--text-light)",
        marginTop: "1rem"
      }}>
        <AlertCircle size={13} color="var(--primary-400)" />
        <span>For wellness support only. AI estimates are not medical diagnoses.</span>
      </div>
    );
  }

  return (
    <div className="disclaimer-banner">
      <AlertCircle size={18} className="disclaimer-icon" />
      <div>
        <strong>Important Health & Wellness Notice:</strong> HerCare AI provides wellness information
        and estimated predictions based on user-provided data. It is not intended to diagnose,
        treat, or prevent medical conditions and should not replace professional medical advice.
      </div>
    </div>
  );
}
