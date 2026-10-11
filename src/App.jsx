import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import VideoPlayer from './components/VideoPlayer';
import MediaGrid from './components/MediaGrid';
import CustomStreamLauncher from './components/CustomStreamLauncher';
import TrailerModal from './components/TrailerModal';
import SettingsModal from './components/SettingsModal';
import WatchHistory from './components/WatchHistory';

import { 
  FEATURED_HERO, 
  CURATED_MOVIES, 
  TV_SHOWS, 
  HINDI_CINEMA, 
  ANIME_CATALOG 
} from './services/catalogData';
import { searchAniList } from './services/anilistService';
import { searchTMDB } from './services/tmdbService';
import { STREAM_SERVERS } from './services/streamServers';

export default function App() {
  // Saved Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('streamverse_settings');
      return saved ? JSON.parse(saved) : {
        tmdbApiKey: '',
        defaultServer: 'server1',
        defaultAnimeAudio: 'sub',
        sandboxDefault: false
      };
    } catch {
      return { tmdbApiKey: '', defaultServer: 'server1', defaultAnimeAudio: 'sub', sandboxDefault: false };
    }
  });

  // Watchlist & History
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('streamverse_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('streamverse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & View state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Active Player state
  const [activeMedia, setActiveMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeServer, setActiveServer] = useState(settings.defaultServer || 'server1');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [language, setLanguage] = useState(settings.defaultAnimeAudio || 'sub');
  const [cinemaMode, setCinemaMode] = useState(false);

  // Modals state
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, trailerKey: '', title: '' });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('streamverse_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('streamverse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('streamverse_history', JSON.stringify(history));
  }, [history]);

  // Deep linking: read URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');
    const srv = params.get('server');
    const s = parseInt(params.get('s') || params.get('season') || '1', 10);
    const ep = parseInt(params.get('e') || params.get('ep') || params.get('episode') || '1', 10);
    const lang = params.get('lang') || 'sub';

    if (id) {
      // Find matching item or construct dynamic one
      let found = [...CURATED_MOVIES, ...TV_SHOWS, ...HINDI_CINEMA, ...ANIME_CATALOG]
        .find(i => String(i.id) === String(id) || String(i.anilistId) === String(id));

      if (!found) {
        found = {
          id,
          anilistId: type === 'anime' ? id : undefined,
          type: type || 'movie',
          title: `${type?.toUpperCase() || 'Media'} #${id}`,
          poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
          seasons: [{ seasonNumber: s, episodesCount: 24 }]
        };
      }

      handlePlayMedia(found, {
        server: srv || (type === 'anime' ? 'anime' : (found.preferredServer || settings.defaultServer || 'server1')),
        season: s,
        episode: ep,
        language: lang
      });
    }
  }, []);

  // Update history whenever active media or episode changes
  const recordHistory = (media, srv, s, ep, lang) => {
    if (!media || !media.id) return;
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== media.id);
      const newEntry = {
        id: media.id,
        anilistId: media.anilistId,
        type: media.type,
        title: media.title,
        poster: media.poster,
        server: srv,
        season: s,
        episode: ep,
        language: lang,
        timestamp: Date.now()
      };
      return [newEntry, ...filtered].slice(0, 15);
    });
  };

  // Launch playback for a media item
  const handlePlayMedia = (media, options = {}) => {
    const isAnime = media.type === 'anime';
    const isHindi = media.isHindi || media.preferredServer === 'server6';
    
    // Choose sensible default server
    let targetServer = options.server;
    if (!targetServer) {
      if (isAnime) targetServer = 'anime';
      else if (isHindi) targetServer = 'server6';
      else targetServer = media.preferredServer || settings.defaultServer || 'server1';
    }

    const targetSeason = options.season || 1;
    const targetEpisode = options.episode || 1;
    const targetLang = options.language || (isAnime ? settings.defaultAnimeAudio : 'sub');

    setActiveMedia(media);
    setActiveServer(targetServer);
    setSeason(targetSeason);
    setEpisode(targetEpisode);
    setLanguage(targetLang);
    setIsPlaying(true);

    recordHistory(media, targetServer, targetSeason, targetEpisode, targetLang);

    // Smooth scroll to player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle direct custom launcher play
  const handleCustomLaunch = ({ media, server, season: s, episode: ep, language: lang, openTrailerNow }) => {
    if (openTrailerNow && media.trailerKey) {
      handleOpenTrailer(media.trailerKey, media.title);
      return;
    }
    handlePlayMedia(media, { server, season: s, episode: ep, language: lang });
  };

  // Watchlist toggle
  const handleToggleFavorite = (item) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  // Trailer modal handler
  const handleOpenTrailer = (trailerKey, title) => {
    setTrailerModal({ isOpen: true, trailerKey, title });
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const [tmdbResults, animeResults] = await Promise.all([
        searchTMDB(searchQuery, settings.tmdbApiKey),
        searchAniList(searchQuery)
      ]);

      const combined = [...tmdbResults, ...animeResults];
      setSearchResults(combined);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger search on debounce or Enter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearch}
        watchlistCount={watchlist.length}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="main-content">
        {/* Active Stream Video Player */}
        {isPlaying && activeMedia && (
          <VideoPlayer
            media={activeMedia}
            activeServer={activeServer}
            setActiveServer={(srv) => {
              setActiveServer(srv);
              recordHistory(activeMedia, srv, season, episode, language);
            }}
            season={season}
            setSeason={(s) => {
              setSeason(s);
              recordHistory(activeMedia, activeServer, s, episode, language);
            }}
            episode={episode}
            setEpisode={(ep) => {
              setEpisode(ep);
              recordHistory(activeMedia, activeServer, season, ep, language);
            }}
            language={language}
            setLanguage={(lang) => {
              setLanguage(lang);
              recordHistory(activeMedia, activeServer, season, episode, lang);
            }}
            cinemaMode={cinemaMode}
            setCinemaMode={setCinemaMode}
            onOpenTrailer={() => handleOpenTrailer(activeMedia.trailerKey, activeMedia.title)}
          />
        )}

        {/* Search Results Display */}
        {searchQuery.trim().length > 0 ? (
          <div className="search-results-wrapper">
            <MediaGrid
              title={`Search Results for "${searchQuery}"`}
              subtitle={isSearching ? 'Searching multi-source databases...' : `Found ${searchResults.length} matching titles`}
              items={searchResults}
              onPlay={handlePlayMedia}
              onOpenTrailer={handleOpenTrailer}
              favorites={watchlist}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage={isSearching ? 'Searching...' : 'No titles found matching your search. Try another keyword or use the Direct ID Launcher.'}
            />
          </div>
        ) : (
          <>
            {/* If no active video playing and tab is 'all', show Spotlight Hero Banner */}
            {!isPlaying && activeTab === 'all' && (
              <HeroBanner
                item={FEATURED_HERO}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
              />
            )}

            {/* Continue Watching Row */}
            <WatchHistory
              history={history}
              onResume={(item) => handlePlayMedia(item, {
                server: item.server,
                season: item.season,
                episode: item.episode,
                language: item.language
              })}
              onClearHistory={() => setHistory([])}
            />

            {/* Direct Custom Stream Launcher Tab */}
            {activeTab === 'launcher' && (
              <div className="launcher-tab-wrap">
                <CustomStreamLauncher onLaunchStream={handleCustomLaunch} />
              </div>
            )}

            {/* Watchlist Tab */}
            {activeTab === 'watchlist' && (
              <MediaGrid
                title="My Watchlist"
                subtitle="Your saved movies, shows, and anime"
                items={watchlist}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
                favorites={watchlist}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage="Your watchlist is currently empty. Click the heart icon on any title to save it here!"
              />
            )}

            {/* Hindi Cinema Tab (Server 6 screenscape focus) */}
            {(activeTab === 'all' || activeTab === 'hindi') && (
              <MediaGrid
                title="Hindi Cinema & Bollywood"
                subtitle="Optimized with Server 6 (Screenscape Hindi Audio Embeds)"
                items={HINDI_CINEMA}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
                favorites={watchlist}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Anime Tab (Megaplay AniList Server focus) */}
            {(activeTab === 'all' || activeTab === 'anime') && (
              <MediaGrid
                title="Anime Showcase"
                subtitle="Powered by Megaplay Buzz AniList Server (Sub & Dub Audio)"
                items={ANIME_CATALOG}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
                favorites={watchlist}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Movies Tab */}
            {(activeTab === 'all' || activeTab === 'movies') && (
              <MediaGrid
                title="Trending Movies"
                subtitle="Streamable across Server 1 (VixSrc), Server 2 (VidCore), Server 3 (VidSrc), Server 4, and Server 5"
                items={CURATED_MOVIES}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
                favorites={watchlist}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* TV Shows Tab */}
            {(activeTab === 'all' || activeTab === 'tv') && (
              <MediaGrid
                title="Popular TV Series"
                subtitle="With full season & episode selector for all servers"
                items={TV_SHOWS}
                onPlay={handlePlayMedia}
                onOpenTrailer={handleOpenTrailer}
                favorites={watchlist}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Direct Launcher teaser at bottom of 'all' tab */}
            {activeTab === 'all' && (
              <div className="launcher-bottom-section">
                <CustomStreamLauncher onLaunchStream={handleCustomLaunch} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="footer-container">
          <div className="footer-info">
            <span className="footer-brand">STREAMVERSE</span>
            <p className="footer-desc">
              Universal multi-server streaming frontend with support for VixSrc, VidCore, VidSrc, Vidy, MoviesAPI, Screenscape Hindi, Megaplay Anime, and YouTube Trailers.
            </p>
          </div>
          <div className="footer-servers-summary">
            <span>Integrated API Servers:</span>
            <div className="footer-server-chips">
              {STREAM_SERVERS.map(s => (
                <span key={s.id} className="footer-chip" style={{ borderColor: s.badgeColor }}>
                  {s.shortName}
                </span>
              ))}
              <span className="footer-chip yt">YouTube Trailers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Trailer Modal */}
      {trailerModal.isOpen && (
        <TrailerModal
          trailerKey={trailerModal.trailerKey}
          title={trailerModal.title}
          onClose={() => setTrailerModal({ isOpen: false, trailerKey: '', title: '' })}
        />
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSaveSettings={(newSettings) => setSettings(newSettings)}
          onClearHistory={() => setHistory([])}
          onClearWatchlist={() => setWatchlist([])}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
