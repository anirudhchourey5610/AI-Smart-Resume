import React, { memo } from "react";

function ActivitySection({ loading, recentActivity }) {
  return (
    <aside className="glass-panel dash-activity-panel">
      <div className="dash-section-heading">
        <div>
          <p className="dash-section-heading__eyebrow">Recent activity</p>
          <h2>Latest AI-assisted actions</h2>
        </div>
      </div>

      <div className="dash-activity-list">
        {(loading ? Array.from({ length: 5 }, (_, index) => ({ id: index })) : recentActivity).map(
          (item) =>
            loading ? (
              <div key={item.id} className="dash-activity-item dash-activity-item--skeleton" />
            ) : (
              <article key={item.id} className="dash-activity-item">
                <div className="dash-activity-item__icon">{item.icon}</div>
                <div className="dash-activity-item__content">
                  <h3>{item.title}</h3>
                  <span>{item.time}</span>
                </div>
              </article>
            )
        )}
      </div>
    </aside>
  );
}

export default memo(ActivitySection);
