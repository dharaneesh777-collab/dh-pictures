import React, { useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import MediaCard from './MediaCard';
import { RECOMMENDED_TITLES, TV_SHOWS, CURATED_MOVIES } from '../services/catalogData';

export default function RecommendedSection({
  onPlay,
  onOpenTrailer,
  favorites = [],
  onToggleFavorite,
  onDownload
}) {
  const [filter, setFilter] = useState('movies');

  const displayedItems = useMemo(() => {
    if (filter === 'movies') {
      // Return movies with Flixeo row 1 front and center
      return RECOMMENDED_TITLES.filter(item => item.type === 'movie');
    }
    if (filter === 'tv') {
      return TV_SHOWS;
    }
    // 'popular'
    return [
      ...RECOMMENDED_TITLES.slice(0, 6),
      ...CURATED_MOVIES.slice(0, 4),
      ...TV_SHOWS.slice(0, 2)
    ];
  }, [filter]);

  return (
    <section className="recommended-section">
      <div className="recommended-header">
        <div className="recommended-title-wrap">
          <span className="recommended-play-icon">
            <Play size={18} fill="currentColor" />
          </span>
          <h2 className="recommended-heading">RECOMMENDED</h2>
        </div>

        <div className="recommended-pills">
          <button
            className={`rec-pill-btn ${filter === 'movies' ? 'active' : ''}`}
            onClick={() => setFilter('movies')}
          >
            Movies
          </button>
          <button
            className={`rec-pill-btn ${filter === 'tv' ? 'active' : ''}`}
            onClick={() => setFilter('tv')}
          >
            TV Series
          </button>
          <button
            className={`rec-pill-btn ${filter === 'popular' ? 'active' : ''}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      <div className="recommended-grid">
        {displayedItems.map((item) => {
          const isFav = favorites.some(f => f.id === item.id);
          return (
            <MediaCard
              key={`rec-${item.type}-${item.id}`}
              item={item}
              onPlay={onPlay}
              onOpenTrailer={onOpenTrailer}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              onDownload={onDownload}
            />
          );
        })}
      </div>
    </section>
  );
}
