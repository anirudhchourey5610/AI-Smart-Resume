import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navClassName({ isActive }) {
  return `dash-nav-item${isActive ? " dash-nav-item--active" : ""}`;
}

function DashboardLayout({ brandTag = "Job dashboard", mobileEyebrow, children }) {
  const { logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="dash-sidebar" aria-label="Main navigation">
        <div className="dash-sidebar__brand">
          <span className="dash-sidebar__logo">AutomateAI / SmartJob</span>
          <span className="dash-sidebar__tag">{brandTag}</span>
        </div>

        <nav className="dash-sidebar__nav">
          <NavLink to="/dashboard" end className={navClassName}>
            <DashIconBriefcase /> Dashboard
          </NavLink>

          <NavLink to="/dashboard/ai-optimizer" className={navClassName}>
            <DashIconSparkles /> AI optimizer
          </NavLink>

          <NavLink to="/resumes" className={navClassName}>
            <DashIconFile /> Resumes
          </NavLink>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="dash-scroll-shell">
          <div className="dash-scroll-inner">
            <div className="dash-content-wrap">
              <div className="dash-toolbar dash-toolbar--layout">
                <div className="dash-toolbar__topline">
                  <div className="dash-toolbar__brandlock">
                    <span className="dash-toolbar__eyebrow">
                      {mobileEyebrow ?? "SmartJob dashboard"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="dash-btn dash-btn--ghost dash-btn--topbar"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </div>
              </div>

              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashIconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M4 8h16v9.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5V8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIconSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 3 1.55 4.45L18 9l-4.45 1.55L12 15l-1.55-4.45L6 9l4.45-1.55L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m18.5 15 .75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25-2.25-.75 2.25-.75.75-2.25Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIconFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.75h5.5L19 9.25v10A1.75 1.75 0 0 1 17.25 21h-9.5A1.75 1.75 0 0 1 6 19.25v-13.5A1.75 1.75 0 0 1 7.75 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.75v4.5A1 1 0 0 0 14.5 9.25H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default DashboardLayout;
