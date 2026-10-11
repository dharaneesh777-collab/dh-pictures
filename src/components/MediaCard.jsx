import React from 'react';
import { Play, Film, Star, Heart } from 'lucide-react';

export default function MediaCard({
  item,
  onPlay,
  onOpenTrailer,
  isFavorite,
  onToggleFavorite
}) {
  const isHindi = item.isHindi || item.preferredServer === 'server6';
  const isAnime = item.type === 'anime';

  return (
    <div className="media-card" onClick={() => onPlay(item)}>
      <div className="card-poster-wrap">
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          className="card-poster"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
          }}
        />

        <div className="card-badge-wrap">
          {item.rating && (
            <span className="card-rating-badge">
              <Star size={12} fill="currentColor" />
              <span>{item.rating}</span>
            </span>
          )}

          {isHindi && <span className="card-lang-badge hindi">Hindi</span>}
          {isAnime && <span className="card-lang-badge anime">Anime</span>}
          {item.type === 'tv' && !isAnime && <span className="card-lang-badge tv">TV Series</span>}
        </div>

        {/* Hover Actions Overlay */}
        <div className="card-hover-overlay">
          <button 
            className="card-play-btn"
            title="Stream Now"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
          >
            <Play size={22} fill="currentColor" />
          </button>

          <div className="card-action-bar">
            {item.trailerKey && (
              <button
                className="card-mini-btn"
                title="Watch Trailer"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTrailer(item.trailerKey, item.title);
                }}
              >
                <Film size={15} />
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
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="card-meta">
        <h4 className="card-title" title={item.title}>{item.title}</h4>
        <div className="card-sub-info">
          <span>{item.year || '2024'}</span>
          {item.genres && item.genres[0] && (
            <span className="card-genre-dot">• {item.genres[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
