import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Flame,
  Download 
} from 'lucide-react';
import { STREAM_SERVERS, getStreamUrl, getTrailerUrl } from '../services/streamServers';

export default function CustomStreamLauncher({ onLaunchStream, onDownloadStream }) {
  const [mediaType, setMediaType] = useState('movie');
  const [customId, setCustomId] = useState('872585');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('server1');
  const [animeLang, setAnimeLang] = useState('sub');
  const [trailerKey, setTrailerKey] = useState('uYPbbksJxIg');
  const [copied, setCopied] = useState(false);

  // Compute live URL based on current inputs
  let generatedUrl = '';
  if (mediaType === 'trailer') {
    generatedUrl = getTrailerUrl(trailerKey);
  } else if (mediaType === 'anime') {
    generatedUrl = getStreamUrl({
      serverId: selectedServer,
      type: 'anime',
      anilistId: customId,
      id: customId,
      episode,
      language: animeLang
    });
  } else {
    generatedUrl = getStreamUrl({
      serverId: selectedServer,
      type: mediaType,
      id: customId,
      season,
      episode
    });
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    if (mediaType === 'trailer') {
      onLaunchStream({
        media: {
          id: 'custom-trailer',
          title: `YouTube Trailer (${trailerKey})`,
          type: 'movie',
          trailerKey
        },
        server: 'trailer',
        season: 1,
        episode: 1
      });
      return;
    }

    if (mediaType === 'anime') {
      onLaunchStream({
        media: {
          id: customId,
          anilistId: customId,
          type: 'anime',
          title: `Anime (AniList #${customId})`,
          episodesCount: Math.max(Number(episode) || 24, 24)
        },
        server: selectedServer === 'server1' ? 'anime' : selectedServer,
        season: 1,
        episode: Number(episode) || 1,
        language: animeLang
      });
      return;
    }

    // Movie or TV
    onLaunchStream({
      media: {
        id: customId,
        type: mediaType,
        title: `${mediaType === 'movie' ? 'Movie' : 'TV Show'} (TMDB #${customId})`,
        seasons: [{ seasonNumber: Number(season) || 1, episodesCount: 24 }]
      },
      server: selectedServer,
      season: Number(season) || 1,
      episode: Number(episode) || 1,
      language: 'sub'
    });
  };

  const handleDownload = () => {
    if (!onDownloadStream || mediaType === 'trailer') return;
    const isAnime = mediaType === 'anime';
    const media = {
      id: customId,
      anilistId: isAnime ? customId : undefined,
      type: mediaType,
      title: `${mediaType === 'movie' ? 'Movie' : mediaType === 'tv' ? 'TV Show' : 'Anime'} #${customId}`,
      seasons: [{ seasonNumber: Number(season) || 1, episodesCount: 24 }],
      episodesCount: Math.max(Number(episode) || 24, 24)
    };
    onDownloadStream({
      media,
      season: Number(season) || 1,
      episode: Number(episode) || 1,
      language: animeLang,
      server: selectedServer
    });
  };

  const applyPreset = (preset) => {
    setMediaType(preset.type);
    if (preset.id) setCustomId(preset.id);
    if (preset.season) setSeason(preset.season);
    if (preset.episode) setEpisode(preset.episode);
    if (preset.server) setSelectedServer(preset.server);
    if (preset.lang) setAnimeLang(preset.lang);
    if (preset.trailerKey) setTrailerKey(preset.trailerKey);
  };

  return (
    <div className="custom-launcher-card">
      <div className="launcher-header">
        <div className="launcher-title-wrap">
          <Terminal size={22} className="launcher-icon" />
          <div>
            <h3 className="launcher-title">Direct Custom Stream Launcher</h3>
            <p className="launcher-sub">
              Test and stream ANY custom TMDB ID, TV Season/Episode, AniList Anime ID, or YouTube trailer across all 8 configured APIs.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips for All Configured Servers */}
      <div className="presets-bar">
        <span className="presets-label"><Flame size={14} className="text-orange" /> Presets:</span>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '872585', server: 'server1' })}
        >
          S1: Oppenheimer
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '550', server: 'server2' })}
        >
          S2: Fight Club
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'tv', id: '1396', season: 1, episode: 1, server: 'server3' })}
        >
          S3: Breaking Bad
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '693134', server: 'server4' })}
        >
          S4: Dune 2
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '157336', server: 'server5' })}
        >
          S5: Interstellar (Autoplay)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '872906', server: 'server6' })}
        >
          S6: Jawan (Hindi)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'anime', id: '16498', episode: 1, lang: 'sub', server: 'anime' })}
        >
          Anime: AoT (Sub)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'anime', id: '113415', episode: 1, lang: 'dub', server: 'anime' })}
        >
          Anime: JJK (Dub)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'trailer', trailerKey: 'uYPbbksJxIg' })}
        >
          Trailer: Oppenheimer
        </button>
      </div>

      {/* Inputs Form */}
      <div className="launcher-grid">
        {/* Media Type */}
        <div className="form-group">
          <label className="form-label">Type:</label>
          <div className="pill-toggle-group">
            <button
              className={`pill-toggle ${mediaType === 'movie' ? 'active' : ''}`}
              onClick={() => { setMediaType('movie'); if (selectedServer === 'anime') setSelectedServer('server1'); }}
            >
              Movie
            </button>
            <button
              className={`pill-toggle ${mediaType === 'tv' ? 'active' : ''}`}
              onClick={() => { setMediaType('tv'); if (selectedServer === 'anime') setSelectedServer('server1'); }}
            >
              TV Series
            </button>
            <button
              className={`pill-toggle ${mediaType === 'anime' ? 'active' : ''}`}
              onClick={() => { setMediaType('anime'); setSelectedServer('anime'); if (customId === '872585') setCustomId('16498'); }}
            >
              Anime
            </button>
            <button
              className={`pill-toggle ${mediaType === 'trailer' ? 'active' : ''}`}
              onClick={() => setMediaType('trailer')}
            >
              Trailer
            </button>
          </div>
        </div>

        {/* Server Selector */}
        {mediaType !== 'trailer' && (
          <div className="form-group">
            <label className="form-label">Select Server:</label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="form-select"
            >
              {STREAM_SERVERS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.tag})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Anime Audio Language */}
        {mediaType === 'anime' && (
          <div className="form-group">
            <label className="form-label">Audio Language:</label>
            <div className="pill-toggle-group">
              <button
                className={`pill-toggle ${animeLang === 'sub' ? 'active' : ''}`}
                onClick={() => setAnimeLang('sub')}
              >
                SUB (Original Japanese)
              </button>
              <button
                className={`pill-toggle ${animeLang === 'dub' ? 'active' : ''}`}
                onClick={() => setAnimeLang('dub')}
              >
                DUB (English)
              </button>
            </div>
          </div>
        )}

        {/* ID input */}
        {mediaType !== 'trailer' && (
          <div className="form-group">
            <label className="form-label">
              {mediaType === 'anime' ? 'AniList Anime ID:' : 'TMDB Media ID:'}
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder={mediaType === 'anime' ? 'e.g. 16498' : 'e.g. 872585'}
              className="form-input"
            />
          </div>
        )}

        {/* Trailer Key input */}
        {mediaType === 'trailer' && (
          <div className="form-group">
            <label className="form-label">YouTube Trailer Key / Video ID:</label>
            <input
              type="text"
              value={trailerKey}
              onChange={(e) => setTrailerKey(e.target.value)}
              placeholder="e.g. uYPbbksJxIg"
              className="form-input"
            />
          </div>
        )}

        {/* Season & Episode for TV */}
        {mediaType === 'tv' && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Season:</label>
              <input
                type="number"
                min="1"
                value={season}
                onChange={(e) => setSeason(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Episode:</label>
              <input
                type="number"
                min="1"
                value={episode}
                onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Episode for Anime */}
        {mediaType === 'anime' && (
          <div className="form-group">
            <label className="form-label">Episode Number:</label>
            <input
              type="number"
              min="1"
              value={episode}
              onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Generated Live URL Output */}
      <div className="generated-url-box">
        <div className="url-box-label">
          <span>Generated Endpoint:</span>
          <button className="copy-btn-mini" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="url-box-code">
          <code>{generatedUrl || '(Fill in parameters above)'}</code>
        </div>
      </div>

      {/* Actions */}
      <div className="launcher-actions">
        <button className="btn-launch-primary" onClick={handleLaunch}>
          <Play size={18} fill="currentColor" />
          <span>Stream in Player Now</span>
        </button>

        {onDownloadStream && mediaType !== 'trailer' && (
          <button
            type="button"
            className="btn-launch-secondary"
            onClick={handleDownload}
            title="Download this stream to local downloads"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        )}

        {generatedUrl && (
          <a
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-launch-secondary"
          >
            <ExternalLink size={16} />
            <span>Open Direct in Browser</span>
          </a>
        )}
      </div>
    </div>
  );
}
