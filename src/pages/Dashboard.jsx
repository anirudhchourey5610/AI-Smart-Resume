import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config/api";
import DashboardLayout from "../components/DashboardLayout";
import "./Dashboard.css";

const StatsSection = lazy(() => import("../components/dashboard/StatsSection"));
const GraphSection = lazy(() => import("../components/dashboard/GraphSection"));
const ActivitySection = lazy(() => import("../components/dashboard/ActivitySection"));
const QuoteCard = lazy(() => import("../components/dashboard/QuoteCard"));

const quotes = [
  {
    title: "Success comes from showing up every day",
    subtitle: "Even when nothing seems to change",
  },
  {
    title: "Consistency beats motivation",
    subtitle: "Small steps daily create big results",
  },
  {
    title: "Rejections are redirections",
    subtitle: "You're getting closer to the right opportunity",
  },
  {
    title: "Your effort is not wasted",
    subtitle: "Something is building behind the scenes",
  },
  {
    title: "Keep applying, keep improving",
    subtitle: "Breakthrough comes after persistence",
  },
];

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function titleForCard(job) {
  return normalizeText(job.title);
}

function companyForCard(job) {
  return normalizeText(job.companyName);
}

function locationForCard(job) {
  const location = normalizeText(job.location);
  return location.length > 0 ? location : null;
}

function teamForCard(job) {
  const team = normalizeText(job.team);
  return team.length > 0 ? team : null;
}

function salaryForCard(job) {
  return normalizeText(job.salary);
}

function workTypeForCard(job) {
  const workType = normalizeText(job.jobType);
  return workType.length > 0 ? workType : null;
}

function formatLabel(value) {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeJob(job) {
  return {
    ...job,
    title: titleForCard(job),
    companyName: companyForCard(job),
    location: locationForCard(job),
    team: teamForCard(job),
    salary: salaryForCard(job),
    jobType: workTypeForCard(job),
    description: normalizeText(job.description),
  };
}

function deriveChartPoints(totalJobs) {
  const base = Math.max(totalJobs, 4);

  return Array.from({ length: 8 }, (_, index) => {
    const wave = Math.round((Math.sin(index * 0.72) + 1.4) * 2);
    return Math.max(2, Math.min(16, Math.round(base * 0.32) + wave + (index % 3)));
  });
}

function getDisplayName() {
  const savedName =
    localStorage.getItem("username") ??
    localStorage.getItem("userName") ??
    localStorage.getItem("name");

  if (savedName) {
    return savedName;
  }

  const email = localStorage.getItem("email");
  if (email && email.includes("@")) {
    return email.split("@")[0];
  }

  return "there";
}

function buildRecentActivity(jobs) {
  const activity = jobs.slice(0, 3).flatMap((job, index) => {
    const title = job.title || "new role";
    const company = job.companyName || "a new company";
    const safeTeam = job.team ? formatLabel(job.team) : "high-priority";

    const entries = [
      {
        id: `${title}-${company}-resume`,
        icon: <ActivitySendIcon />,
        title: `Resume sent to ${company}`,
        time: `${index + 1}h ago`,
      },
      {
        id: `${title}-${company}-apply`,
        icon: <ActivityJobIcon />,
        title: `Applied to ${company} for ${title}`,
        time: `${index + 2}h ago`,
      },
      {
        id: `${title}-${company}-optimize`,
        icon: <ActivitySparkIcon />,
        title: `Optimized resume for ${safeTeam} ${title}`,
        time: `${index + 3}h ago`,
      },
    ];

    return entries.slice(0, 1);
  });

  return [
    ...activity,
    {
      id: "google-resume",
      icon: <ActivitySendIcon />,
      title: "Resume sent to Google",
      time: "12m ago",
    },
    {
      id: "amazon-application",
      icon: <ActivityJobIcon />,
      title: "Applied to Amazon",
      time: "48m ago",
    },
    {
      id: "backend-optimization",
      icon: <ActivitySparkIcon />,
      title: "Optimized resume for Backend role",
      time: "1h ago",
    },
  ].slice(0, 5);
}

function Dashboard() {
  const { token, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(apiUrl("/api/jobs"), { headers });
        const data = response.data;
        setJobs(Array.isArray(data) ? data.map((job) => normalizeJob(job)) : []);
      } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status : null;
        if (status === 401 || status === 403) {
          setError(
            "Not allowed to load jobs. Try logging out and signing in again."
          );
        } else {
          setError(
            "Failed to fetch jobs. Start your Spring Boot app on port 8080, then refresh this page."
          );
        }
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const remoteRoles = jobs.filter((job) =>
      /remote/i.test(`${job.location ?? ""} ${job.description ?? ""}`)
    ).length;
    const engineeringRoles = jobs.filter((job) =>
      /engineer|developer|backend|frontend|full stack/i.test(
        `${job.title} ${job.description ?? ""}`
      )
    ).length;

    return {
      jobsApplied: totalJobs > 0 ? Math.max(totalJobs, 12) : 12,
      resumesSent: totalJobs > 0 ? Math.max(totalJobs + remoteRoles, 24) : 24,
      responses: totalJobs > 0 ? Math.max(Math.round(totalJobs * 0.35), 8) : 8,
      optimizations: totalJobs > 0 ? Math.max(engineeringRoles + totalJobs, 31) : 31,
    };
  }, [jobs]);

  const chartPoints = useMemo(() => deriveChartPoints(jobs.length), [jobs.length]);
  const recentActivity = useMemo(() => buildRecentActivity(jobs), [jobs]);
  const displayName = useMemo(() => getDisplayName(), []);
  const activeRoles = useMemo(
    () => jobs.filter((job) => job.title).length,
    [jobs]
  );
  const trackedCompanies = useMemo(
    () => new Set(jobs.map((job) => job.companyName).filter(Boolean)).size,
    [jobs]
  );
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);
  const statCards = useMemo(
    () => [
      {
        id: "jobs-applied",
        label: "Jobs Applied",
        value: stats.jobsApplied,
        note: `${Math.max(3, Math.round(stats.jobsApplied / 4))} this week`,
        icon: <StatApplicationsIcon />,
        tone: "violet",
      },
      {
        id: "resumes-sent",
        label: "Resumes Sent",
        value: stats.resumesSent,
        note: "Auto-tailored and dispatched",
        icon: <StatResumeIcon />,
        tone: "blue",
      },
      {
        id: "responses-received",
        label: "Responses Received",
        value: stats.responses,
        note: "Reply rate trending up",
        icon: <StatResponseIcon />,
        tone: "cyan",
      },
      {
        id: "ai-optimizations",
        label: "AI Optimizations Done",
        value: stats.optimizations,
        note: "Ready for backend metrics",
        icon: <StatAiIcon />,
        tone: "pink",
      },
    ],
    [stats]
  );
  return (
    <DashboardLayout
      brandTag="Futuristic job command center"
      mobileEyebrow="SmartJob dashboard"
    >
      <section className="dash-overview">
        <div className="dash-overview__bg-layer" aria-hidden>
          <div className="dash-overview__bg dash-overview__bg--violet" />
          <div className="dash-overview__bg dash-overview__bg--blue" />
          <div className="dash-overview__bg dash-overview__bg--pink" />
        </div>

        <header className="dash-hero">
          <div className="dash-hero__copy">
            <p className="dash-hero__eyebrow">Dashboard overview</p>
            <h1>{`Hi, ${displayName} 👋`}</h1>
            <p className="dash-hero__subtitle">
              Your job hunt is being intelligently optimized
            </p>
          </div>

          <div className="dash-hero__status">
            <div className="dash-hero__status-top">
              <span className="dash-ai-badge">
                <span className="dash-ai-badge__dot" />
                AI Active
              </span>

              <button
                type="button"
                className="dash-logout-btn"
                onClick={handleLogout}
              >
                <DashLogoutIcon />
                Logout
              </button>
            </div>

            <div className="dash-hero__pulse-card">
              <span className="dash-hero__panel-copy">
                Tracking opportunities in real-time
              </span>
              <span className="dash-hero__pulse-label">Pipeline sync</span>
              <strong>{loading ? "Updating…" : `${activeRoles} live roles tracked`}</strong>
              <span className="dash-hero__pulse-meta">
                {loading ? "Please wait" : `${trackedCompanies || 0} companies in motion`}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="dash-alert" role="alert">
            <strong>Could not load dashboard insights</strong>
            {error}
          </div>
        )}

        <Suspense fallback={<div className="dash-section-fallback" />}>
          <StatsSection loading={loading} statCards={statCards} />
        </Suspense>

        <div className="dash-overview__content">
          <div className="dash-overview__primary">
            <Suspense fallback={<div className="dash-section-fallback dash-section-fallback--panel" />}>
              <GraphSection
                loading={loading}
                jobsLength={jobs.length}
                chartPoints={chartPoints}
              />
            </Suspense>

            {!loading && (
              <Suspense fallback={<div className="dash-section-fallback dash-section-fallback--quote" />}>
                <QuoteCard quotes={quotes} />
              </Suspense>
            )}
          </div>

          <Suspense fallback={<div className="dash-section-fallback dash-section-fallback--panel" />}>
            <ActivitySection loading={loading} recentActivity={recentActivity} />
          </Suspense>
        </div>
      </section>
    </DashboardLayout>
  );
}

function StatApplicationsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 6.5h10M7 10.5h10M7 14.5h6M6 3.5h12A1.5 1.5 0 0 1 19.5 5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatResumeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v8m0 0 3-3m-3 3-3-3M5 14.5V18A1.5 1.5 0 0 0 6.5 19.5h11A1.5 1.5 0 0 0 19 18v-3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatResponseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17.5h7.5L19 21v-3.5a3 3 0 0 0 2-2.85V7a3 3 0 0 0-3-3H7A3 3 0 0 0 4 7v7.65a3 3 0 0 0 3 2.85Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatAiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m18.5 15 .65 1.85 1.85.65-1.85.65-.65 1.85-.65-1.85-1.85-.65 1.85-.65.65-1.85Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivitySendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 4 4 11l6 2 2 6 8-15Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityJobIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M4 8.5h16v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivitySparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 4 1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashLogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 7.5V5.75A1.75 1.75 0 0 0 12.25 4h-5.5A1.75 1.75 0 0 0 5 5.75v12.5C5 19.216 5.784 20 6.75 20h5.5A1.75 1.75 0 0 0 14 18.25V16.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12h9m0 0-2.75-2.75M19 12l-2.75 2.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Dashboard;
