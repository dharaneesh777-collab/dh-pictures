import React, { useState } from 'react';
import { Tv, Play, Hash, Download } from 'lucide-react';

const CHUNK_SIZE = 50;

export default function EpisodeSelector({
  media,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
  onSelectSeason,
  onDownloadEpisode
}) {
  const [jumpInput, setJumpInput] = useState('');
  const [selectedChunk, setSelectedChunk] = useState(null);

  if (!media || (media.type !== 'tv' && media.type !== 'anime')) {
    return null;
  }

  const isAnime = media.type === 'anime';

  // For Anime, total episodes
  const totalAnimeEpisodes = Math.max(1, media.episodesCount || 12);

  // For TV, get seasons list
  const seasons = media.seasons || [
    { seasonNumber: 1, episodesCount: 10 }
  ];
  const activeSeasonData = seasons.find(s => s.seasonNumber === currentSeason) || seasons[0];
  const totalTvEpisodes = activeSeasonData ? activeSeasonData.episodesCount : 10;
  const totalEpisodes = isAnime ? totalAnimeEpisodes : totalTvEpisodes;

  // Derive active episode chunk
  const currentChunkIndex = Math.floor((currentEpisode - 1) / CHUNK_SIZE);
  const numChunks = Math.ceil(totalEpisodes / CHUNK_SIZE);
  const activeChunk = selectedChunk !== null && selectedChunk < numChunks ? selectedChunk : currentChunkIndex;
  const safeActiveChunk = Math.min(Math.max(0, activeChunk), Math.max(0, numChunks - 1));

  const startEp = (safeActiveChunk * CHUNK_SIZE) + 1;
  const endEp = Math.min(totalEpisodes, (safeActiveChunk + 1) * CHUNK_SIZE);
  const displayedEpisodes = Array.from({ length: Math.max(0, endEp - startEp + 1) }, (_, i) => startEp + i);

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const target = parseInt(jumpInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalEpisodes) {
      onSelectEpisode(target);
      setJumpInput('');
    }
  };

  return (
    <div className="episode-selector-card">
      <div className="episode-selector-header">
        <div className="selector-heading">
          <Tv size={18} className="selector-icon" />
          <span>{isAnime ? `Select Anime Episode (Total ${totalAnimeEpisodes})` : 'Season & Episodes'}</span>
        </div>

        <div className="selector-controls-right">
          {/* Quick download button for current episode */}
          {onDownloadEpisode && (
            <button
              type="button"
              className="btn-download-active-ep"
              onClick={() => onDownloadEpisode(currentEpisode)}
              title={`Download currently selected episode (${isAnime ? `Ep ${currentEpisode}` : `S${currentSeason}:E${currentEpisode}`})`}
            >
              <Download size={14} />
              <span>Download Ep {currentEpisode}</span>
            </button>
          )}

          {/* Jump to specific episode input */}
          {totalEpisodes > 15 && (
            <form onSubmit={handleJumpSubmit} className="jump-episode-form">
              <Hash size={13} className="text-muted" />
              <input
                type="number"
                min="1"
                max={totalEpisodes}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                placeholder={`Ep 1-${totalEpisodes}`}
                className="jump-episode-input"
              />
              <button type="submit" className="jump-episode-btn">Go</button>
            </form>
          )}

          {!isAnime && seasons.length > 1 && (
            <div className="season-dropdown-wrap">
              <label htmlFor="season-select" className="season-label">Season:</label>
              <select
                id="season-select"
                value={currentSeason}
                onChange={(e) => onSelectSeason(Number(e.target.value))}
                className="season-select"
              >
                {seasons.map((s) => (
                  <option key={s.seasonNumber} value={s.seasonNumber}>
                    Season {s.seasonNumber} ({s.episodesCount} eps)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Episode Chunks / Range Selector if > 50 episodes (e.g. One Piece, Naruto) */}
      {numChunks > 1 && (
        <div className="episode-chunks-bar">
          <span className="chunks-label">Range:</span>
          <div className="chunks-pills">
            {Array.from({ length: numChunks }, (_, idx) => {
              const rStart = idx * CHUNK_SIZE + 1;
              const rEnd = Math.min(totalEpisodes, (idx + 1) * CHUNK_SIZE);
              const isSelected = activeChunk === idx;
              return (
                <button
                  key={`chunk-${idx}`}
                  type="button"
                  onClick={() => setSelectedChunk(idx)}
                  className={`chunk-pill ${isSelected ? 'active' : ''}`}
                >
                  {rStart} - {rEnd}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="episodes-grid">
        {displayedEpisodes.map((ep) => {
          const isPlaying = ep === currentEpisode;
          return (
            <div key={`${isAnime ? 'anime' : 'tv'}-ep-${ep}`} className="episode-pill-container">
              <button
                onClick={() => onSelectEpisode(ep)}
                className={`ep-pill ${isPlaying ? 'active' : ''}`}
                title={`Play ${isAnime ? 'Anime' : `Season ${currentSeason}`} Episode ${ep}`}
              >
                {isPlaying && <Play size={12} className="ep-play-icon" />}
                <span>{isAnime ? `Ep ${ep}` : `Episode ${ep}`}</span>
              </button>
              {onDownloadEpisode && (
                <button
                  type="button"
                  className="ep-download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadEpisode(ep);
                  }}
                  title={`Download ${isAnime ? 'Episode' : `Season ${currentSeason} Episode`} ${ep}`}
                  aria-label={`Download episode ${ep}`}
                >
                  <Download size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
