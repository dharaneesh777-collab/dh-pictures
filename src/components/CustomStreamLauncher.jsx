import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Film, 
  Tv, 
  Languages, 
  Flame 
} from 'lucide-react';
import { STREAM_SERVERS, getStreamUrl, getTrailerUrl } from '../services/streamServers';

export default function CustomStreamLauncher({ onLaunchStream }) {
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
      serverId: 'anime',
      type: 'anime',
      anilistId: customId,
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
        openTrailerNow: true
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
          episodesCount: Math.max(Number(episode) || 12, 12)
        },
        server: 'anime',
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
              Test and stream ANY custom TMDB ID, TV Season/Episode, AniList Anime ID, or YouTube trailer directly.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="presets-bar">
        <span className="presets-label"><Flame size={14} className="text-orange" /> Quick Presets:</span>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '872585', server: 'server1' })}
        >
          Oppenheimer (Server 1)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'movie', id: '872906', server: 'server6' })}
        >
          Jawan (Hindi Server 6)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'tv', id: '1396', season: 1, episode: 1, server: 'server3' })}
        >
          Breaking Bad S1E1 (Server 3)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'anime', id: '16498', episode: 1, lang: 'sub' })}
        >
          Attack on Titan Ep 1 (Sub)
        </button>
        <button
          className="preset-chip"
          onClick={() => applyPreset({ type: 'anime', id: '113415', episode: 1, lang: 'dub' })}
        >
          Jujutsu Kaisen Ep 1 (Dub)
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

        {/* Server Selector (if movie or tv) */}
        {(mediaType === 'movie' || mediaType === 'tv') && (
          <div className="form-group">
            <label className="form-label">Select Server (1 to 6):</label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="form-select"
            >
              {STREAM_SERVERS.filter(s => s.id !== 'anime').map(s => (
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
