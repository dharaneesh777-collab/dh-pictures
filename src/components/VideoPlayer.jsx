import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  STREAM_SERVERS, 
  getStreamUrl,
  getTrailerUrl,
  getNextAvailableServer,
  getServerById
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
  X,
  SkipForward,
  Zap,
  AlertTriangle,
  RotateCcw
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
  onClose,
  autoSwitchServer = true,
  failoverTimeout = 7
}) {
  const iframeRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [useSandbox, setUseSandbox] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-switch server failover state
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(autoSwitchServer);
  const [countdown, setCountdown] = useState(failoverTimeout);
  const [isCountingDown, setIsCountingDown] = useState(autoSwitchServer && activeServer !== 'trailer');
  const [failedServers, setFailedServers] = useState([]);
  const [lastSwitchNotice, setLastSwitchNotice] = useState(null);
  const [, setHasInteracted] = useState(false);

  // Sync state if media or episode changes
  const [prevMediaKey, setPrevMediaKey] = useState(`${media?.id}-${season}-${episode}`);
  const currentMediaKey = `${media?.id}-${season}-${episode}`;
  if (currentMediaKey !== prevMediaKey) {
    setPrevMediaKey(currentMediaKey);
    setFailedServers([]);
    setLastSwitchNotice(null);
    setHasInteracted(false);
    if (autoSwitchEnabled && activeServer !== 'trailer') {
      setCountdown(failoverTimeout);
      setIsCountingDown(true);
    }
  }

  // Sync state if activeServer changes externally
  const [prevServer, setPrevServer] = useState(activeServer);
  if (activeServer !== prevServer) {
    setPrevServer(activeServer);
    setHasInteracted(false);
    if (autoSwitchEnabled && activeServer !== 'trailer') {
      setCountdown(failoverTimeout);
      setIsCountingDown(true);
    } else {
      setIsCountingDown(false);
    }
  }

  const isAnime = media?.type === 'anime';
  const isTv = media?.type === 'tv';

  // Compute stream URL
  const currentStreamUrl = activeServer === 'trailer'
    ? getTrailerUrl(media?.trailerKey)
    : getStreamUrl({
        serverId: activeServer,
        type: media?.type || 'movie',
        id: media?.id,
        season,
        episode,
        anilistId: media?.anilistId || media?.id,
        language,
        trailerKey: media?.trailerKey
      });

  const nextServerObj = getNextAvailableServer(activeServer, media, failedServers);
  const currentServerObj = getServerById(activeServer);

  // Auto-switch failover trigger
  const triggerAutoSwitch = useCallback((reason = 'auto') => {
    const next = getNextAvailableServer(activeServer, media, failedServers);
    const curr = getServerById(activeServer);

    if (next && next.id !== activeServer) {
      setFailedServers(prev => {
        if (!prev.includes(activeServer)) {
          return [...prev, activeServer];
        }
        return prev;
      });

      setActiveServer(next.id);
      setCountdown(failoverTimeout);
      setIsCountingDown(true);

      const reasonDesc = reason === 'connection_error'
        ? 'Connection failed'
        : reason === 'manual_skip'
        ? 'Switched'
        : 'Server blocked or unavailable';

      setLastSwitchNotice({
        type: 'warning',
        from: curr?.shortName || activeServer,
        to: next.shortName,
        message: `${reasonDesc} on ${curr?.shortName || activeServer}. Automatically switched to ${next.name}.`
      });
    } else {
      setIsCountingDown(false);
      setLastSwitchNotice({
        type: 'error',
        message: 'All available streaming servers have been tried. You can click any server below to retry, or switch to YouTube Trailer.'
      });
    }
  }, [activeServer, media, failedServers, failoverTimeout, setActiveServer]);

  // Countdown watchdog timer
  useEffect(() => {
    if (!isCountingDown || !autoSwitchEnabled || activeServer === 'trailer') {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAutoSwitch('timeout_or_blocked');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown, autoSwitchEnabled, activeServer, triggerAutoSwitch]);

  // Window blur / iframe interaction detection (dismiss watchdog when user interacts with player)
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          setIsCountingDown(false);
          setHasInteracted(true);
        }
      }, 100);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Player message event listener
  useEffect(() => {
    const handleMessage = (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && (data.event === 'error' || data.type === 'error' || data.error)) {
          triggerAutoSwitch('player_error_event');
        }
      } catch {
        // Non-JSON message from external iframe
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [triggerAutoSwitch]);

  const handleConfirmWorking = () => {
    setIsCountingDown(false);
    setHasInteracted(true);
    setLastSwitchNotice({
      type: 'success',
      message: `Stream active on ${currentServerObj?.shortName || 'current server'}. Auto-failover paused.`
    });
    setTimeout(() => {
      setLastSwitchNotice(prev => (prev?.type === 'success' ? null : prev));
    }, 4000);
  };

  const handleManualServerSelect = (serverId) => {
    setActiveServer(serverId);
    // If reselecting a previously failed server, remove it from failed list so user can retry
    setFailedServers(prev => prev.filter(id => id !== serverId));
    if (serverId !== 'trailer' && autoSwitchEnabled) {
      setCountdown(failoverTimeout);
      setIsCountingDown(true);
      setHasInteracted(false);
    } else {
      setIsCountingDown(false);
    }
  };

  const handleCopyUrl = () => {
    if (!currentStreamUrl) return;
    navigator.clipboard.writeText(currentStreamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (autoSwitchEnabled && activeServer !== 'trailer') {
      setCountdown(failoverTimeout);
      setIsCountingDown(true);
    }
  };

  // Seasons data for TV
  const seasons = media?.seasons || [{ seasonNumber: 1, episodesCount: 10 }];
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
      const maxEp = media?.episodesCount || 1200;
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

  if (!media) return null;

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
          {/* Quick Next Server Switcher */}
          {nextServerObj && nextServerObj.id !== activeServer && activeServer !== 'trailer' && (
            <button
              type="button"
              className="btn-control btn-next-server"
              onClick={() => triggerAutoSwitch('manual_skip')}
              title={`Switch to next server: ${nextServerObj.shortName}`}
            >
              <SkipForward size={14} />
              <span>Next Server ({nextServerObj.shortName})</span>
            </button>
          )}

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

      {/* Auto-Switch Notice Toast */}
      {lastSwitchNotice && (
        <div className={`failover-switch-toast ${lastSwitchNotice.type || 'warning'}`}>
          <div className="toast-icon">
            {lastSwitchNotice.type === 'success' ? (
              <Check size={16} className="text-green" />
            ) : lastSwitchNotice.type === 'error' ? (
              <AlertTriangle size={16} className="text-red" />
            ) : (
              <Zap size={16} className="text-amber" />
            )}
          </div>
          <span className="toast-text">{lastSwitchNotice.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setLastSwitchNotice(null)}
            aria-label="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Auto-Failover Watchdog Banner */}
      {isCountingDown && autoSwitchEnabled && activeServer !== 'trailer' && nextServerObj && (
        <div className="failover-watchdog-banner">
          <div className="failover-watchdog-left">
            <span className="failover-pulse-dot" />
            <div className="failover-text-group">
              <span className="failover-badge">Auto-Failover Active</span>
              <span className="failover-msg">
                Checking <strong>{currentServerObj?.shortName || activeServer}</strong>. If blocked or video doesn't play, auto-switching to <strong>{nextServerObj.shortName}</strong> in <strong>{countdown}s</strong>
              </span>
            </div>
          </div>

          <div className="failover-watchdog-actions">
            <button
              type="button"
              className="btn-failover-action primary"
              onClick={() => triggerAutoSwitch('manual_skip')}
              title={`Immediately switch to ${nextServerObj.shortName}`}
            >
              <SkipForward size={13} />
              <span>Switch Now ({nextServerObj.shortName})</span>
            </button>
            <button
              type="button"
              className="btn-failover-action secondary"
              onClick={handleConfirmWorking}
              title="Dismiss countdown and stay on this server"
            >
              <Check size={13} />
              <span>Playing Fine (Stay)</span>
            </button>
            <button
              type="button"
              className="btn-failover-action ghost"
              onClick={() => {
                setIsCountingDown(false);
                setAutoSwitchEnabled(false);
              }}
              title="Turn off automatic failover"
            >
              <span>Disable</span>
            </button>
          </div>

          <div className="failover-progress-track">
            <div 
              className="failover-progress-fill" 
              style={{ width: `${Math.max(0, Math.min(100, (countdown / (failoverTimeout || 7)) * 100))}%` }} 
            />
          </div>
        </div>
      )}

      {/* Main Video Screen Container */}
      <div className="video-container">
        <iframe
          ref={iframeRef}
          key={`${currentStreamUrl}-${refreshKey}`}
          src={currentStreamUrl}
          title={`${media.title} - Video Player`}
          className="stream-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          sandbox={sandboxAttr}
          onError={() => triggerAutoSwitch('connection_error')}
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
        <div className="servers-header-row">
          <div className="servers-label-group">
            <Server size={17} className="server-icon" />
            <span className="servers-title">Available Servers:</span>
          </div>

          <div className="servers-header-controls">
            <button
              type="button"
              className={`btn-auto-switch-pill ${autoSwitchEnabled ? 'enabled' : 'disabled'}`}
              onClick={() => {
                const nextState = !autoSwitchEnabled;
                setAutoSwitchEnabled(nextState);
                if (!nextState) {
                  setIsCountingDown(false);
                } else if (activeServer !== 'trailer') {
                  setCountdown(failoverTimeout);
                  setIsCountingDown(true);
                }
              }}
              title={autoSwitchEnabled ? 'Auto-failover enabled: switches to next server on block or error' : 'Auto-failover disabled'}
            >
              <Zap size={12} className={autoSwitchEnabled ? 'text-amber' : ''} />
              <span>Auto-Switch: {autoSwitchEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {failedServers.length > 0 && (
              <button
                type="button"
                className="btn-reset-servers-pill"
                onClick={() => {
                  setFailedServers([]);
                  setLastSwitchNotice(null);
                }}
                title="Reset failed server marks and retry from Server 1"
              >
                <RotateCcw size={12} />
                <span>Reset Status ({failedServers.length} failed)</span>
              </button>
            )}
          </div>
        </div>

        <div className="servers-list">
          {STREAM_SERVERS.map((srv) => {
            const isSelected = activeServer === srv.id;
            const isSupported = srv.supports.includes(media.type) || (srv.id === 'anime' && isAnime);
            const isFailed = failedServers.includes(srv.id);

            return (
              <button
                key={srv.id}
                onClick={() => handleManualServerSelect(srv.id)}
                className={`server-btn ${isSelected ? 'selected' : ''} ${!isSupported ? 'not-recommended' : ''} ${isFailed ? 'has-failed' : ''}`}
                style={{
                  '--accent-color': isFailed ? '#ef4444' : srv.badgeColor
                }}
                title={`${srv.name} - ${srv.description}${isFailed ? ' (Marked as failed/blocked)' : ''}`}
              >
                <span className="server-tag" style={{ backgroundColor: isFailed ? '#ef4444' : srv.badgeColor }}>
                  {srv.tag}
                </span>
                <span className="server-name">{srv.shortName}</span>
                {isFailed && (
                  <span className="server-failed-badge">
                    <AlertTriangle size={10} /> Blocked / Failed
                  </span>
                )}
                {isSelected && <span className="active-dot" />}
              </button>
            );
          })}

          {media.trailerKey && (
            <button
              onClick={() => handleManualServerSelect('trailer')}
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
