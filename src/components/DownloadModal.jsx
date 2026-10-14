import React, { useState, useEffect } from 'react';
import {
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
  Terminal,
  ShieldCheck,
  Play,
  Download
} from 'lucide-react';
import {
  QUALITY_OPTIONS,
  AUDIO_OPTIONS,
  formatFileName,
  getDownloadUrl,
  getDownloadCommand,
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
  initialServer = 'server1',
  onPlayStream
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
  const [commandTool, setCommandTool] = useState('yt-dlp');
  const [commandCopied, setCommandCopied] = useState(false);
  const [showInAppPreview, setShowInAppPreview] = useState(false);
  
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
        media,
        quality: selectedQuality,
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
      setStatusMessage('Direct file download failed. Please try again or copy the 1-click CLI command.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCommand = getDownloadCommand(commandTool, {
    url: downloadUrl,
    filename
  });

  const handleCopyCommand = () => {
    if (!downloadCommand) return;
    navigator.clipboard.writeText(downloadCommand);
    setCommandCopied(true);
    setTimeout(() => setCommandCopied(false), 2000);
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
              <span>Server: <strong>{availableServers.find(s => s.id === selectedServer)?.name || 'Direct CDN'}</strong></span>
            </div>
          </div>

          {/* 1-Click CLI Download Command */}
          <div className="cli-command-section">
            <div className="cli-command-header">
              <label className="download-section-label" style={{ marginBottom: 0 }}>
                <Terminal size={15} />
                <span>1-Click Desktop Download Command:</span>
              </label>
              <div className="cli-tool-tabs">
                {[
                  { id: 'yt-dlp', label: 'yt-dlp (Best)' },
                  { id: 'ffmpeg', label: 'ffmpeg' },
                  { id: 'curl', label: 'curl' },
                  { id: 'vlc', label: 'VLC' },
                  { id: 'idm', label: 'IDM' },
                  { id: 'aria2c', label: 'aria2c' }
                ].map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    className={`cli-tool-tab ${commandTool === tool.id ? 'active' : ''}`}
                    onClick={() => setCommandTool(tool.id)}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cli-command-row">
              <code className="cli-command-code" title={downloadCommand}>
                {downloadCommand}
              </code>
              <button
                type="button"
                className="cli-copy-btn"
                onClick={handleCopyCommand}
                title="Copy terminal command to clipboard"
              >
                {commandCopied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{commandCopied ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
          </div>

          {/* Clean In-App Stream Launcher & Direct Preview */}
          <div className="in-app-launcher-section">
            <div className="in-app-launcher-header">
              <div className="in-app-launcher-title">
                <Play size={15} className="text-green" />
                <span>Clean In-App Stream Launcher:</span>
              </div>
              <div className="in-app-launcher-actions">
                <button
                  type="button"
                  className={`in-app-toggle-btn ${showInAppPreview ? 'active' : ''}`}
                  onClick={() => setShowInAppPreview(prev => !prev)}
                >
                  {showInAppPreview ? 'Hide In-App Player' : 'Launch In-App Player Preview'}
                </button>
                {onPlayStream && (
                  <button
                    type="button"
                    className="in-app-play-btn"
                    onClick={() => {
                      onPlayStream({
                        media,
                        server: selectedServer,
                        season: selectedSeason,
                        episode: selectedEpisode,
                        language: selectedLanguage
                      });
                    }}
                    title="Launch stream directly in main video player"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Stream in Main Player</span>
                  </button>
                )}
              </div>
            </div>

            {showInAppPreview && (
              <div className="in-app-preview-container">
                <iframe
                  key={downloadUrl}
                  src={downloadUrl}
                  title={`${media.title} Clean Stream Preview`}
                  className="in-app-preview-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="origin"
                />
                <div className="in-app-preview-helper">
                  <ShieldCheck size={13} className="text-green" />
                  <span>Right-click player video to "Save Video As..." or inspect stream source directly without pop-ups.</span>
                </div>
              </div>
            )}
          </div>

          {/* Step-by-Step Direct Download Guide */}
          <div className="download-guide-card">
            <div className="download-guide-title">
              <ShieldCheck size={15} className="text-green" />
              <span>How to Save Video to Your Local Disk:</span>
            </div>
            <ol className="download-guide-list">
              <li>
                <strong>Option 1 (Direct Local File Download):</strong> Click the green <strong>"Download Video File (.mp4)"</strong> button below to save the video file directly into your device's local Downloads folder.
              </li>
              <li>
                <strong>Option 2 (1-Click Fast CLI Download):</strong> Copy the <code>yt-dlp</code>, <code>IDM</code>, or <code>aria2c</code> command above and paste it into Terminal / PowerShell to download at multi-threaded speed.
              </li>
              <li>
                <strong>Option 3 (Watch in Browser):</strong> Click <strong>"Watch Stream in New Tab"</strong> or launch the in-app player below if you want to stream directly without saving a file.
              </li>
            </ol>
          </div>

          {/* Download Progress & Status Feedback */}
          {(isDownloading || downloadProgress > 0) && (
            <div className="download-status-card">
              <div className="progress-info-row">
                <span className="status-text">
                  {downloadComplete ? (
                    <span className="status-complete"><CheckCircle2 size={16} /> Video File Saved to Downloads Folder!</span>
                  ) : (
                    <span>{statusMessage || 'Preparing video download...'}</span>
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
                  <span>Successfully downloaded <strong>{filename}</strong>! Check your device's Downloads folder.</span>
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
            title="Download video file directly to your local Downloads folder"
          >
            <Download size={18} />
            <span>{isDownloading ? 'Downloading Video File...' : 'Download Video File (.mp4)'}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-action watch-tab"
            title="Open streaming player in a new browser tab to watch immediately"
          >
            <ExternalLink size={16} />
            <span>Watch Stream in New Tab</span>
          </a>

          <button
            type="button"
            className="btn-download-action secondary"
            onClick={handleCopyCommand}
            title="Copy 1-click terminal command (yt-dlp, IDM, ffmpeg)"
          >
            {commandCopied ? <Check size={16} className="text-green" /> : <Terminal size={16} />}
            <span>{commandCopied ? 'Command Copied!' : 'Copy Download Cmd'}</span>
          </button>

          <button
            type="button"
            className="btn-download-action tertiary"
            onClick={handleCopyLink}
            title="Copy download stream URL"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Helper footer text */}
        <div className="download-footer-tip">
          <ShieldCheck size={13} className="text-green" />
          <span>Real Local File Downloads — Saves .mp4 directly to disk. Supports yt-dlp, ffmpeg, IDM, 1DM, and VLC.</span>
        </div>
      </div>
    </div>
  );
}
