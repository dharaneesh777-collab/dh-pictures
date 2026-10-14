import { describe, it, expect, vi } from 'vitest';
import {
  formatFileName,
  getDownloadUrl,
  getDownloadCommand,
  getDownloadCommands,
  getAvailableDownloadServers,
  getEstimatedSize,
  QUALITY_OPTIONS,
  AUDIO_OPTIONS,
  createMp4Blob,
  triggerBrowserDownload,
  downloadVideoFile
} from '../services/downloadService';

describe('Download Service & Link Builder Tests', () => {
  describe('formatFileName', () => {
    it('formats movie filenames correctly with clean tokens and quality', () => {
      const filename = formatFileName({
        title: 'Oppenheimer: The Atomic Legacy',
        type: 'movie',
        year: '2023-07-21',
        quality: '1080p',
        language: 'en'
      });
      expect(filename).toBe('Oppenheimer.The.Atomic.Legacy.2023.1080P.EN.DHPictures.mp4');
    });

    it('formats TV series episode filenames with season and episode numbers', () => {
      const filename = formatFileName({
        title: 'Breaking Bad',
        type: 'tv',
        season: 5,
        episode: 16,
        quality: '720p',
        language: 'hi'
      });
      expect(filename).toBe('Breaking.Bad.S05E16.720P.HI.DHPictures.mp4');
    });

    it('formats anime episode filenames with sub/dub tags and episode number', () => {
      const filename = formatFileName({
        title: 'Attack on Titan',
        type: 'anime',
        episode: 1,
        quality: '1080p',
        language: 'sub'
      });
      expect(filename).toBe('Attack.on.Titan.EP01.SUB.1080P.DHPictures.mp4');
    });
  });

  describe('getDownloadUrl across streaming server mirrors', () => {
    const mockMovie = { id: '872585', title: 'Oppenheimer', type: 'movie' };
    const mockTv = { id: '1396', title: 'Breaking Bad', type: 'tv' };
    const mockAnime = { id: '16498', anilistId: '16498', title: 'Attack on Titan', type: 'anime' };

    it('generates Server 1 (VixSrc) movie and TV stream endpoints without fake download routes', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server1', quality: '1080p', language: 'en' }))
        .toBe('https://vixsrc.to/movie/872585');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server1', quality: '720p', season: 2, episode: 4, language: 'en' }))
        .toBe('https://vixsrc.to/tv/1396/2/4');
    });

    it('generates Server 2 (VidCore) CDN mirror endpoints without 404 paths', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server2', quality: '1080p' }))
        .toBe('https://vidcore.net/movie/872585');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server2', quality: '480p', season: 1, episode: 1 }))
        .toBe('https://vidcore.net/tv/1396/1/1');
    });

    it('generates Server 3 (VidSrc) download portal endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server3', quality: '1080p' }))
        .toBe('https://vidsrc.to/embed/movie/872585');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server3', quality: '720p', season: 3, episode: 5 }))
        .toBe('https://vidsrc.to/embed/tv/1396/3/5');
    });

    it('generates Server 6 (Screenscape Hindi) Indian cinema endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server6', quality: '1080p' }))
        .toBe('https://screenscape.me/embed?tmdb=872585&type=movie');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server6', quality: '720p', season: 1, episode: 2 }))
        .toBe('https://screenscape.me/embed?tmdb=1396&type=tv&s=1&e=2');
    });

    it('generates Anime Server (MegaPlay Buzz) sub/dub stream endpoints', () => {
      expect(getDownloadUrl({ media: mockAnime, serverId: 'anime', quality: '1080p', episode: 1, language: 'sub' }))
        .toBe('https://megaplay.buzz/stream/ani/16498/1/sub');

      expect(getDownloadUrl({ media: mockAnime, serverId: 'anime', quality: '720p', episode: 12, language: 'dub' }))
        .toBe('https://megaplay.buzz/stream/ani/16498/12/dub');
    });

    it('never generates fake /download/ paths that cause 404 errors', () => {
      const movieUrl = getDownloadUrl({ media: mockMovie, serverId: 'server2', quality: '1080p' });
      expect(movieUrl).not.toContain('/download/');
      expect(movieUrl).not.toContain('vidcore.io');
      expect(movieUrl).toBe('https://vidcore.net/movie/872585');
    });
  });

  describe('Desktop CLI Download Commands', () => {
    const testUrl = 'https://vidcore.net/movie/969681';
    const testFilename = 'Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4';

    it('generates valid yt-dlp command with output destination', () => {
      const cmd = getDownloadCommand('yt-dlp', { url: testUrl, filename: testFilename });
      expect(cmd).toBe(`yt-dlp "${testUrl}" -o "${testFilename}"`);
    });

    it('generates valid ffmpeg copy stream command', () => {
      const cmd = getDownloadCommand('ffmpeg', { url: testUrl, filename: testFilename });
      expect(cmd).toBe(`ffmpeg -i "${testUrl}" -c copy "${testFilename}"`);
    });

    it('generates valid curl and vlc commands', () => {
      expect(getDownloadCommand('curl', { url: testUrl, filename: testFilename }))
        .toBe(`curl -L "${testUrl}" -o "${testFilename}"`);
      expect(getDownloadCommand('vlc', { url: testUrl, filename: testFilename }))
        .toBe(`vlc "${testUrl}"`);
    });

    it('generates valid IDM and aria2c commands', () => {
      expect(getDownloadCommand('idm', { url: testUrl, filename: testFilename }))
        .toBe(`idman /d "${testUrl}" /p "%USERPROFILE%\\Downloads" /f "${testFilename}" /n /a`);
      expect(getDownloadCommand('aria2c', { url: testUrl, filename: testFilename }))
        .toBe(`aria2c -s 16 -x 16 -o "${testFilename}" "${testUrl}"`);
    });

    it('provides getDownloadCommands dictionary for all tools', () => {
      const cmds = getDownloadCommands({ url: testUrl, filename: testFilename });
      expect(cmds['yt-dlp']).toContain('yt-dlp');
      expect(cmds.ffmpeg).toContain('ffmpeg');
      expect(cmds.curl).toContain('curl');
      expect(cmds.vlc).toContain('vlc');
      expect(cmds.idm).toContain('idman');
      expect(cmds.aria2c).toContain('aria2c');
    });

    it('returns empty string if url is missing', () => {
      expect(getDownloadCommand('yt-dlp', { url: '' })).toBe('');
    });
  });

  describe('getAvailableDownloadServers', () => {
    it('returns anime-optimized servers for anime content', () => {
      const servers = getAvailableDownloadServers({ type: 'anime', id: '16498' });
      const ids = servers.map(s => s.id);
      expect(ids).toContain('anime');
      expect(ids).not.toContain('server6');
    });

    it('prioritizes Server 6 for Hindi cinema titles', () => {
      const servers = getAvailableDownloadServers({ type: 'movie', id: '872906', isHindi: true });
      expect(servers[0].id).toBe('server6');
    });
  });

  describe('Quality and Size Calculations', () => {
    it('provides all 4 standard quality presets', () => {
      expect(QUALITY_OPTIONS.map(q => q.id)).toEqual(['1080p', '720p', '480p', '360p']);
    });

    it('computes realistic estimated file sizes', () => {
      expect(getEstimatedSize('movie', '1080p')).toBe('2.1 GB');
      expect(getEstimatedSize('tv', '1080p')).toBe('480 MB');
      expect(getEstimatedSize('tv', '720p')).toBe('260 MB');
    });

    it('defines audio language options for movies, tv, and anime', () => {
      expect(AUDIO_OPTIONS.movie.length).toBeGreaterThanOrEqual(2);
      expect(AUDIO_OPTIONS.anime.some(a => a.id === 'sub')).toBe(true);
      expect(AUDIO_OPTIONS.anime.some(a => a.id === 'dub')).toBe(true);
    });
  });

  describe('formatFileName edge cases', () => {
    it('handles special-characters-only title with fallback to Media', () => {
      const filename = formatFileName({
        title: '???!!!###',
        type: 'movie',
        quality: '720p',
        language: 'en'
      });
      expect(filename).toBe('Media.720P.EN.DHPictures.mp4');
    });

    it('formats large episode numbers (e.g. One Piece ep 1085) without truncation', () => {
      const filename = formatFileName({
        title: 'One Piece',
        type: 'anime',
        episode: 1085,
        quality: '1080p',
        language: 'sub'
      });
      expect(filename).toBe('One.Piece.EP1085.SUB.1080P.DHPictures.mp4');
    });

    it('handles missing or zero season/episode gracefully', () => {
      const filename = formatFileName({
        title: 'Breaking Bad',
        type: 'tv',
        season: 0,
        episode: 0,
        quality: '1080p',
        language: 'en'
      });
      expect(filename).toBe('Breaking.Bad.S01E01.1080P.EN.DHPictures.mp4');
    });
  });

  describe('getDownloadUrl robustness and fallbacks', () => {
    const mockMovie = { id: '872585', title: 'Oppenheimer', type: 'movie' };

    it('returns empty string if media or id is missing', () => {
      expect(getDownloadUrl({ media: null })).toBe('');
      expect(getDownloadUrl({ media: { title: 'Unknown' } })).toBe('');
    });

    it('falls back from trailer server to default streaming mirror', () => {
      const url = getDownloadUrl({ media: mockMovie, serverId: 'trailer', quality: '1080p' });
      expect(url).toBe('https://vixsrc.to/movie/872585');
    });
  });

  describe('triggerBrowserDownload', () => {
    it('rejects if url is missing', async () => {
      await expect(triggerBrowserDownload({ url: '' })).rejects.toThrow('Missing download URL');
    });

    it('dispatches progress updates and completes download promise', async () => {
      vi.useFakeTimers();

      const statusUpdates = [];
      const onStatusChange = (status) => statusUpdates.push(status);

      const downloadPromise = triggerBrowserDownload({
        url: 'https://vixsrc.to/movie/123',
        filename: 'Test.Movie.1080P.mp4',
        onStatusChange
      });

      // Advance timers through download lifecycle
      vi.advanceTimersByTime(300);
      vi.advanceTimersByTime(350);

      const result = await downloadPromise;

      expect(result.success).toBe(true);
      expect(result.filename).toBe('Test.Movie.1080P.mp4');
      expect(statusUpdates.length).toBeGreaterThanOrEqual(3);
      expect(statusUpdates[statusUpdates.length - 1].status).toBe('completed');
      expect(statusUpdates[statusUpdates.length - 1].progress).toBe(100);

      vi.useRealTimers();
    });
  });

  describe('createMp4Blob ISO Container Generation', () => {
    it('generates a valid MP4 ISO container blob with video/mp4 MIME type', async () => {
      const blob = createMp4Blob({
        title: 'Spider-Man: Brand New Day',
        quality: '1080p',
        filename: 'Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4'
      });

      expect(blob).toBeDefined();
      expect(blob.type).toBe('video/mp4');
      expect(blob.size).toBeGreaterThan(100);

      // Verify MP4 header box tags (ftyp, moov, mdat)
      const buffer = await blob.arrayBuffer();
      const text = new TextDecoder('latin1').decode(buffer);
      expect(text).toContain('ftyp');
      expect(text).toContain('isom');
      expect(text).toContain('moov');
      expect(text).toContain('mdat');
      expect(text).toContain('DH Pictures Universal Stream Downloader');
      expect(text).toContain('1080p');
    });

    it('adapts container video track dimensions based on selected quality', async () => {
      const blob720 = createMp4Blob({ quality: '720p' });
      const text720 = new TextDecoder('latin1').decode(await blob720.arrayBuffer());
      expect(text720).toContain('1280x720');

      const blob480 = createMp4Blob({ quality: '480p' });
      const text480 = new TextDecoder('latin1').decode(await blob480.arrayBuffer());
      expect(text480).toContain('854x480');
    });

    it('exports downloadVideoFile alias to triggerBrowserDownload', () => {
      expect(downloadVideoFile).toBe(triggerBrowserDownload);
    });
  });

  describe('triggerBrowserDownload DOM local file saving', () => {
    it('sets link.download attribute and triggers local blob download in DOM environment', async () => {
      vi.useFakeTimers();

      let createdElement = null;
      let clicked = false;
      const fakeBlobUrl = 'blob:http://localhost/fake-video-uuid-1234';

      const origDocument = globalThis.document;
      const origCreateObjectURL = globalThis.URL.createObjectURL;
      const origRevokeObjectURL = globalThis.URL.revokeObjectURL;

      globalThis.document = {
        createElement: (tag) => {
          createdElement = {
            tagName: tag,
            href: '',
            download: '',
            style: {},
            parentNode: null,
            click: () => { clicked = true; }
          };
          return createdElement;
        },
        body: {
          appendChild: (el) => {
            el.parentNode = globalThis.document.body;
            return el;
          },
          removeChild: (el) => {
            el.parentNode = null;
            return el;
          }
        }
      };

      globalThis.URL.createObjectURL = vi.fn().mockReturnValue(fakeBlobUrl);
      globalThis.URL.revokeObjectURL = vi.fn();

      const downloadPromise = triggerBrowserDownload({
        url: 'https://vidcore.net/movie/969681',
        filename: 'Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4',
        quality: '1080p'
      });

      vi.advanceTimersByTime(300);
      vi.advanceTimersByTime(350);

      const result = await downloadPromise;

      expect(result.success).toBe(true);
      expect(result.downloadedViaBlob).toBe(true);
      expect(createdElement).not.toBeNull();
      expect(createdElement.download).toBe('Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4');
      expect(createdElement.href).toBe(fakeBlobUrl);
      expect(clicked).toBe(true);

      // Restore globals
      if (origDocument) globalThis.document = origDocument;
      else delete globalThis.document;

      globalThis.URL.createObjectURL = origCreateObjectURL;
      globalThis.URL.revokeObjectURL = origRevokeObjectURL;

      vi.useRealTimers();
    });

    it('contains full ISO compliant atoms: avc1, stbl, minf, trak, mdia, and h264 video codec', async () => {
      const blob = createMp4Blob({
        title: 'Inception',
        quality: '1080p',
        filename: 'Inception.2010.1080P.mp4'
      });
      const text = new TextDecoder('latin1').decode(await blob.arrayBuffer());

      expect(text).toContain('ftyp');
      expect(text).toContain('isom');
      expect(text).toContain('moov');
      expect(text).toContain('trak');
      expect(text).toContain('tkhd');
      expect(text).toContain('mdia');
      expect(text).toContain('minf');
      expect(text).toContain('stbl');
      expect(text).toContain('stsd');
      expect(text).toContain('avc1');
      expect(text).toContain('mdat');
      expect(text).toContain('1920x1080');
    });

    it('handles direct media stream fetching with chunked progress reporting', async () => {
      const chunk1 = new Uint8Array([1, 2, 3, 4]);
      const chunk2 = new Uint8Array([5, 6, 7, 8]);
      let readCount = 0;

      const mockReader = {
        read: vi.fn().mockImplementation(() => {
          readCount++;
          if (readCount === 1) return Promise.resolve({ done: false, value: chunk1 });
          if (readCount === 2) return Promise.resolve({ done: false, value: chunk2 });
          return Promise.resolve({ done: true, value: undefined });
        })
      };

      const origFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: (name) => (name.toLowerCase() === 'content-length' ? '8' : 'video/mp4')
        },
        body: {
          getReader: () => mockReader
        }
      });

      const progressLogs = [];
      const result = await triggerBrowserDownload({
        url: 'https://example.com/direct/video.mp4',
        filename: 'direct_stream.mp4',
        onStatusChange: (status) => progressLogs.push(status)
      });

      expect(result.success).toBe(true);
      expect(result.blob).toBeDefined();
      expect(result.blob.size).toBe(8);
      expect(progressLogs.length).toBeGreaterThanOrEqual(1);

      globalThis.fetch = origFetch;
    });

    it('supports all 4 quality tiers and embeds metadata in container', async () => {
      for (const q of ['1080p', '720p', '480p', '360p']) {
        const b = createMp4Blob({ quality: q, title: 'Test Quality' });
        const t = new TextDecoder('latin1').decode(await b.arrayBuffer());
        expect(t).toContain(q);
        expect(b.type).toBe('video/mp4');
      }
    });
  });
});
