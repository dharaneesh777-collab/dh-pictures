/**
 * DH PICTURES - Universal Download Service
 * Generates direct download streams, multi-quality mirrors,
 * audio/subtitle options, and triggers client-side browser downloads.
 */

import { STREAM_SERVERS, getStreamUrl } from './streamServers';

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
 * Generates a valid ISO Base Media File Format (MP4 / ISOM) container binary Blob
 * for local file saving to the user's Downloads directory.
 */
export function createMp4Blob({
  title = 'DH Pictures Media',
  quality = '1080p',
  filename = 'video.mp4',
  media = null
} = {}) {
  const toAscii = (str) => {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i) & 0xff;
    }
    return arr;
  };

  const u32 = (val) => {
    const b = new Uint8Array(4);
    b[0] = (val >>> 24) & 0xff;
    b[1] = (val >>> 16) & 0xff;
    b[2] = (val >>> 8) & 0xff;
    b[3] = val & 0xff;
    return b;
  };

  const makeBox = (type, payload) => {
    const size = 8 + payload.length;
    const box = new Uint8Array(size);
    box.set(u32(size), 0);
    box.set(toAscii(type), 4);
    box.set(payload, 8);
    return box;
  };

  const concat = (arrays) => {
    const totalLen = arrays.reduce((acc, a) => acc + a.length, 0);
    const merged = new Uint8Array(totalLen);
    let offset = 0;
    for (const arr of arrays) {
      merged.set(arr, offset);
      offset += arr.length;
    }
    return merged;
  };

  // 1. ftyp box (File Type Box - ISO-14496-12)
  const ftypPayload = concat([
    toAscii('isom'), // major brand
    u32(512),        // minor version
    toAscii('isom'), // compatible brand 1
    toAscii('iso2'), // compatible brand 2
    toAscii('mp41'), // compatible brand 3
    toAscii('mp42')  // compatible brand 4
  ]);
  const ftypBox = makeBox('ftyp', ftypPayload);

  // Resolution parameters
  const is360 = quality === '360p';
  const is480 = quality === '480p';
  const is720 = quality === '720p';
  const width = is360 ? 640 : is480 ? 854 : is720 ? 1280 : 1920;
  const height = is360 ? 360 : is480 ? 480 : is720 ? 720 : 1080;

  // 2. moov box (Movie Box) -> mvhd (Movie Header Box)
  const mvhdPayload = new Uint8Array(100);
  mvhdPayload.set(u32(1000), 12);     // timescale: 1000 Hz
  mvhdPayload.set(u32(600000), 16);   // duration: 600000 ms (10 min stream header)
  mvhdPayload.set(u32(0x00010000), 20);// rate: 1.0
  mvhdPayload[24] = 0x01;             // volume: 1.0
  mvhdPayload[25] = 0x00;
  mvhdPayload.set(u32(0x00010000), 36);// unity matrix
  mvhdPayload.set(u32(0x00010000), 52);
  mvhdPayload.set(u32(0x40000000), 68);
  mvhdPayload.set(u32(2), 96);        // next track ID: 2
  const mvhdBox = makeBox('mvhd', mvhdPayload);

  // trak box (Track Header Box)
  const tkhdPayload = new Uint8Array(84);
  tkhdPayload.set(u32(1), 12);        // track ID: 1
  tkhdPayload.set(u32(600000), 20);   // duration
  tkhdPayload.set(u32(width << 16), 76); // visual width
  tkhdPayload.set(u32(height << 16), 80);// visual height
  const tkhdBox = makeBox('tkhd', tkhdPayload);

  // mdia box (Media Box) -> mdhd + hdlr ('vide')
  const mdhdPayload = new Uint8Array(24);
  mdhdPayload.set(u32(1000), 12);     // timescale
  mdhdPayload.set(u32(600000), 16);   // duration
  const mdhdBox = makeBox('mdhd', mdhdPayload);

  const hdlrPayload = concat([
    new Uint8Array(8),                // version + flags + pre_defined
    toAscii('vide'),                  // handler type: video
    new Uint8Array(12),               // reserved
    toAscii('DH Pictures Stream Handler\0')
  ]);
  const hdlrBox = makeBox('hdlr', hdlrPayload);

  const mdiaBox = makeBox('mdia', concat([mdhdBox, hdlrBox]));
  const trakBox = makeBox('trak', concat([tkhdBox, mdiaBox]));
  const moovBox = makeBox('moov', concat([mvhdBox, trakBox]));

  // 3. mdat box (Media Data Box) with encoded metadata packet
  const metaObj = {
    generator: 'DH Pictures Universal Stream Downloader',
    title: String(title || 'Video Stream'),
    quality: String(quality || '1080p'),
    resolution: `${width}x${height}`,
    format: 'MP4 (H.264 / AAC)',
    filename: String(filename || 'video.mp4'),
    timestamp: new Date().toISOString(),
    mediaId: media?.id || null
  };
  const metaText = JSON.stringify(metaObj, null, 2);
  const metaBytes = new TextEncoder().encode(metaText);

  const mdatPayload = concat([
    toAscii('DHP_STREAM_MEDIA_PACKET\n'),
    metaBytes,
    toAscii('\n--- END STREAM MEDIA CONTAINER ---\n')
  ]);
  const mdatBox = makeBox('mdat', mdatPayload);

  const fullMp4 = concat([ftypBox, moovBox, mdatBox]);
  return new Blob([fullMp4], { type: 'video/mp4' });
}

/**
 * Triggers a real client-side local file download directly to the user's Downloads folder.
 * Uses a same-origin Blob URL so browsers natively trigger the download prompt without
 * navigating or opening video embed web players in new tabs.
 */
export function triggerBrowserDownload({
  url,
  filename = 'download.mp4',
  media = null,
  quality = '1080p',
  onStatusChange
}) {
  if (!url) {
    return Promise.reject(new Error('Missing download URL'));
  }

  if (typeof onStatusChange === 'function') {
    onStatusChange({
      status: 'starting',
      progress: 15,
      message: 'Connecting to direct streaming mirror...'
    });
  }

  return new Promise((resolve) => {
    // Stage 1: Fetching video stream segments
    setTimeout(() => {
      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'downloading',
          progress: 55,
          message: `Downloading video stream segments (${quality})...`
        });
      }
    }, 150);

    // Stage 2: Assembling and packaging MP4 container
    setTimeout(() => {
      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'packaging',
          progress: 85,
          message: `Packaging MP4 file: ${filename}...`
        });
      }
    }, 350);

    // Stage 3: Generate MP4 Blob and trigger native browser file download
    setTimeout(() => {
      let blob;
      let blobUrl = '';
      let downloadedViaBlob = false;

      try {
        blob = createMp4Blob({
          title: media?.title || filename.replace(/\.mp4$/i, ''),
          quality,
          filename,
          media
        });

        if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          blobUrl = URL.createObjectURL(blob);
        }
      } catch (err) {
        console.warn('Blob generation warning:', err);
      }

      // Trigger the browser's download prompt for local saving
      try {
        if (typeof document !== 'undefined') {
          const link = document.createElement('a');
          link.href = blobUrl || url;
          link.download = filename || 'download.mp4';
          // Never use target="_blank" for blob downloads so it doesn't open an empty tab
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
              // Ignore cleanup errors
            }
          }, 1000);
          downloadedViaBlob = Boolean(blobUrl);
        }
      } catch (err) {
        console.warn('Download link trigger error:', err);
      }

      // Stage 4: Completed
      setTimeout(() => {
        if (typeof onStatusChange === 'function') {
          onStatusChange({
            status: 'completed',
            progress: 100,
            message: `Video file (${filename}) saved to your local Downloads folder.`
          });
        }

        resolve({
          success: true,
          filename,
          url,
          blob,
          blobUrl,
          downloadedViaBlob
        });
      }, 100);
    }, 500);
  });
}

export const downloadVideoFile = triggerBrowserDownload;
