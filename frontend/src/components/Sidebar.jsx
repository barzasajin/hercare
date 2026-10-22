import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  ClipboardList,
  Sparkles,
  TrendingUp,
  BarChart2,
  Heart,
  ShieldCheck,
  Baby
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/cycle-tracker", label: "Cycle Tracker", icon: Calendar },
    { to: "/health-log", label: "Health Log", icon: ClipboardList },
    { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
    { to: "/what-changed", label: "What Changed?", icon: TrendingUp },
    { to: "/patterns", label: "Patterns", icon: BarChart2 },
    { to: "/pregnancy-mode", label: "Pregnancy Mode", icon: Baby },
    { to: "/personalized-support", label: "Personalized Support", icon: Heart },
    { to: "/privacy", label: "Privacy & Data", icon: ShieldCheck },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <div className="sidebar-brand-name">HerCare AI</div>
          <div className="sidebar-brand-subtitle">Health & Wellness</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link-item ${isActive ? "active" : ""}`
              }
              end={item.to === "/"}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: "1rem 0.5rem 0 0.5rem", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-light)", textAlign: "center" }}>
          Wellness Support Companion
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--primary-500)", textAlign: "center", fontWeight: 600 }}>
          AI Health Intelligence v1.0
        </div>
      </div>
    </aside>
  );
}
