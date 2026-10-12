import React from 'react';
import MediaCard from './MediaCard';

export default function MediaGrid({
  title,
  subtitle,
  items,
  onPlay,
  onOpenTrailer,
  favorites = [],
  onToggleFavorite,
  emptyMessage,
  onDownload
}) {
  if (!items || items.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="section-container">
        <div className="section-heading-wrap">
          <h3 className="section-title">{title}</h3>
        </div>
        <div className="empty-state-box">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-heading-wrap">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <span className="items-count-badge">{items.length} titles</span>
      </div>

      <div className="media-grid">
        {items.map((item) => {
          const isFav = favorites.some(f => f.id === item.id);
          return (
            <MediaCard
              key={`${item.type}-${item.id}`}
              item={item}
              onPlay={onPlay}
              onOpenTrailer={onOpenTrailer}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              showBadge={true}
              onDownload={onDownload}
            />
          );
        })}
      </div>
    </div>
  );
}
