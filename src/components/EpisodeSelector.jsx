import React from 'react';
import { Tv, Play } from 'lucide-react';

export default function EpisodeSelector({
  media,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
  onSelectSeason
}) {
  if (!media || (media.type !== 'tv' && media.type !== 'anime')) {
    return null;
  }

  const isAnime = media.type === 'anime';

  // For Anime, total episodes
  const totalAnimeEpisodes = media.episodesCount || 12;

  // For TV, get seasons list
  const seasons = media.seasons || [
    { seasonNumber: 1, episodesCount: 10 }
  ];
  const activeSeasonData = seasons.find(s => s.seasonNumber === currentSeason) || seasons[0];
  const totalTvEpisodes = activeSeasonData ? activeSeasonData.episodesCount : 10;

  return (
    <div className="episode-selector-card">
      <div className="episode-selector-header">
        <div className="selector-heading">
          <Tv size={18} className="selector-icon" />
          <span>{isAnime ? 'Select Anime Episode' : 'Season & Episodes'}</span>
        </div>

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

      <div className="episodes-grid">
        {isAnime ? (
          Array.from({ length: totalAnimeEpisodes }, (_, i) => i + 1).map((ep) => {
            const isPlaying = ep === currentEpisode;
            return (
              <button
                key={`anime-ep-${ep}`}
                onClick={() => onSelectEpisode(ep)}
                className={`ep-pill ${isPlaying ? 'active' : ''}`}
                title={`Play Episode ${ep}`}
              >
                {isPlaying && <Play size={12} className="ep-play-icon" />}
                <span>Ep {ep}</span>
              </button>
            );
          })
        ) : (
          Array.from({ length: totalTvEpisodes }, (_, i) => i + 1).map((ep) => {
            const isPlaying = ep === currentEpisode;
            return (
              <button
                key={`tv-ep-${ep}`}
                onClick={() => onSelectEpisode(ep)}
                className={`ep-pill ${isPlaying ? 'active' : ''}`}
                title={`Play Season ${currentSeason} Episode ${ep}`}
              >
                {isPlaying && <Play size={12} className="ep-play-icon" />}
                <span>Episode {ep}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
