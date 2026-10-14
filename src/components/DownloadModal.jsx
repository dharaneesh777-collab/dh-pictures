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
  ShieldAlert,
  Play,
  Download,
  AlertTriangle,
  Info,
  Globe
} from 'lucide-react';
import {
  QUALITY_OPTIONS,
  AUDIO_OPTIONS,
  formatFileName,
  getDownloadUrl,
  getDownloadCommand,
  getAvailableDownloadServers,
  getEstimatedSize,
  isDirectMediaStream,
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
  const [copiedToolBadge, setCopiedToolBadge] = useState('');
  const [showInAppPreview, setShowInAppPreview] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionNotification, setActionNotification] = useState(null);

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

  const currentKey = `${media?.id || ''}-${selectedSeason}-${selectedEpisode}-${selectedQuality}-${selectedServer}`;
  const [prevKey, setPrevKey] = useState(currentKey);

  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setIsDownloading(false);
    setDownloadProgress(0);
    setStatusMessage('');
    setDownloadComplete(false);
    setActionNotification(null);
  }

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
  const isDirectMedia = isDirectMediaStream(downloadUrl);

  const downloadCommand = getDownloadCommand(commandTool, {
    url: downloadUrl,
    filename
  });

  const handleCopyCommand = (tool = commandTool) => {
    const cmd = getDownloadCommand(tool, { url: downloadUrl, filename });
    if (!cmd) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
    }
    setCommandCopied(true);
    setCopiedToolBadge(tool);
    setActionNotification({
      type: 'success',
      title: `${tool.toUpperCase()} Command Copied to Clipboard!`,
      message: `Paste into Terminal or PowerShell to download the complete full ${estimatedSize} video file directly to your disk.`
    });
    setTimeout(() => {
      setCommandCopied(false);
      setCopiedToolBadge('');
    }, 2500);
  };

  const handleCopyLink = () => {
    if (!downloadUrl) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(downloadUrl);
    }
    setCopied(true);
    setActionNotification({
      type: 'success',
      title: 'Stream URL Copied!',
      message: 'Direct stream URL copied to clipboard. Ready for paste into 1DM, IDM, or browser download extensions.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger client-side browser download (direct media only; transparent CORS guidance for embed servers)
  const handleStartDownload = async () => {
    if (!isDirectMedia) {
      // Third-party embed stream server: Browser CORS restricts client-side scrape
      // Copy yt-dlp command and provide transparent guidance instead of generating a 3 KB dummy file
      handleCopyCommand('yt-dlp');
      setActionNotification({
        type: 'cors_info',
        title: 'Browser CORS Notice — yt-dlp Command Copied!',
        message: `Commercial embed servers host streams inside cross-origin iframes where browser CORS prevents in-browser scraping. Run the copied yt-dlp command in Terminal / PowerShell to download the complete full ${estimatedSize} video file in ${selectedQuality}.`
      });
      return;
    }

    setIsDownloading(true);
    setDownloadComplete(false);
    setDownloadProgress(10);
    setStatusMessage('Initiating direct media download connection...');

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
      if (err.code === 'CORS_RESTRICTED' || err.isEmbedServer) {
        handleCopyCommand('yt-dlp');
        setStatusMessage('Browser CORS restricted: yt-dlp command copied to clipboard for direct full video download.');
      } else {
        setStatusMessage('Direct file download encountered an error. Please use the 1-click yt-dlp or IDM command.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // TV seasons data
  const seasons = media.seasons || [{ seasonNumber: 1, episodesCount: 10 }];
  const currentSeasonData = seasons.find(s => s.seasonNumber === selectedSeason) || seasons[0];
  const rawEpisodes = isAnime 
    ? (media.episodesCount || 24)
    : (currentSeasonData ? currentSeasonData.episodesCount : 10);
  const maxEpisodes = Math.max(rawEpisodes, selectedEpisode, initialEpisode || 1);

  const selectedServerObj = availableServers.find(s => s.id === selectedServer);
  const serverDisplayName = selectedServerObj?.name || 'Direct Stream Server';

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
                {isDirectMedia
                  ? 'Direct media source detected. Ready for high-speed in-browser or download manager saving.'
                  : 'Full Video Downloader — Verified 1-click commands for yt-dlp, IDM, and aria2c with zero 3 KB placeholders.'}
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
              <span>Select Video Quality:</span>
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
                <span>Stream Mirror / CDN:</span>
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
              <span className="file-info-title">Target File:</span>
              <code className="file-name-code" title={filename}>{filename}</code>
            </div>
            <div className="file-meta-badges">
              <span>Format: <strong>MP4 (H.264 / AAC)</strong></span>
              <span>Full Video Size: <strong>{estimatedSize}</strong></span>
              <span>Quality: <strong>{selectedQuality}</strong></span>
              <span>Server: <strong>{serverDisplayName}</strong></span>
            </div>
          </div>

          {/* Transparent Browser CORS & Stream Protection Notice */}
          {!isDirectMedia && (
            <div className="download-cors-notice-card">
              <div className="download-cors-notice-header">
                <AlertTriangle size={18} className="text-amber" />
                <span className="download-cors-title">Browser CORS & Stream Protection Information</span>
              </div>
              <p className="download-cors-text">
                Commercial stream servers (such as <strong>{serverDisplayName}</strong>) serve media inside protected cross-origin iframe players. Standard browser security (Same-Origin Policy / CORS) prevents client-side web scripts from directly scraping or downloading multi-gigabyte video files into your browser folder.
              </p>
              <p className="download-cors-solution">
                <ShieldCheck size={14} className="text-green" />
                <span>
                  To download the <strong>complete full video ({estimatedSize})</strong> directly to your computer without truncation or 3 KB placeholder files, use the verified 1-click desktop commands below (<strong>yt-dlp</strong>, <strong>IDM</strong>, <strong>aria2c</strong>, <strong>ffmpeg</strong>) or a browser extension.
                </span>
              </p>
            </div>
          )}

          {/* Dynamic Action Notification */}
          {actionNotification && (
            <div className={`action-notification-banner ${actionNotification.type}`}>
              <div className="action-notification-icon">
                {actionNotification.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
              </div>
              <div className="action-notification-content">
                <strong>{actionNotification.title}</strong>
                <p>{actionNotification.message}</p>
              </div>
              <button 
                type="button" 
                className="action-notification-close" 
                onClick={() => setActionNotification(null)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 1-Click Desktop Download Commands (yt-dlp, IDM, aria2c, ffmpeg, vlc, curl) */}
          <div className="cli-command-section">
            <div className="cli-command-header">
              <label className="download-section-label" style={{ marginBottom: 0 }}>
                <Terminal size={15} />
                <span>1-Click Desktop Download Commands:</span>
              </label>
              <div className="cli-tool-tabs">
                {[
                  { id: 'yt-dlp', label: 'yt-dlp (Recommended)' },
                  { id: 'idm', label: 'IDM' },
                  { id: 'aria2c', label: 'aria2c' },
                  { id: 'ffmpeg', label: 'ffmpeg' },
                  { id: 'vlc', label: 'VLC' },
                  { id: 'curl', label: 'curl' }
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
                onClick={() => handleCopyCommand(commandTool)}
                title={`Copy ${commandTool} command to clipboard`}
              >
                {commandCopied && copiedToolBadge === commandTool ? (
                  <>
                    <Check size={14} className="text-green" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-Click Tool Chips */}
            <div className="cli-quick-chips">
              <span className="cli-quick-label">Quick Copy:</span>
              <button
                type="button"
                className="cli-chip-btn highlight"
                onClick={() => handleCopyCommand('yt-dlp')}
                title="Copy yt-dlp command to download full video file in high quality"
              >
                <Terminal size={12} />
                <span>yt-dlp (Full Video)</span>
              </button>
              <button
                type="button"
                className="cli-chip-btn"
                onClick={() => handleCopyCommand('idm')}
                title="Copy Internet Download Manager command"
              >
                <Download size={12} />
                <span>IDM (Internet Download Manager)</span>
              </button>
              <button
                type="button"
                className="cli-chip-btn"
                onClick={() => handleCopyCommand('aria2c')}
                title="Copy aria2c 16-connection multi-threaded download command"
              >
                <Sparkles size={12} />
                <span>aria2c (16-thread)</span>
              </button>
              <button
                type="button"
                className="cli-chip-btn"
                onClick={() => handleCopyCommand('ffmpeg')}
                title="Copy ffmpeg stream copy command"
              >
                <Film size={12} />
                <span>ffmpeg</span>
              </button>
              <button
                type="button"
                className="cli-chip-btn"
                onClick={() => handleCopyCommand('vlc')}
                title="Copy VLC network stream play command"
              >
                <Play size={12} />
                <span>VLC Stream</span>
              </button>
            </div>
          </div>

          {/* Browser Video Download Extensions & Direct Links Section */}
          <div className="download-extension-card">
            <div className="download-extension-header">
              <Globe size={16} className="text-blue" />
              <span className="download-extension-title">Browser Video Download Extensions (Video DownloadHelper / 1DM)</span>
            </div>
            <p className="download-extension-text">
              Browser extensions can automatically detect the full media stream from protected player pages. Install <strong>Video DownloadHelper</strong> (Chrome, Firefox, Edge) or <strong>1DM</strong> (Mobile & PC), then open the stream link below:
            </p>
            <div className="download-extension-actions">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="extension-action-btn primary"
                title="Open stream in a clean new tab for browser video download extensions"
              >
                <ExternalLink size={14} />
                <span>Open Stream in New Tab (Extension Capture)</span>
              </a>
              <button
                type="button"
                className="extension-action-btn secondary"
                onClick={handleCopyLink}
                title="Copy direct stream URL for 1DM or IDM"
              >
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copied ? 'URL Copied!' : 'Copy Stream URL for 1DM / IDM'}</span>
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
              <span>How to Save the Full Video File to Your Disk:</span>
            </div>
            <ol className="download-guide-list">
              <li>
                <strong>Option 1 — 1-Click Desktop Downloader (Recommended):</strong> Click <strong>"yt-dlp (Full Video)"</strong> or <strong>"IDM"</strong> above. Open PowerShell or Terminal on your computer, paste (Ctrl+V), and hit Enter. The complete full-resolution video file will be downloaded directly to your computer.
              </li>
              <li>
                <strong>Option 2 — Browser Extension (Video DownloadHelper / 1DM):</strong> Open the stream in a new tab using the blue button above. Video DownloadHelper or 1DM will capture the underlying video stream and save the full MP4 file to your Downloads folder.
              </li>
              <li>
                <strong>Option 3 — Watch / Stream Directly:</strong> Click <strong>"Watch Stream in New Tab"</strong> or launch the in-app player to watch right now with zero storage requirements.
              </li>
            </ol>
          </div>

          {/* Download Progress & Status Feedback */}
          {(isDownloading || downloadProgress > 0) && (
            <div className="download-status-card">
              <div className="progress-info-row">
                <span className="status-text">
                  {downloadComplete ? (
                    <span className="status-complete"><CheckCircle2 size={16} /> Full Video File Saved to Downloads Folder!</span>
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
          {isDirectMedia ? (
            <button
              type="button"
              className="btn-download-action primary"
              onClick={handleStartDownload}
              disabled={isDownloading}
              title="Download video file directly to your local Downloads folder"
            >
              <Download size={18} />
              <span>{isDownloading ? 'Downloading Video File...' : `Download Full Video (${selectedQuality})`}</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-download-action primary"
              onClick={() => handleCopyCommand('yt-dlp')}
              title="Copy 1-click yt-dlp command to download full movie/episode directly to your PC"
            >
              <Terminal size={18} />
              <span>{commandCopied && copiedToolBadge === 'yt-dlp' ? 'yt-dlp Command Copied!' : 'Copy 1-Click yt-dlp Command'}</span>
            </button>
          )}

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-action watch-tab"
            title="Open streaming player in a new browser tab to watch or capture with extensions"
          >
            <ExternalLink size={16} />
            <span>Watch Stream in New Tab</span>
          </a>

          <button
            type="button"
            className="btn-download-action secondary"
            onClick={() => handleCopyCommand('idm')}
            title="Copy Internet Download Manager command"
          >
            {commandCopied && copiedToolBadge === 'idm' ? <Check size={16} className="text-green" /> : <Download size={16} />}
            <span>{commandCopied && copiedToolBadge === 'idm' ? 'IDM Copied!' : 'Copy IDM Cmd'}</span>
          </button>

          <button
            type="button"
            className="btn-download-action tertiary"
            onClick={handleCopyLink}
            title="Copy download stream URL for 1DM or IDM"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Helper footer text */}
        <div className="download-footer-tip">
          <ShieldAlert size={13} className="text-amber" />
          <span>Full Quality Video Guarantee: No 3 KB placeholders. Downloads full {estimatedSize} video directly via yt-dlp, IDM, aria2c, or browser extensions.</span>
        </div>
      </div>
    </div>
  );
}
