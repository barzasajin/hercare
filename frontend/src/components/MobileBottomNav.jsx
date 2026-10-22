import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  PlusCircle,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  BarChart2,
  Baby,
  Heart,
  ShieldCheck,
} from "lucide-react";

export default function MobileBottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const mainTabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cycle-tracker", label: "Cycle", icon: Calendar },
    { to: "/health-log", label: "Log", icon: PlusCircle, isAction: true },
    { to: "/ai-insights", label: "Insights", icon: Sparkles },
  ];

  const moreItems = [
    { to: "/what-changed", label: "What Changed?", icon: TrendingUp, desc: "Baseline vs 7-day comparison" },
    { to: "/patterns", label: "Health Patterns", icon: BarChart2, desc: "Sleep, energy & pain trends" },
    { to: "/pregnancy-mode", label: "Pregnancy Mode", icon: Baby, desc: "Trimester guides & milestone countdown" },
    { to: "/personalized-support", label: "Self Care & Sanctuary", icon: Heart, desc: "Breathing, hydration & nutrition" },
    { to: "/privacy", label: "Privacy & Data Export", icon: ShieldCheck, desc: "Local SQLite storage & backup" },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>More Health Features</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>HerCare AI Mobile Companion</p>
              </div>
              <button
                className="mobile-drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-list">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="mobile-drawer-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="mobile-drawer-icon-wrap">
                      <Icon size={18} color="var(--primary-600)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-main)" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                        {item.desc}
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Native-Style Bottom Tab Bar */}
      <nav className="mobile-bottom-nav">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                `mobile-nav-tab ${isActive ? "active" : ""} ${tab.isAction ? "action-tab" : ""}`
              }
            >
              <div className="mobile-nav-icon-container">
                <Icon size={tab.isAction ? 24 : 20} />
              </div>
              <span className="mobile-nav-label">{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          className={`mobile-nav-tab ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open More Menu"
        >
          <div className="mobile-nav-icon-container">
            <Menu size={20} />
          </div>
          <span className="mobile-nav-label">More</span>
        </button>
      </nav>
    </>
  );
}
