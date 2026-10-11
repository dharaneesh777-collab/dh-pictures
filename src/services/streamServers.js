/**
 * StreamVerse - Multi-Server Streaming Architecture
 * 
 * Configured API Endpoints:
 * Server 1: https://vixsrc.to/movie/${id} | https://vixsrc.to/tv/${id}/${season}/${episode}
 * Server 2: https://vidcore.net/movie/${id} | https://vidcore.net/tv/${id}/${season}/${episode}
 * Server 3: https://vidsrc.to/embed/movie/${id} | https://vidsrc.to/embed/tv/${id}/${season}/${episode}
 * Server 4: https://vidy.st/movie/${id} | https://vidy.st/tv/${id}/${season}/${episode}
 * Server 5: https://moviesapi.to/movie/${id}?autoplay=true | https://moviesapi.to/tv/${id}/${season}/${episode}?autoplay=true
 * Server 6 (Hindi): https://screenscape.me/embed?tmdb=${id}&type=movie | ...&type=tv&s=${season}&e=${episode}
 * Anime Server: https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${language} (supports sub and dub).
 * Trailers: https://www.youtube.com/embed/${trailerKey}?autoplay=1
 */

export const STREAM_SERVERS = [
  {
    id: 'server1',
    name: 'Server 1 (VixSrc)',
    shortName: 'VixSrc',
    tag: '4K Ultra Fast',
    badgeColor: '#6366f1',
    description: 'High-speed multi-quality stream with adaptive bitrate',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://vixsrc.to/movie/${id}`
        : `https://vixsrc.to/tv/${id}/${season}/${episode}`;
    }
  },
  {
    id: 'server2',
    name: 'Server 2 (VidCore)',
    shortName: 'VidCore',
    tag: 'HD Backup',
    badgeColor: '#3b82f6',
    description: 'Reliable CDN fallback with multiple audio tracks',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://vidcore.net/movie/${id}`
        : `https://vidcore.net/tv/${id}/${season}/${episode}`;
    }
  },
  {
    id: 'server3',
    name: 'Server 3 (VidSrc To)',
    shortName: 'VidSrc.to',
    tag: 'Popular',
    badgeColor: '#10b981',
    description: 'VidSrc network embed with subtitle support',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
    }
  },
  {
    id: 'server4',
    name: 'Server 4 (Vidy)',
    shortName: 'Vidy.st',
    tag: 'Fast Buffer',
    badgeColor: '#ec4899',
    description: 'Optimized low latency player with fast buffering',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://vidy.st/movie/${id}`
        : `https://vidy.st/tv/${id}/${season}/${episode}`;
    }
  },
  {
    id: 'server5',
    name: 'Server 5 (MoviesAPI)',
    shortName: 'MoviesAPI',
    tag: 'Autoplay On',
    badgeColor: '#f59e0b',
    description: 'Direct autoplay stream with low ad-load',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://moviesapi.to/movie/${id}?autoplay=true`
        : `https://moviesapi.to/tv/${id}/${season}/${episode}?autoplay=true`;
    }
  },
  {
    id: 'server6',
    name: 'Server 6 (Hindi - Screenscape)',
    shortName: 'Screenscape (Hindi)',
    tag: 'Hindi / Bollywood',
    badgeColor: '#ef4444',
    description: 'Dedicated Indian Cinema & Hindi dub streams',
    supports: ['movie', 'tv'],
    buildUrl: ({ type = 'movie', id, season = 1, episode = 1 }) => {
      if (!id) return '';
      return type === 'movie'
        ? `https://screenscape.me/embed?tmdb=${id}&type=movie`
        : `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${season}&e=${episode}`;
    }
  },
  {
    id: 'anime',
    name: 'Anime Server (MegaPlay Buzz)',
    shortName: 'MegaPlay Ani',
    tag: 'AniList Sub/Dub',
    badgeColor: '#8b5cf6',
    description: 'Specialized Anime player with instant Sub/Dub toggle',
    supports: ['anime'],
    buildUrl: ({ anilistId, episode = 1, language = 'sub' }) => {
      if (!anilistId) return '';
      const safeLang = (language === 'dub') ? 'dub' : 'sub';
      return `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${safeLang}`;
    }
  }
];

/**
 * Helper to build stream URL given server ID and parameters
 */
export function getStreamUrl({
  serverId,
  type = 'movie',
  id = '',
  season = 1,
  episode = 1,
  anilistId = '',
  language = 'sub',
  trailerKey = ''
}) {
  const cleanId = String(id || anilistId || '').trim();
  const cleanAnilistId = String(anilistId || id || '').trim();
  const effectiveServerId = serverId || (type === 'anime' ? 'anime' : 'server1');

  if (effectiveServerId === 'trailer') {
    return getTrailerUrl(trailerKey || cleanId);
  }

  if (effectiveServerId === 'anime') {
    const animeServer = STREAM_SERVERS.find(s => s.id === 'anime');
    return animeServer.buildUrl({
      anilistId: cleanAnilistId,
      episode: Math.max(1, Number(episode) || 1),
      language: language === 'dub' ? 'dub' : 'sub'
    });
  }

  const server = STREAM_SERVERS.find(s => s.id === effectiveServerId) || STREAM_SERVERS[0];

  return server.buildUrl({
    type: type === 'anime' ? 'tv' : type,
    id: cleanId,
    season: Math.max(1, Number(season) || 1),
    episode: Math.max(1, Number(episode) || 1)
  });
}

/**
 * Generate YouTube Trailer Embed URL with autoplay=1
 */
export function getTrailerUrl(trailerKey) {
  if (!trailerKey) return '';
  let key = String(trailerKey).trim();
  
  if (key.includes('youtube.com/watch')) {
    const match = key.match(/[?&]v=([^&#]+)/);
    if (match && match[1]) {
      key = match[1];
    }
  } else if (key.includes('youtu.be/')) {
    key = key.split('youtu.be/')[1].split(/[?&#]/)[0];
  } else if (key.includes('youtube.com/embed/')) {
    key = key.split('youtube.com/embed/')[1].split(/[?&#]/)[0];
  } else if (key.includes('v=')) {
    key = key.split('v=')[1].split(/[&#]/)[0];
  } else if (key.includes('?')) {
    key = key.split('?')[0];
  }

  // Remove any stray slashes or query characters
  key = key.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!key) return '';

  return `https://www.youtube.com/embed/${key}?autoplay=1`;
}
