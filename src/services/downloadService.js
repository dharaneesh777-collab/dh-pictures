/**
 * DH PICTURES - Universal Download Service
 * Generates direct download streams, multi-quality mirrors,
 * audio/subtitle options, and triggers client-side browser downloads.
 */

import { STREAM_SERVERS } from './streamServers';

export const QUALITY_OPTIONS = [
  {
    id: '1080p',
    label: '1080p FHD',
    badge: 'Ultra HD',
    resolution: '1920x1080',
    bitrate: '4500 kbps',
    movieSize: '2.1 GB',
    episodeSize: '480 MB',
    format: 'MP4 (H.264 / AAC)'
  },
  {
    id: '720p',
    label: '720p HD',
    badge: 'Standard HD',
    resolution: '1280x720',
    bitrate: '2200 kbps',
    movieSize: '1.1 GB',
    episodeSize: '260 MB',
    format: 'MP4 (H.264 / AAC)'
  },
  {
    id: '480p',
    label: '480p SD',
    badge: 'Fast Buffer',
    resolution: '854x480',
    bitrate: '1100 kbps',
    movieSize: '480 MB',
    episodeSize: '120 MB',
    format: 'MP4 (H.264 / AAC)'
  },
  {
    id: '360p',
    label: '360p Mobile',
    badge: 'Data Saver',
    resolution: '640x360',
    bitrate: '650 kbps',
    movieSize: '240 MB',
    episodeSize: '65 MB',
    format: 'MP4 (H.264 / AAC)'
  }
];

export const AUDIO_OPTIONS = {
  movie: [
    { id: 'en', label: 'English (Original 5.1)' },
    { id: 'hi', label: 'Hindi (Screenscape Dub)' },
    { id: 'multi', label: 'Multi-Audio (Subtitles included)' }
  ],
  tv: [
    { id: 'en', label: 'English (Original)' },
    { id: 'hi', label: 'Hindi (Dubbed)' },
    { id: 'multi', label: 'Multi-Audio' }
  ],
  anime: [
    { id: 'sub', label: 'Japanese Audio (English Subtitles)' },
    { id: 'dub', label: 'English Dubbed' },
    { id: 'hi-dub', label: 'Hindi Dubbed' }
  ]
};

/**
 * Format a clean, standardized filename for downloads
 */
export function formatFileName({
  title = 'Media',
  type = 'movie',
  year,
  season = 1,
  episode = 1,
  quality = '1080p',
  language = 'en'
}) {
  const safeTitle = String(title || 'Media')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '.');

  const langTag = language.toUpperCase();
  const qTag = quality.toUpperCase();

  if (type === 'tv') {
    const s = String(season || 1).padStart(2, '0');
    const ep = String(episode || 1).padStart(2, '0');
    return `${safeTitle}.S${s}E${ep}.${qTag}.${langTag}.DHPictures.mp4`;
  }

  if (type === 'anime') {
    const ep = String(episode || 1).padStart(2, '0');
    return `${safeTitle}.EP${ep}.${langTag}.${qTag}.DHPictures.mp4`;
  }

  // Movie
  const yearTag = year ? `.${String(year).split('-')[0]}` : '';
  return `${safeTitle}${yearTag}.${qTag}.${langTag}.DHPictures.mp4`;
}

/**
 * Generate direct download mirror URL for a given media, server, and parameters
 */
export function getDownloadUrl({
  media,
  serverId = 'server1',
  quality = '1080p',
  season = 1,
  episode = 1,
  language = 'en'
}) {
  if (!media) return '';
  const id = String(media.id || media.anilistId || '').trim();
  const anilistId = String(media.anilistId || media.id || '').trim();
  const type = media.type || 'movie';

  switch (serverId) {
    case 'server1':
      // VixSrc download gateway
      return type === 'movie'
        ? `https://vixsrc.to/download/movie/${id}?quality=${quality}&lang=${language}`
        : `https://vixsrc.to/download/tv/${id}/${season}/${episode}?quality=${quality}&lang=${language}`;

    case 'server2':
      // VidCore CDN direct mirror
      return type === 'movie'
        ? `https://vidcore.net/download/movie/${id}?res=${quality}`
        : `https://vidcore.net/download/tv/${id}/${season}/${episode}?res=${quality}`;

    case 'server3':
      // VidSrc stream download mirror
      return type === 'movie'
        ? `https://vidsrc.to/embed/movie/${id}?download=1&q=${quality}`
        : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?download=1&q=${quality}`;

    case 'server4':
      // Vidy fast mirror
      return type === 'movie'
        ? `https://vidy.st/download/movie/${id}?q=${quality}`
        : `https://vidy.st/download/tv/${id}/${season}/${episode}?q=${quality}`;

    case 'server5':
      // MoviesAPI stream download
      return type === 'movie'
        ? `https://moviesapi.to/download/movie/${id}?res=${quality}&dl=true`
        : `https://moviesapi.to/download/tv/${id}/${season}/${episode}?res=${quality}&dl=true`;

    case 'server6':
      // Screenscape Hindi download
      return type === 'movie'
        ? `https://screenscape.me/download?tmdb=${id}&type=movie&res=${quality}`
        : `https://screenscape.me/download?tmdb=${id}&type=tv&s=${season}&e=${episode}&res=${quality}`;

    case 'anime':
      // MegaPlay AniList direct stream download
      {
        const safeLang = language === 'dub' ? 'dub' : 'sub';
        return `https://megaplay.buzz/download/ani/${anilistId}/${episode}/${safeLang}?quality=${quality}`;
      }

    default:
      return `https://vixsrc.to/download/movie/${id}?quality=${quality}`;
  }
}

/**
 * Get available download servers for a media item
 */
export function getAvailableDownloadServers(media) {
  if (!media) return STREAM_SERVERS;
  const isAnime = media.type === 'anime';
  const isHindi = media.isHindi || media.preferredServer === 'server6';

  if (isAnime) {
    return STREAM_SERVERS.filter(s => s.id === 'anime' || s.id === 'server1');
  }

  if (isHindi) {
    return [
      STREAM_SERVERS.find(s => s.id === 'server6'),
      ...STREAM_SERVERS.filter(s => s.id !== 'server6' && s.id !== 'anime')
    ].filter(Boolean);
  }

  return STREAM_SERVERS.filter(s => s.id !== 'anime');
}

/**
 * Estimate file size based on media type and quality
 */
export function getEstimatedSize(mediaType, qualityId) {
  const q = QUALITY_OPTIONS.find(item => item.id === qualityId) || QUALITY_OPTIONS[0];
  return mediaType === 'movie' ? q.movieSize : q.episodeSize;
}

/**
 * Triggers a client-side download to the user's local downloads folder.
 * Creates an anchor element and dispatches click, while providing status updates.
 */
export function triggerBrowserDownload({
  url,
  filename,
  onStatusChange
}) {
  if (typeof onStatusChange === 'function') {
    onStatusChange({
      status: 'starting',
      progress: 10,
      message: 'Connecting to download server...'
    });
  }

  return new Promise((resolve) => {
    // Step 1: Simulated handshake and buffer progress
    setTimeout(() => {
      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'connecting',
          progress: 40,
          message: 'Allocating high-speed stream chunk...'
        });
      }
    }, 400);

    setTimeout(() => {
      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'downloading',
          progress: 80,
          message: `Packaging file: ${filename}...`
        });
      }
    }, 900);

    setTimeout(() => {
      // Step 2: Trigger browser download action to user's local downloads folder
      try {
        if (typeof document !== 'undefined') {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      } catch (err) {
        console.warn('Native download link trigger fallback:', err);
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      }

      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'completed',
          progress: 100,
          message: 'Download initiated! Check your browser local Downloads folder.'
        });
      }

      resolve({ success: true, filename, url });
    }, 1400);
  });
}
