import React from 'react';
import { Play, Film, Star, Clock, Info } from 'lucide-react';

export default function HeroBanner({ item, onPlay, onOpenTrailer }) {
  if (!item) return null;

  return (
    <div className="hero-banner">
      <div 
        className="hero-backdrop" 
        style={{ backgroundImage: `url(${item.backdrop || item.poster})` }}
      />
      <div className="hero-vignette" />

      <div className="hero-content">
        {item.featuredBadge && (
          <div className="hero-featured-tag">
            <span className="featured-dot" />
            <span>{item.featuredBadge}</span>
          </div>
        )}

        <h1 className="hero-title">{item.title}</h1>

        <div className="hero-meta">
          <div className="hero-rating">
            <Star size={16} className="text-yellow" fill="currentColor" />
            <span>{item.rating || '8.5'}</span>
          </div>
          {item.year && <span className="hero-year">{item.year}</span>}
          {item.duration && (
            <div className="hero-duration">
              <Clock size={14} />
              <span>{item.duration}</span>
            </div>
          )}
          <div className="hero-genres">
            {item.genres?.map(genre => (
              <span key={genre} className="genre-pill">{genre}</span>
            ))}
          </div>
        </div>

        <p className="hero-overview">{item.overview}</p>

        <div className="hero-buttons">
          <button 
            className="hero-btn-play"
            onClick={() => onPlay(item)}
          >
            <Play size={20} fill="currentColor" />
            <span>Watch Now</span>
          </button>

          {item.trailerKey && (
            <button 
              className="hero-btn-trailer"
              onClick={() => onOpenTrailer(item.trailerKey, item.title)}
            >
              <Film size={18} />
              <span>Trailer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
