import React, { memo } from "react";

function ApplicationsChart({ points }) {
  const maxValue = Math.max(...points, 1);
  const width = 560;
  const height = 220;
  const stepX = width / Math.max(points.length - 1, 1);

  const polyline = points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - (point / maxValue) * 168 - 20;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="dash-chart">
      <div className="dash-chart__surface">
        <svg
          className="dash-chart__svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="dash-chart-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="dash-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.22)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => {
            const y = 28 + line * 42;
            return (
              <line
                key={line}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                className="dash-chart__grid"
              />
            );
          })}

          <path
            d={`M0 ${height} L ${polyline} L ${width} ${height} Z`}
            fill="url(#dash-chart-fill)"
          />
          <polyline
            points={polyline}
            fill="none"
            stroke="url(#dash-chart-line)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => {
            const x = index * stepX;
            const y = height - (point / maxValue) * 168 - 20;
            return (
              <circle
                key={`${point}-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#0b1020"
                stroke="url(#dash-chart-line)"
                strokeWidth="2.5"
              />
            );
          })}
        </svg>
      </div>

      <div className="dash-chart__labels" aria-hidden>
        {["Day 1", "Day 3", "Day 5", "Day 7", "Day 9", "Day 11", "Day 13", "Day 15"]
          .slice(0, points.length)
          .map((label) => (
            <span key={label}>{label}</span>
          ))}
      </div>
    </div>
  );
}

function GraphSection({ loading, jobsLength, chartPoints }) {
  return (
    <section className="glass-panel dash-chart-panel">
      <div className="dash-section-heading">
        <div>
          <p className="dash-section-heading__eyebrow">Momentum</p>
          <h2>Applications in last 7–15 days</h2>
        </div>
        <span className="dash-section-heading__pill">
          {loading ? "Syncing" : `${jobsLength || 15} tracked signals`}
        </span>
      </div>

      {loading ? (
        <div className="dash-chart-panel__loading" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      ) : (
        <ApplicationsChart points={chartPoints} />
      )}
    </section>
  );
}

export default memo(GraphSection);
