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
  isDirectMediaStream,
  createMp4Blob,
  triggerBrowserDownload,
  downloadVideoFile,
  copyTextToClipboard
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
      expect(cmds['yt-dlp']).toBe(`yt-dlp "${testUrl}" -o "${testFilename}"`);
      expect(cmds.ffmpeg).toBe(`ffmpeg -i "${testUrl}" -c copy "${testFilename}"`);
      expect(cmds.curl).toBe(`curl -L "${testUrl}" -o "${testFilename}"`);
      expect(cmds.vlc).toBe(`vlc "${testUrl}"`);
      expect(cmds.idm).toBe(`idman /d "${testUrl}" /p "%USERPROFILE%\\Downloads" /f "${testFilename}" /n /a`);
      expect(cmds.aria2c).toBe(`aria2c -s 16 -x 16 -o "${testFilename}" "${testUrl}"`);
    });

    it('ensures .mp4 extension when filename is provided without one', () => {
      const cmd = getDownloadCommand('yt-dlp', { url: testUrl, filename: 'Spider-Man' });
      expect(cmd).toBe(`yt-dlp "${testUrl}" -o "Spider-Man.mp4"`);
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

    it('preserves international Unicode titles across Hindi, Japanese, and accented European names', () => {
      const hindiMovie = formatFileName({
        title: 'Dangal: दंगल',
        type: 'movie',
        year: '2016',
        quality: '1080p',
        language: 'hi'
      });
      expect(hindiMovie).toBe('Dangal.दंगल.2016.1080P.HI.DHPictures.mp4');

      const animeTitle = formatFileName({
        title: '千と千尋の神隠し',
        type: 'anime',
        episode: 1,
        quality: '1080p',
        language: 'sub'
      });
      expect(animeTitle).toBe('千と千尋の神隠し.EP01.SUB.1080P.DHPictures.mp4');

      const frenchTitle = formatFileName({
        title: 'Le Fabuleux Destin d\'Amélie Poulain',
        type: 'movie',
        year: '2001',
        quality: '720p',
        language: 'en'
      });
      expect(frenchTitle).toBe('Le.Fabuleux.Destin.dAmélie.Poulain.2001.720P.EN.DHPictures.mp4');
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

  describe('isDirectMediaStream Stream Type Detection', () => {
    it('identifies direct media video files accurately', () => {
      expect(isDirectMediaStream('https://cdn.example.com/video.mp4')).toBe(true);
      expect(isDirectMediaStream('https://cdn.example.com/video.mkv?token=123')).toBe(true);
      expect(isDirectMediaStream('https://cdn.example.com/video.webm')).toBe(true);
      expect(isDirectMediaStream('blob:http://localhost/uuid-1234')).toBe(true);
      expect(isDirectMediaStream('data:video/mp4;base64,...')).toBe(true);
    });

    it('identifies third-party embed player URLs as non-direct streams', () => {
      expect(isDirectMediaStream('https://vixsrc.to/movie/872585')).toBe(false);
      expect(isDirectMediaStream('https://vidcore.net/tv/1396/1/1')).toBe(false);
      expect(isDirectMediaStream('https://vidsrc.to/embed/movie/872585')).toBe(false);
      expect(isDirectMediaStream('https://screenscape.me/embed?tmdb=872585&type=movie')).toBe(false);
      expect(isDirectMediaStream('https://megaplay.buzz/stream/ani/16498/1/sub')).toBe(false);
      expect(isDirectMediaStream('')).toBe(false);
      expect(isDirectMediaStream(null)).toBe(false);
    });
  });

  describe('triggerBrowserDownload', () => {
    it('rejects if url is missing', async () => {
      await expect(triggerBrowserDownload({ url: '' })).rejects.toThrow('Missing download URL');
    });

    it('handles direct media stream fetching with chunked progress reporting and real blob delivery', async () => {
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
      expect(result.size).toBe(8);
      expect(progressLogs.length).toBeGreaterThanOrEqual(1);

      globalThis.fetch = origFetch;
    });

    it('triggers DOM link download with real blob URL for direct stream media', async () => {
      let createdElement = null;
      let clicked = false;
      const fakeBlobUrl = 'blob:http://localhost/real-video-uuid-1234';

      const origDocument = globalThis.document;
      const origCreateObjectURL = globalThis.URL.createObjectURL;
      const origRevokeObjectURL = globalThis.URL.revokeObjectURL;
      const origFetch = globalThis.fetch;

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

      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([10, 20, 30]) })
          .mockResolvedValueOnce({ done: true, value: undefined })
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'video/mp4' },
        body: { getReader: () => mockReader }
      });

      const result = await triggerBrowserDownload({
        url: 'https://cdn.example.com/movies/spiderman.mp4',
        filename: 'Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4',
        quality: '1080p'
      });

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
      globalThis.fetch = origFetch;
    });

    it('rejects and never delivers synthetic 3 KB dummy files for embed stream servers (CORS restriction)', async () => {
      const statusLogs = [];
      const onStatusChange = (status) => statusLogs.push(status);

      await expect(
        triggerBrowserDownload({
          url: 'https://vixsrc.to/movie/969681',
          filename: 'Spider-Man.Brand.New.Day.2026.720P.EN.DHPictures.mp4',
          quality: '720p',
          onStatusChange
        })
      ).rejects.toThrow(/restricted by browser/i);

      // Check that status was marked as CORS restricted and no file was generated
      expect(statusLogs.some(s => s.status === 'cors_restricted')).toBe(true);
    });

    it('provides desktop CLI download commands in rejection error for embed servers', async () => {
      try {
        await triggerBrowserDownload({
          url: 'https://vidcore.net/movie/969681',
          filename: 'Spider-Man.Brand.New.Day.2026.1080P.EN.DHPictures.mp4'
        });
        expect.unreachable('Should have rejected with CORS restriction');
      } catch (err) {
        expect(err.code).toBe('CORS_RESTRICTED');
        expect(err.isEmbedServer).toBe(true);
        expect(err.commands).toBeDefined();
        expect(err.commands['yt-dlp']).toContain('yt-dlp "https://vidcore.net/movie/969681"');
        expect(err.commands.idm).toContain('idman /d "https://vidcore.net/movie/969681"');
        expect(err.commands.aria2c).toContain('aria2c -s 16 -x 16');
        expect(err.commands.ffmpeg).toContain('ffmpeg -i "https://vidcore.net/movie/969681"');
        expect(err.commands.vlc).toContain('vlc "https://vidcore.net/movie/969681"');
      }
    });

    it('wraps direct stream fetch network/CORS failure into CORS_RESTRICTED with CLI commands', async () => {
      const origFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      try {
        await triggerBrowserDownload({
          url: 'https://cdn.example.com/protected/video.mp4',
          filename: 'ProtectedVideo.1080P.EN.DHPictures.mp4'
        });
        expect.unreachable('Should have thrown CORS_RESTRICTED');
      } catch (err) {
        expect(err.code).toBe('CORS_RESTRICTED');
        expect(err.commands).toBeDefined();
        expect(err.commands['yt-dlp']).toContain('yt-dlp "https://cdn.example.com/protected/video.mp4"');
      } finally {
        globalThis.fetch = origFetch;
      }
    });

    it('rejects and prevents saving when direct URL returns text/html error page', async () => {
      const origFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: (name) => (name.toLowerCase() === 'content-type' ? 'text/html; charset=utf-8' : null)
        }
      });

      await expect(
        triggerBrowserDownload({
          url: 'https://cdn.example.com/direct/video.mp4',
          filename: 'video.mp4'
        })
      ).rejects.toThrow(/Received non-video text\/HTML response/i);

      globalThis.fetch = origFetch;
    });

    it('reports progress in MB during chunked streaming even when Content-Length is missing', async () => {
      const chunk = new Uint8Array(1024 * 1024); // 1 MB
      let readCount = 0;
      const mockReader = {
        read: vi.fn().mockImplementation(() => {
          readCount++;
          if (readCount === 1) return Promise.resolve({ done: false, value: chunk });
          return Promise.resolve({ done: true, value: undefined });
        })
      };

      const origFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
          get: (name) => (name.toLowerCase() === 'content-type' ? 'video/mp4' : null)
        },
        body: { getReader: () => mockReader }
      });

      const logs = [];
      const res = await triggerBrowserDownload({
        url: 'https://cdn.example.com/stream.mp4',
        filename: 'chunked.mp4',
        onStatusChange: (s) => logs.push(s)
      });

      expect(res.success).toBe(true);
      expect(logs.some(l => l.status === 'downloading' && l.message.includes('1.0 MB'))).toBe(true);

      globalThis.fetch = origFetch;
    });
  });

  describe('Synthetic 3 KB Dummy File Prevention', () => {
    it('disallows createMp4Blob synthetic generation and throws explicit error', () => {
      expect(() => createMp4Blob()).toThrow(/Synthetic placeholder MP4 generation has been permanently removed/i);
    });

    it('exports downloadVideoFile alias to triggerBrowserDownload', () => {
      expect(downloadVideoFile).toBe(triggerBrowserDownload);
    });
  });

  describe('copyTextToClipboard Utility', () => {
    it('returns false for empty or null text', async () => {
      expect(await copyTextToClipboard('')).toBe(false);
      expect(await copyTextToClipboard(null)).toBe(false);
    });

    it('uses navigator.clipboard.writeText when available', async () => {
      const origClipboard = globalThis.navigator?.clipboard;
      let writtenText = '';

      if (!globalThis.navigator) {
        globalThis.navigator = {};
      }
      globalThis.navigator.clipboard = {
        writeText: vi.fn().mockImplementation(async (text) => {
          writtenText = text;
        })
      };

      const result = await copyTextToClipboard('yt-dlp test command');
      expect(result).toBe(true);
      expect(writtenText).toBe('yt-dlp test command');

      if (origClipboard) {
        globalThis.navigator.clipboard = origClipboard;
      } else {
        delete globalThis.navigator.clipboard;
      }
    });

    it('falls back to document.execCommand when navigator.clipboard is unavailable', async () => {
      const origClipboard = globalThis.navigator?.clipboard;
      if (globalThis.navigator) {
        delete globalThis.navigator.clipboard;
      }

      let execCommandCalled = false;
      const origDocument = globalThis.document;
      globalThis.document = {
        createElement: () => ({
          value: '',
          style: {},
          setAttribute: vi.fn(),
          focus: vi.fn(),
          select: vi.fn(),
          parentNode: { removeChild: vi.fn() }
        }),
        body: {
          appendChild: vi.fn()
        },
        execCommand: (cmd) => {
          if (cmd === 'copy') {
            execCommandCalled = true;
            return true;
          }
          return false;
        }
      };

      const result = await copyTextToClipboard('fallback test');
      expect(result).toBe(true);
      expect(execCommandCalled).toBe(true);

      if (origClipboard) globalThis.navigator.clipboard = origClipboard;
      if (origDocument) globalThis.document = origDocument;
      else delete globalThis.document;
    });
  });
});
