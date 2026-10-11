import React from 'react';
import { History, Play, Trash2 } from 'lucide-react';

export default function WatchHistory({ history = [], onResume, onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="section-container watch-history-section">
      <div className="section-heading-wrap">
        <div className="history-heading">
          <History size={18} className="text-purple" />
          <h3 className="section-title">Continue Watching</h3>
        </div>
        <button 
          className="btn-clear-history" 
          onClick={onClearHistory}
          title="Clear all watch history"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
      </div>

      <div className="history-cards-scroll">
        {history.map((item) => (
          <div 
            key={`${item.id}-${item.season || 1}-${item.episode || 1}`}
            className="history-card"
            onClick={() => onResume(item)}
          >
            <div className="history-thumb-wrap">
              <img 
                src={item.poster} 
                alt={item.title}
                className="history-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="history-play-icon">
                <Play size={16} fill="currentColor" />
              </div>
            </div>

            <div className="history-meta">
              <h5 className="history-title" title={item.title}>{item.title}</h5>
              <div className="history-sub">
                {item.type === 'tv' && <span>S{item.season || 1} : E{item.episode || 1}</span>}
                {item.type === 'anime' && <span>Ep {item.episode || 1} ({item.language?.toUpperCase() || 'SUB'})</span>}
                {item.type === 'movie' && <span>Movie</span>}
                <span className="history-server-tag">{item.server}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
