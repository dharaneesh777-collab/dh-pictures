import React, { useState } from 'react';
import { TOP_5_DATA } from '../services/catalogData';

const TMDB_FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg';

export default function TopFiveSidebar({ onPlay }) {
  const [activeTimeframe, setActiveTimeframe] = useState('day');

  const currentList = TOP_5_DATA[activeTimeframe] || TOP_5_DATA.day;

  return (
    <aside className="top5-sidebar">
      <div className="top5-header">
        <div className="top5-title-wrap">
          <span className="top5-indicator" />
          <h3 className="top5-title">TOP 5</h3>
        </div>

        <div className="top5-tabs">
          <button
            className={`top5-tab-btn ${activeTimeframe === 'day' ? 'active' : ''}`}
            onClick={() => setActiveTimeframe('day')}
          >
            DAY
          </button>
          <button
            className={`top5-tab-btn ${activeTimeframe === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTimeframe('week')}
          >
            WEEK
          </button>
          <button
            className={`top5-tab-btn ${activeTimeframe === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTimeframe('month')}
          >
            MONTH
          </button>
        </div>
      </div>

      <div className="top5-list">
        {currentList.map((item, index) => {
          const rankNum = item.rank || index + 1;
          const typeLabel = item.type === 'tv' ? 'TV' : item.type === 'anime' ? 'Anime' : 'Movie';
          const yearLabel = item.year ? String(item.year).split('-')[0] : '2024';

          return (
            <div
              key={`${activeTimeframe}-${item.id}`}
              className="top5-item"
              onClick={() => onPlay(item)}
            >
              <div className="top5-poster-container">
                <img
                  src={item.poster || TMDB_FALLBACK_POSTER}
                  alt={item.title}
                  className="top5-poster"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = TMDB_FALLBACK_POSTER;
                  }}
                />
                <span className="top5-rank-number">{rankNum}</span>
              </div>

              <div className="top5-info">
                <h4 className="top5-item-title" title={item.title}>
                  {item.title}
                </h4>
                <div className="top5-item-meta">
                  <span>{typeLabel} • {yearLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
