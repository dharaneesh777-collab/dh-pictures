import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Check,
  Copy,
  ExternalLink,
  HardDrive,
  Film,
  Tv,
  Sparkles,
  Server,
  Layers,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  QUALITY_OPTIONS,
  AUDIO_OPTIONS,
  formatFileName,
  getDownloadUrl,
  getAvailableDownloadServers,
  getEstimatedSize,
  triggerBrowserDownload
} from '../services/downloadService';

const TMDB_FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg';

export default function DownloadModal({
  isOpen,
  onClose,
  media,
  initialSeason = 1,
  initialEpisode = 1,
  initialLanguage = 'en',
  initialServer = 'server1'
}) {
  const isAnime = media?.type === 'anime';
  const isHindi = media?.isHindi || media?.preferredServer === 'server6';

  const defaultServer = isAnime ? 'anime' : isHindi ? 'server6' : (initialServer || 'server1');
  const defaultLanguage = isAnime ? (initialLanguage === 'dub' ? 'dub' : 'sub') : (isHindi ? 'hi' : (initialLanguage || 'en'));

  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedServer, setSelectedServer] = useState(defaultServer);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode || 1);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  const isTv = media.type === 'tv';

  // Compute available servers & audio
  const availableServers = getAvailableDownloadServers(media);
  const audioOptions = AUDIO_OPTIONS[media.type] || AUDIO_OPTIONS.movie;

  // Compute file details
  const filename = formatFileName({
    title: media.title,
    type: media.type,
    year: media.year,
    season: selectedSeason,
    episode: selectedEpisode,
    quality: selectedQuality,
    language: selectedLanguage
  });

  const downloadUrl = getDownloadUrl({
    media,
    serverId: selectedServer,
    quality: selectedQuality,
    season: selectedSeason,
    episode: selectedEpisode,
    language: selectedLanguage
  });

  const estimatedSize = getEstimatedSize(media.type, selectedQuality);

  // Trigger client-side browser download
  const handleStartDownload = async () => {
    setIsDownloading(true);
    setDownloadComplete(false);
    setDownloadProgress(10);
    setStatusMessage('Initiating download connection...');

    try {
      await triggerBrowserDownload({
        url: downloadUrl,
        filename,
        onStatusChange: ({ progress, message, status }) => {
          setDownloadProgress(progress);
          setStatusMessage(message);
          if (status === 'completed') {
            setDownloadComplete(true);
          }
        }
      });
    } catch (err) {
      console.error('Download error:', err);
      setStatusMessage('Direct trigger failed. Click "Open Direct Mirror" below.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (!downloadUrl) return;
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // TV seasons data
  const seasons = media.seasons || [{ seasonNumber: 1, episodesCount: 10 }];
  const currentSeasonData = seasons.find(s => s.seasonNumber === selectedSeason) || seasons[0];
  const rawEpisodes = isAnime 
    ? (media.episodesCount || 24)
    : (currentSeasonData ? currentSeasonData.episodesCount : 10);
  const maxEpisodes = Math.max(rawEpisodes, selectedEpisode, initialEpisode || 1);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container download-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* Modal Header */}
        <div className="download-modal-header">
          <div className="download-header-left">
            <div className="download-thumb-wrap">
              <img
                src={media.poster || TMDB_FALLBACK_POSTER}
                alt={media.title}
                className="download-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = TMDB_FALLBACK_POSTER;
                }}
              />
            </div>
            <div>
              <div className="download-badges-row">
                <span className="download-type-badge">
                  {isTv ? <Tv size={12} /> : <Film size={12} />}
                  <span>{media.type?.toUpperCase()}</span>
                </span>
                {isTv && (
                  <span className="download-ep-badge">
                    S{selectedSeason}:E{selectedEpisode}
                  </span>
                )}
                {isAnime && (
                  <span className="download-ep-badge">
                    Episode {selectedEpisode}
                  </span>
                )}
                <span className="download-res-badge">
                  <Sparkles size={11} />
                  <span>{selectedQuality}</span>
                </span>
              </div>
              <h3 id="download-modal-title" className="download-modal-title" title={media.title}>
                {media.title}
              </h3>
              <p className="download-modal-sub">
                Select quality, language, and server to download directly to your local downloads folder.
              </p>
            </div>
          </div>

          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close download modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="download-modal-body">
          {/* Episode Switcher for TV / Anime */}
          {(isTv || isAnime) && (
            <div className="download-section">
              <label className="download-section-label">
                <Layers size={15} />
                <span>Select Episode to Download:</span>
              </label>

              <div className="download-episode-controls">
                {isTv && seasons.length > 1 && (
                  <div className="season-select-inline">
                    <span className="inline-label">Season:</span>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(Number(e.target.value));
                        setSelectedEpisode(1);
                      }}
                      className="download-select"
                    >
                      {seasons.map(s => (
                        <option key={s.seasonNumber} value={s.seasonNumber}>
                          Season {s.seasonNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="episode-select-inline">
                  <span className="inline-label">Episode:</span>
                  {maxEpisodes <= 60 ? (
                    <select
                      value={selectedEpisode}
                      onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                      className="download-select"
                    >
                      {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(epNum => (
                        <option key={epNum} value={epNum}>
                          Episode {epNum}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="episode-num-input-wrap">
                      <input
                        type="number"
                        min="1"
                        max={maxEpisodes}
                        value={selectedEpisode}
                        onChange={(e) => setSelectedEpisode(Math.max(1, Math.min(maxEpisodes, parseInt(e.target.value, 10) || 1)))}
                        className="download-select episode-num-input"
                      />
                      <span className="episode-max-hint">/ {maxEpisodes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quality Options Grid */}
          <div className="download-section">
            <label className="download-section-label">
              <HardDrive size={15} />
              <span>Select Download Quality:</span>
            </label>
            <div className="quality-grid">
              {QUALITY_OPTIONS.map((q) => {
                const isSelected = selectedQuality === q.id;
                const size = media.type === 'movie' ? q.movieSize : q.episodeSize;

                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`quality-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedQuality(q.id)}
                  >
                    <div className="quality-card-top">
                      <span className="quality-label">{q.label}</span>
                      <span className="quality-badge">{q.badge}</span>
                    </div>
                    <div className="quality-card-details">
                      <span className="quality-res">{q.resolution}</span>
                      <span className="quality-size">~{size}</span>
                    </div>
                    {isSelected && <span className="quality-check-dot"><Check size={12} /></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio / Language & Server Options Row */}
          <div className="download-settings-row">
            {/* Audio Language */}
            <div className="download-col">
              <label className="download-section-label">
                <Radio size={15} />
                <span>Audio / Language:</span>
              </label>
              <div className="download-pills-wrap">
                {audioOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`download-pill-btn ${selectedLanguage === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedLanguage(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Server Source */}
            <div className="download-col">
              <label className="download-section-label">
                <Server size={15} />
                <span>Download Mirror / CDN:</span>
              </label>
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="download-select full-width"
              >
                {availableServers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Information Card */}
          <div className="file-info-card">
            <div className="file-info-row">
              <span className="file-info-title">File Name:</span>
              <code className="file-name-code" title={filename}>{filename}</code>
            </div>
            <div className="file-meta-badges">
              <span>Format: <strong>MP4 (H.264 / AAC)</strong></span>
              <span>Estimated Size: <strong>{estimatedSize}</strong></span>
              <span>Destination: <strong>Local Downloads</strong></span>
            </div>
          </div>

          {/* Download Progress & Status Feedback */}
          {(isDownloading || downloadProgress > 0) && (
            <div className="download-status-card">
              <div className="progress-info-row">
                <span className="status-text">
                  {downloadComplete ? (
                    <span className="status-complete"><CheckCircle2 size={16} /> Download Triggered</span>
                  ) : (
                    <span>{statusMessage || 'Preparing download...'}</span>
                  )}
                </span>
                <span className="progress-percent">{downloadProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className={`progress-bar-fill ${downloadComplete ? 'complete' : ''}`} 
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              {downloadComplete && (
                <div className="download-success-tip">
                  <CheckCircle2 size={15} className="text-green" />
                  <span>File is saving to your default browser Downloads folder. Press <strong>Ctrl+J</strong> (or <strong>Cmd+Option+L</strong> on Mac) to view your download.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="download-modal-footer">
          <button
            type="button"
            className="btn-download-action primary"
            onClick={handleStartDownload}
            disabled={isDownloading}
          >
            <Download size={18} />
            <span>{isDownloading ? 'Downloading...' : 'Download to Local Device'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-action secondary"
            title="Open direct download mirror link in a new browser tab"
          >
            <ExternalLink size={16} />
            <span>Direct Mirror Link</span>
          </a>

          <button
            type="button"
            className="btn-download-action tertiary"
            onClick={handleCopyLink}
            title="Copy download stream URL"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Helper footer text */}
        <div className="download-footer-tip">
          <AlertCircle size={13} className="text-muted" />
          <span>Supports IDM, Free Download Manager, and VLC Media Player via direct link.</span>
        </div>
      </div>
    </div>
  );
}
