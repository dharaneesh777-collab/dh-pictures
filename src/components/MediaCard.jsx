import React from 'react';
import { Play, Film, Star, Heart, Download } from 'lucide-react';

const TMDB_FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg';

export default function MediaCard({
  item,
  onPlay,
  onOpenTrailer,
  isFavorite,
  onToggleFavorite,
  showBadge = false,
  onDownload
}) {
  const isHindi = item.isHindi || item.preferredServer === 'server6';
  const isAnime = item.type === 'anime';

  // Format type and year in Flixeo style: e.g. "Movie • 2026" or "TV • 2024"
  const typeLabel = isAnime ? 'Anime' : item.type === 'tv' ? 'TV' : 'Movie';
  const yearLabel = item.year ? String(item.year).split('-')[0] : '2024';

  return (
    <div className="media-card" onClick={() => onPlay(item)}>
      <div className="card-poster-wrap">
        <img
          src={item.poster || TMDB_FALLBACK_POSTER}
          alt={item.title}
          loading="lazy"
          className="card-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = TMDB_FALLBACK_POSTER;
          }}
        />

        {/* Badges - shown only when explicitly enabled */}
        {showBadge && (
          <div className="card-badge-wrap">
            {item.rating && (
              <span className="card-rating-badge">
                <Star size={11} fill="currentColor" />
                <span>{item.rating}</span>
              </span>
            )}

            {isHindi && <span className="card-lang-badge hindi">Hindi</span>}
            {isAnime && <span className="card-lang-badge anime">Anime</span>}
          </div>
        )}

        {/* Flixeo Hover Actions Overlay */}
        <div className="card-hover-overlay">
          <button 
            className="card-play-btn"
            title="Stream Now"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
          >
            <Play size={20} fill="currentColor" />
          </button>

          <div className="card-action-bar">
            {onDownload && (
              <button
                className="card-mini-btn"
                title="Download to Local Device"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item);
                }}
              >
                <Download size={14} />
              </button>
            )}

            {item.trailerKey && (
              <button
                className="card-mini-btn"
                title="Watch Trailer"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTrailer(item.trailerKey, item.title);
                }}
              >
                <Film size={14} />
              </button>
            )}

            <button
              className={`card-mini-btn ${isFavorite ? 'favorited' : ''}`}
              title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item);
              }}
            >
              <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="card-meta">
        <h4 className="card-title" title={item.title}>{item.title}</h4>
        <div className="card-sub-info">
          <span>{typeLabel} • {yearLabel}</span>
        </div>
      </div>
    </div>
  );
}
