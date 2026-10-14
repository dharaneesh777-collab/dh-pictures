/**
 * DH PICTURES - Universal Download Service
 * Generates direct download streams, multi-quality mirrors,
 * audio/subtitle options, and triggers client-side browser downloads.
 */

import { STREAM_SERVERS, getStreamUrl } from './streamServers.js';

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
  const cleanTitle = String(title || 'Media')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '.');
  const safeTitle = cleanTitle || 'Media';

  const langTag = String(language || 'en').toUpperCase();
  const qTag = String(quality || '1080p').toUpperCase();

  const safeSeason = Math.max(1, parseInt(season, 10) || 1);
  const safeEpisode = Math.max(1, parseInt(episode, 10) || 1);

  if (type === 'tv') {
    const s = String(safeSeason).padStart(2, '0');
    const ep = String(safeEpisode).padStart(2, '0');
    return `${safeTitle}.S${s}E${ep}.${qTag}.${langTag}.DHPictures.mp4`;
  }

  if (type === 'anime') {
    const ep = String(safeEpisode).padStart(2, '0');
    return `${safeTitle}.EP${ep}.${langTag}.${qTag}.DHPictures.mp4`;
  }

  // Movie
  const yearTag = year ? `.${String(year).split('-')[0]}` : '';
  return `${safeTitle}${yearTag}.${qTag}.${langTag}.DHPictures.mp4`;
}

/**
 * Generate direct download mirror URL for a given media, server, and parameters.
 * Always points to real, working streaming mirrors and avoids fake 404 routes.
 */
export function getDownloadUrl({
  media,
  serverId = 'server1',
  quality: _quality = '1080p',
  season = 1,
  episode = 1,
  language = 'en'
}) {
  if (!media) return '';
  const id = String(media.id || media.anilistId || '').trim();
  const anilistId = String(media.anilistId || media.id || '').trim();
  if (!id && !anilistId) return '';

  const type = media.type || 'movie';

  // If server is 'trailer' or invalid, select default download server for this media
  let effectiveServer = serverId;
  if (effectiveServer === 'trailer' || !effectiveServer) {
    effectiveServer = type === 'anime' ? 'anime' : (media.preferredServer || 'server1');
  }

  return getStreamUrl({
    serverId: effectiveServer,
    type,
    id,
    season,
    episode,
    anilistId,
    language
  });
}

/**
 * Generate 1-click CLI download command for desktop users (yt-dlp, ffmpeg, curl, vlc, idm, aria2c)
 */
export function getDownloadCommand(tool = 'yt-dlp', { url = '', filename = 'media.mp4' } = {}) {
  if (!url) return '';
  const normalizedTool = String(tool).toLowerCase();
  switch (normalizedTool) {
    case 'yt-dlp':
    case 'ytdlp':
      return `yt-dlp "${url}" -o "${filename}"`;
    case 'ffmpeg':
      return `ffmpeg -i "${url}" -c copy "${filename}"`;
    case 'curl':
      return `curl -L "${url}" -o "${filename}"`;
    case 'vlc':
      return `vlc "${url}"`;
    case 'idm':
    case 'idman':
      return `idman /d "${url}" /p "%USERPROFILE%\\Downloads" /f "${filename}" /n /a`;
    case 'aria2':
    case 'aria2c':
      return `aria2c -s 16 -x 16 -o "${filename}" "${url}"`;
    case '1dm':
      return `${url}`;
    default:
      return `yt-dlp "${url}" -o "${filename}"`;
  }
}

export function getDownloadCommands({ url = '', filename = 'media.mp4' } = {}) {
  return {
    'yt-dlp': getDownloadCommand('yt-dlp', { url, filename }),
    ffmpeg: getDownloadCommand('ffmpeg', { url, filename }),
    curl: getDownloadCommand('curl', { url, filename }),
    vlc: getDownloadCommand('vlc', { url, filename }),
    idm: getDownloadCommand('idm', { url, filename }),
    aria2c: getDownloadCommand('aria2c', { url, filename })
  };
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
 * Detect whether a given URL points to an accessible direct media file (.mp4, .mkv, blob, etc.)
 * versus a protected third-party embed player iframe (vixsrc, vidcore, screenscape, megaplay, etc.)
 */
export function isDirectMediaStream(url) {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.trim().toLowerCase();
  if (cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:')) {
    return true;
  }
  try {
    const parsed = new URL(cleanUrl, 'http://localhost');
    const pathname = parsed.pathname.toLowerCase();
    return /\.(mp4|mkv|webm|ts|m4s|mp3|m4a|aac)$/i.test(pathname);
  } catch {
    return /\.(mp4|mkv|webm|ts|m4s)(\?|$)/i.test(cleanUrl);
  }
}

/**
 * @deprecated Synthetic 3 KB placeholder MP4 generation has been permanently disabled.
 * Never generate or deliver a synthetic dummy file that claims to be a full video.
 */
export function createMp4Blob() {
  throw new Error(
    'Synthetic placeholder MP4 generation has been permanently removed to prevent delivering dummy files. Real video files must be downloaded directly or via yt-dlp/IDM.'
  );
}

/**
 * Triggers a real client-side local file download directly to the user's Downloads folder.
 * - For direct media sources (direct .mp4, .mkv, blob), it streams real chunks and saves the actual file.
 * - For third-party embed servers (vixsrc, vidcore, screenscape, etc.), in-browser scraping
 *   is blocked by standard browser Same-Origin Policy (CORS). Instead of creating a misleading 3 KB mock file,
 *   it rejects with CORS restriction details and working CLI commands (yt-dlp, IDM, aria2c).
 */
export async function triggerBrowserDownload({
  url,
  filename = 'download.mp4',
  media: _media = null,
  quality = '1080p',
  onStatusChange,
  directStreamUrl = null
}) {
  if (!url && !directStreamUrl) {
    throw new Error('Missing download URL');
  }

  const effectiveUrl = directStreamUrl || url;
  const isDirect = isDirectMediaStream(effectiveUrl);

  if (!isDirect) {
    if (typeof onStatusChange === 'function') {
      onStatusChange({
        status: 'cors_restricted',
        progress: 0,
        message: 'Direct in-browser download is restricted by browser CORS for embed stream servers. Please use yt-dlp or IDM command.'
      });
    }

    const error = new Error(
      'In-browser direct video downloads are restricted by browser Same-Origin Policy (CORS) for third-party embed stream servers. Please use yt-dlp, IDM, or aria2c to download the full video file.'
    );
    error.code = 'CORS_RESTRICTED';
    error.isEmbedServer = true;
    error.url = effectiveUrl;
    error.filename = filename;
    error.quality = quality;
    error.commands = getDownloadCommands({ url: effectiveUrl, filename });
    throw error;
  }

  if (typeof onStatusChange === 'function') {
    onStatusChange({
      status: 'starting',
      progress: 10,
      message: 'Connecting to direct streaming source...'
    });
  }

  const response = await fetch(effectiveUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch media stream (${response.status}: ${response.statusText})`);
  }

  const contentLength = Number(response.headers.get('content-length')) || 0;
  let downloadedBlob = null;

  if (response.body && typeof response.body.getReader === 'function') {
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;

      if (contentLength > 0 && typeof onStatusChange === 'function') {
        const progress = Math.min(99, Math.max(10, Math.round((loaded / contentLength) * 100)));
        onStatusChange({
          status: 'downloading',
          progress,
          message: `Downloading video stream: ${progress}% (${(loaded / 1048576).toFixed(1)} MB)...`
        });
      }
    }

    downloadedBlob = new Blob(chunks, {
      type: response.headers.get('content-type') || 'video/mp4'
    });
  } else {
    downloadedBlob = await response.blob();
  }

  // Never deliver empty or synthetic dummy files
  if (!downloadedBlob || downloadedBlob.size === 0) {
    throw new Error('Downloaded stream is empty. Stream could not be retrieved.');
  }

  let blobUrl = '';
  let downloadedViaBlob = false;

  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    blobUrl = URL.createObjectURL(downloadedBlob);
  }

  if (typeof document !== 'undefined') {
    const link = document.createElement('a');
    link.href = blobUrl || effectiveUrl;
    link.download = filename || 'download.mp4';
    if (!blobUrl) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
        if (blobUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
          URL.revokeObjectURL(blobUrl);
        }
      } catch {
        // ignore cleanup errors
      }
    }, 1000);
    downloadedViaBlob = Boolean(blobUrl);
  }

  if (typeof onStatusChange === 'function') {
    onStatusChange({
      status: 'completed',
      progress: 100,
      message: `Video file (${filename}) saved to your local Downloads folder.`
    });
  }

  return {
    success: true,
    filename,
    url: effectiveUrl,
    blob: downloadedBlob,
    blobUrl,
    downloadedViaBlob,
    size: downloadedBlob.size
  };
}

export const downloadVideoFile = triggerBrowserDownload;
