import React, { useEffect } from 'react';
import { X, Film } from 'lucide-react';
import { getTrailerUrl } from '../services/streamServers';

export default function TrailerModal({ trailerKey, title, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!trailerKey) return null;

  const trailerUrl = getTrailerUrl(trailerKey);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Film className="icon-youtube" size={22} />
            <h3 className="modal-title">{title ? `${title} - Official Trailer` : 'Official Trailer'}</h3>
          </div>
          <button 
            className="btn-icon modal-close-btn" 
            onClick={onClose} 
            title="Close Trailer (Esc)"
            aria-label="Close Trailer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-video-container">
          <iframe
            src={trailerUrl}
            title={`${title || 'Media'} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="trailer-iframe"
          />
        </div>

        <div className="modal-footer">
          <span className="trailer-embed-info">
            Direct YouTube API: <code>{trailerUrl}</code>
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
