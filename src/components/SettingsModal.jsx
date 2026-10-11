import React, { useState } from 'react';
import { X, Key, Server, Trash2, Check, BookOpen } from 'lucide-react';
import { STREAM_SERVERS } from '../services/streamServers';

export default function SettingsModal({
  settings,
  onSaveSettings,
  onClearHistory,
  onClearWatchlist,
  onClose
}) {
  const [apiKey, setApiKey] = useState(settings.tmdbApiKey || '');
  const [defaultServer, setDefaultServer] = useState(settings.defaultServer || 'server1');
  const [defaultAnimeAudio, setDefaultAnimeAudio] = useState(settings.defaultAnimeAudio || 'sub');
  const [sandboxDefault, setSandboxDefault] = useState(settings.sandboxDefault ?? false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      tmdbApiKey: apiKey.trim(),
      defaultServer,
      defaultAnimeAudio,
      sandboxDefault
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Settings & API Configuration</h3>
          <button className="btn-icon modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="settings-body">
          {/* TMDB API Key */}
          <div className="setting-section">
            <div className="setting-label-row">
              <Key size={16} className="text-blue" />
              <label htmlFor="tmdb-key-input" className="setting-title">
                TMDB API Key (Optional)
              </label>
            </div>
            <p className="setting-subtext">
              Enter your free TMDB v3 API key to enable live real-time search across 800,000+ movies and TV series.
              Leave empty to use the built-in curated catalog.
            </p>
            <input
              id="tmdb-key-input"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. 3a1b2c..."
              className="form-input"
            />
          </div>

          {/* Default Server */}
          <div className="setting-section">
            <div className="setting-label-row">
              <Server size={16} className="text-purple" />
              <label htmlFor="default-server-select" className="setting-title">
                Default Stream Server
              </label>
            </div>
            <select
              id="default-server-select"
              value={defaultServer}
              onChange={(e) => setDefaultServer(e.target.value)}
              className="form-select"
            >
              {STREAM_SERVERS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.tag}
                </option>
              ))}
            </select>
          </div>

          {/* Default Anime Audio */}
          <div className="setting-section">
            <label className="setting-title">Default Anime Audio</label>
            <div className="pill-toggle-group">
              <button
                type="button"
                className={`pill-toggle ${defaultAnimeAudio === 'sub' ? 'active' : ''}`}
                onClick={() => setDefaultAnimeAudio('sub')}
              >
                Japanese SUB
              </button>
              <button
                type="button"
                className={`pill-toggle ${defaultAnimeAudio === 'dub' ? 'active' : ''}`}
                onClick={() => setDefaultAnimeAudio('dub')}
              >
                English DUB
              </button>
            </div>
          </div>

          {/* Sandbox toggle */}
          <div className="setting-section checkbox-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sandboxDefault}
                onChange={(e) => setSandboxDefault(e.target.checked)}
              />
              <span>Enable Ad-Blocking Sandbox by default (restricts popups)</span>
            </label>
          </div>

          {/* Supported API Reference Accordion */}
          <div className="setting-section api-reference-card">
            <div className="setting-label-row">
              <BookOpen size={16} className="text-cyan" />
              <span className="setting-title">Configured Streaming API Specs</span>
            </div>
            <ul className="api-specs-list">
              <li><strong>Server 1:</strong> <code>https://vixsrc.to/movie/${'{id}'}</code> | <code>.../tv/${'{id}'}/${'{season}'}/${'{episode}'}</code></li>
              <li><strong>Server 2:</strong> <code>https://vidcore.net/movie/${'{id}'}</code> | <code>.../tv/${'{id}'}/${'{season}'}/${'{episode}'}</code></li>
              <li><strong>Server 3:</strong> <code>https://vidsrc.to/embed/movie/${'{id}'}</code> | <code>.../tv/${'{id}'}/${'{season}'}/${'{episode}'}</code></li>
              <li><strong>Server 4:</strong> <code>https://vidy.st/movie/${'{id}'}</code> | <code>.../tv/${'{id}'}/${'{season}'}/${'{episode}'}</code></li>
              <li><strong>Server 5:</strong> <code>https://moviesapi.to/movie/${'{id}'}?autoplay=true</code> | <code>.../tv/...</code></li>
              <li><strong>Server 6 (Hindi):</strong> <code>https://screenscape.me/embed?tmdb=${'{id}'}&type=movie</code> | <code>...&type=tv&s=${'{s}'}&e=${'{e}'}</code></li>
              <li><strong>Anime:</strong> <code>https://megaplay.buzz/stream/ani/${'{anilistId}'}/${'{ep}'}/${'{lang}'}</code></li>
              <li><strong>Trailers:</strong> <code>https://www.youtube.com/embed/${'{trailerKey}'}?autoplay=1</code></li>
            </ul>
          </div>

          {/* Danger zone / Data management */}
          <div className="setting-section danger-zone">
            <span className="setting-title text-red">Data Management</span>
            <div className="danger-buttons">
              <button 
                type="button" 
                className="btn-danger"
                onClick={() => {
                  onClearHistory();
                  alert('Watch history cleared.');
                }}
              >
                <Trash2 size={14} />
                <span>Clear Watch History</span>
              </button>
              <button 
                type="button" 
                className="btn-danger"
                onClick={() => {
                  onClearWatchlist();
                  alert('Watchlist cleared.');
                }}
              >
                <Trash2 size={14} />
                <span>Clear Watchlist</span>
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? <Check size={16} /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
