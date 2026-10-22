import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { BarChart2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import HealthDisclaimer from "../components/HealthDisclaimer";
import { getAIPatterns, getCycles } from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Patterns() {
  const [patterns, setPatterns] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patternsData, cyclesData] = await Promise.all([
        getAIPatterns(),
        getCycles()
      ]);
      setPatterns(patternsData);
      setCycles(cyclesData || []);
    } catch (err) {
      console.error("Error loading patterns:", err);
    } finally {
      setLoading(false);
    }
  };

  // Phase vs. Pain Chart Data
  const phasePain = patterns?.phase_pain_averages || {};
  const painChartData = {
    labels: ["Menstrual", "Follicular", "Ovulatory", "Luteal"],
    datasets: [
      {
        label: "Avg Discomfort (0-10)",
        data: [
          phasePain["Menstrual"] || 0,
          phasePain["Follicular"] || 0,
          phasePain["Ovulatory"] || 0,
          phasePain["Luteal"] || 0,
        ],
        backgroundColor: [
          "rgba(244, 63, 94, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)"
        ],
        borderRadius: 8
      }
    ]
  };

  // Cycle Length History Chart Data
  const cycleChartData = {
    labels: cycles.map((c, i) => `Cycle ${cycles.length - i} (${c.start_date})`),
    datasets: [
      {
        label: "Cycle Length (Days)",
        data: cycles.map((c) => c.cycle_length),
        backgroundColor: "rgba(225, 29, 72, 0.65)",
        borderColor: "rgba(225, 29, 72, 1)",
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  // Top Recurring Symptoms Chart Data
  const topSymptoms = patterns?.top_recurring_symptoms || [];
  const symptomsChartData = {
    labels: topSymptoms.map((s) => s.symptom),
    datasets: [
      {
        label: "Frequency (% of logs)",
        data: topSymptoms.map((s) => s.percentage),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderRadius: 8
      }
    ]
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="serif-heading" style={{ fontSize: "1.85rem", color: "var(--primary-700)" }}>
          Health Patterns & Recurring Trends
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Visual correlation analytics uncovering links between sleep, energy, cycle phases, and physical comfort.
        </p>
      </div>

      <HealthDisclaimer />

      {/* Sleep vs Energy Key Insight */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #F0FDF4, #FFFFFF)",
        border: "1px solid var(--sage-100)",
        marginBottom: "2rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span className="badge badge-sage">Correlation Analysis</span>
          <span style={{ fontSize: "0.85rem", color: "var(--sage-600)", fontWeight: 700 }}>
            Pearson r = {patterns?.sleep_energy_correlation !== null ? patterns?.sleep_energy_correlation : "N/A"}
          </span>
        </div>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>
          Sleep & Daytime Vitality Connection
        </h3>
        <p style={{ fontSize: "0.925rem", color: "var(--text-muted)" }}>
          {patterns?.sleep_energy_insight || "Record sleep and energy daily to calculate your personal correlation score."}
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        {/* Phase vs Pain Level */}
        <div className="card">
          <div className="card-title">
            <BarChart2 size={20} color="var(--primary-500)" />
            <span>Cycle Phase vs. Discomfort (0-10)</span>
          </div>
          <div style={{ height: "260px" }}>
            <Bar
              data={painChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, max: 10 }
                }
              }}
            />
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem", textAlign: "center" }}>
            Cramping typically peaks during early Menstrual days and subsides in the Follicular phase.
          </div>
        </div>

        {/* Top Recurring Symptoms */}
        <div className="card">
          <div className="card-title">
            <Sparkles size={20} color="var(--lilac-500)" />
            <span>Top Recurring Symptoms (% of Logs)</span>
          </div>
          <div style={{ height: "260px" }}>
            {topSymptoms.length > 0 ? (
              <Bar
                data={symptomsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  scales: {
                    x: { beginAtZero: true, max: 100 }
                  }
                }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                Awaiting symptom log records
              </div>
            )}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem", textAlign: "center" }}>
            Proactive symptom tracking helps anticipate bodily changes before each cycle phase.
          </div>
        </div>
      </div>

      {/* Cycle Duration History Bar Chart */}
      <div className="card">
        <div className="card-title">
          <TrendingUp size={20} color="var(--primary-500)" />
          <span>Cycle Length Consistency Across Time</span>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          {patterns?.cycle_variation_summary}
        </p>
        <div style={{ height: "260px" }}>
          {cycles.length > 0 ? (
            <Bar
              data={cycleChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: false, min: 20, max: 45 }
                }
              }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
              Record cycle dates to visualize length variations over time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
