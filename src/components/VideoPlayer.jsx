import React, { useState } from 'react';
import { 
  STREAM_SERVERS, 
  getStreamUrl,
  getTrailerUrl
} from '../services/streamServers';
import { 
  Server, 
  Maximize2, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Languages, 
  ChevronLeft, 
  ChevronRight,
  Film,
  Download,
  X
} from 'lucide-react';
import EpisodeSelector from './EpisodeSelector';

export default function VideoPlayer({
  media,
  activeServer,
  setActiveServer,
  season,
  setSeason,
  episode,
  setEpisode,
  language,
  setLanguage,
  cinemaMode,
  setCinemaMode,
  onOpenTrailer,
  onOpenDownload,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [useSandbox, setUseSandbox] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!media) return null;

  const isAnime = media.type === 'anime';
  const isTv = media.type === 'tv';

  // Compute stream URL
  const currentStreamUrl = activeServer === 'trailer'
    ? getTrailerUrl(media.trailerKey)
    : getStreamUrl({
        serverId: activeServer,
        type: media.type || 'movie',
        id: media.id,
        season,
        episode,
        anilistId: media.anilistId || media.id,
        language,
        trailerKey: media.trailerKey
      });

  const handleCopyUrl = () => {
    if (!currentStreamUrl) return;
    navigator.clipboard.writeText(currentStreamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Seasons data for TV
  const seasons = media.seasons || [{ seasonNumber: 1, episodesCount: 10 }];
  const currentSeasonData = seasons.find(s => s.seasonNumber === season) || seasons[0];
  const maxEpisodesInSeason = currentSeasonData ? currentSeasonData.episodesCount : 10;
  const totalSeasons = seasons.length;

  // Next / Prev episode helpers
  const handlePrevEpisode = () => {
    if (episode > 1) {
      setEpisode(episode - 1);
    } else if (isTv && season > 1) {
      const prevSeasonData = seasons.find(s => s.seasonNumber === season - 1);
      const prevMax = prevSeasonData ? prevSeasonData.episodesCount : 10;
      setSeason(season - 1);
      setEpisode(prevMax);
    }
  };

  const handleNextEpisode = () => {
    if (isAnime) {
      const maxEp = media.episodesCount || 1200;
      if (episode < maxEp) {
        setEpisode(episode + 1);
      }
    } else if (isTv) {
      if (episode < maxEpisodesInSeason) {
        setEpisode(episode + 1);
      } else if (season < totalSeasons) {
        setSeason(season + 1);
        setEpisode(1);
      }
    }
  };

  // Sandbox attributes: allow scripts, same origin, presentation, and user activation
  const sandboxAttr = useSandbox 
    ? 'allow-forms allow-scripts allow-same-origin allow-presentation allow-top-navigation-by-user-activation'
    : undefined;

  return (
    <div className={`player-wrapper ${cinemaMode ? 'cinema-expanded' : ''}`}>
      {/* Top Media Bar */}
      <div className="player-meta-bar">
        <div className="media-info-pill">
          <span className="media-badge-type">{media.type?.toUpperCase()}</span>
          <h2 className="current-media-title">{media.title}</h2>
          {isTv && (
            <span className="season-ep-tag">S{season} : E{episode}</span>
          )}
          {isAnime && (
            <span className="season-ep-tag">Episode {episode} ({language.toUpperCase()})</span>
          )}
          {activeServer === 'trailer' && (
            <span className="season-ep-tag trailer-tag">YouTube Trailer Mode</span>
          )}
        </div>

        <div className="player-quick-actions">
          {onOpenDownload && (
            <button
              className="btn-control btn-download-quick"
              onClick={() => onOpenDownload({
                media,
                season,
                episode,
                language,
                server: activeServer
              })}
              title="Download Movie/Episode to Local Device"
            >
              <Download size={15} />
              <span>Download</span>
            </button>
          )}

          {media.trailerKey && (
            <button 
              className="btn-trailer-quick"
              onClick={onOpenTrailer}
              title="Watch Official YouTube Trailer in Modal"
            >
              <Film size={15} />
              <span>Trailer Modal</span>
            </button>
          )}

          <button
            className={`btn-control ${cinemaMode ? 'active' : ''}`}
            onClick={() => setCinemaMode(!cinemaMode)}
            title={cinemaMode ? 'Exit Cinema Mode' : 'Enter Cinema Mode'}
          >
            <Maximize2 size={16} />
            <span>{cinemaMode ? 'Compact' : 'Cinema'}</span>
          </button>

          <button
            className="btn-control"
            onClick={handleRefresh}
            title="Reload Video Stream"
          >
            <RefreshCw size={16} />
          </button>

          <a
            href={currentStreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-control"
            title="Open in new window / tab"
          >
            <ExternalLink size={16} />
          </a>

          <button
            className="btn-control"
            onClick={handleCopyUrl}
            title="Copy Direct Embed URL"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
          </button>

          {onClose && (
            <button
              className="btn-control btn-close-player"
              onClick={onClose}
              title="Close Player"
              aria-label="Close Player"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="video-container">
        <iframe
          key={`${currentStreamUrl}-${refreshKey}`}
          src={currentStreamUrl}
          title={`${media.title} - Video Player`}
          className="stream-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          sandbox={sandboxAttr}
        />

        {/* Floating Quick Episode Bar on TV / Anime */}
        {(isTv || isAnime) && (
          <div className="floating-ep-nav">
            <button
              onClick={handlePrevEpisode}
              disabled={episode <= 1}
              className="ep-nav-btn"
              title="Previous Episode"
            >
              <ChevronLeft size={16} />
              <span>Prev Ep</span>
            </button>
            <span className="ep-nav-label">Ep {episode}</span>
            <button
              onClick={handleNextEpisode}
              className="ep-nav-btn"
              title="Next Episode"
            >
              <span>Next Ep</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Server Switcher Bar */}
      <div className="servers-bar">
        <div className="servers-label-group">
          <Server size={17} className="server-icon" />
          <span className="servers-title">Available Servers:</span>
        </div>

        <div className="servers-list">
          {STREAM_SERVERS.map((srv) => {
            const isSelected = activeServer === srv.id;
            const isSupported = srv.supports.includes(media.type) || (srv.id === 'anime' && isAnime);

            return (
              <button
                key={srv.id}
                onClick={() => setActiveServer(srv.id)}
                className={`server-btn ${isSelected ? 'selected' : ''} ${!isSupported ? 'not-recommended' : ''}`}
                style={{
                  '--accent-color': srv.badgeColor
                }}
                title={`${srv.name} - ${srv.description}`}
              >
                <span className="server-tag" style={{ backgroundColor: srv.badgeColor }}>
                  {srv.tag}
                </span>
                <span className="server-name">{srv.shortName}</span>
                {isSelected && <span className="active-dot" />}
              </button>
            );
          })}

          {media.trailerKey && (
            <button
              onClick={() => setActiveServer('trailer')}
              className={`server-btn ${activeServer === 'trailer' ? 'selected' : ''}`}
              style={{
                '--accent-color': '#ef4444'
              }}
              title="Official YouTube Trailer with autoplay=1"
            >
              <span className="server-tag" style={{ backgroundColor: '#ef4444' }}>
                Trailer
              </span>
              <span className="server-name">YouTube Trailer</span>
              {activeServer === 'trailer' && <span className="active-dot" />}
            </button>
          )}
        </div>

        {/* Sub / Dub Selector for Anime Server */}
        {(activeServer === 'anime' || isAnime) && (
          <div className="audio-toggle-wrap">
            <Languages size={16} className="audio-icon" />
            <span className="audio-label">Anime Audio:</span>
            <div className="audio-buttons">
              <button
                className={`btn-subdub ${language === 'sub' ? 'active' : ''}`}
                onClick={() => setLanguage('sub')}
              >
                SUB (Japanese)
              </button>
              <button
                className={`btn-subdub ${language === 'dub' ? 'active' : ''}`}
                onClick={() => setLanguage('dub')}
              >
                DUB (English)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stream URL & Player Controls helper bar */}
      <div className="player-status-bar">
        <div className="stream-url-display">
          <span className="url-label">Active Embed API:</span>
          <code className="url-code">{currentStreamUrl}</code>
        </div>

        <div className="player-actions-aux">
          {onOpenDownload && (
            <button
              className="btn-download-aux"
              onClick={() => onOpenDownload({
                media,
                season,
                episode,
                language,
                server: activeServer
              })}
              title="Download current media stream"
            >
              <Download size={14} />
              <span>Download Stream</span>
            </button>
          )}

          <div className="player-security-toggle">
            <button
              className={`btn-sandbox ${useSandbox ? 'sandbox-on' : 'sandbox-off'}`}
              onClick={() => setUseSandbox(!useSandbox)}
              title="Toggle iframe Sandbox (Restricts popups and redirects from embed providers)"
            >
              {useSandbox ? (
                <>
                  <ShieldCheck size={14} className="text-green" />
                  <span>Ad Sandbox: ON</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={14} className="text-yellow" />
                  <span>Ad Sandbox: OFF (Max Compatibility)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Episode selector for Series & Anime */}
      {(isTv || isAnime) && (
        <EpisodeSelector
          media={media}
          currentSeason={season}
          currentEpisode={episode}
          onSelectEpisode={(ep) => setEpisode(ep)}
          onSelectSeason={(sn) => {
            setSeason(sn);
            setEpisode(1);
          }}
          onDownloadEpisode={onOpenDownload ? (ep) => onOpenDownload({
            media,
            season,
            episode: ep,
            language,
            server: activeServer
          }) : undefined}
        />
      )}
    </div>
  );
}
