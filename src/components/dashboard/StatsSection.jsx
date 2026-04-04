import React, { memo } from "react";

function StatsSection({ loading, statCards }) {
  return (
    <section className="dash-stats-grid" aria-label="Overview stats">
      {(loading ? Array.from({ length: 4 }, (_, index) => ({ id: index })) : statCards).map(
        (item) =>
          loading ? (
            <div key={item.id} className="overview-card overview-card--skeleton" />
          ) : (
            <article key={item.id} className={`overview-card overview-card--${item.tone}`}>
              <div className="overview-card__glow" aria-hidden />
              <div className="overview-card__icon">{item.icon}</div>
              <div className="overview-card__content">
                <span className="overview-card__label">{item.label}</span>
                <strong className="overview-card__value">{item.value}</strong>
                <span className="overview-card__note">{item.note}</span>
              </div>
            </article>
          )
      )}
    </section>
  );
}

export default memo(StatsSection);
