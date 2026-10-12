import { describe, it, expect, vi } from 'vitest';
import {
  formatFileName,
  getDownloadUrl,
  getAvailableDownloadServers,
  getEstimatedSize,
  QUALITY_OPTIONS,
  AUDIO_OPTIONS,
  triggerBrowserDownload
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

    it('generates Server 1 (VixSrc) movie and TV download endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server1', quality: '1080p', language: 'en' }))
        .toBe('https://vixsrc.to/download/movie/872585?quality=1080p&lang=en');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server1', quality: '720p', season: 2, episode: 4, language: 'en' }))
        .toBe('https://vixsrc.to/download/tv/1396/2/4?quality=720p&lang=en');
    });

    it('generates Server 2 (VidCore) CDN mirror endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server2', quality: '1080p' }))
        .toBe('https://vidcore.net/download/movie/872585?res=1080p');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server2', quality: '480p', season: 1, episode: 1 }))
        .toBe('https://vidcore.net/download/tv/1396/1/1?res=480p');
    });

    it('generates Server 3 (VidSrc) download portal endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server3', quality: '1080p' }))
        .toBe('https://vidsrc.to/embed/movie/872585?download=1&q=1080p');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server3', quality: '720p', season: 3, episode: 5 }))
        .toBe('https://vidsrc.to/embed/tv/1396/3/5?download=1&q=720p');
    });

    it('generates Server 6 (Screenscape Hindi) Indian cinema endpoints', () => {
      expect(getDownloadUrl({ media: mockMovie, serverId: 'server6', quality: '1080p' }))
        .toBe('https://screenscape.me/download?tmdb=872585&type=movie&res=1080p');

      expect(getDownloadUrl({ media: mockTv, serverId: 'server6', quality: '720p', season: 1, episode: 2 }))
        .toBe('https://screenscape.me/download?tmdb=1396&type=tv&s=1&e=2&res=720p');
    });

    it('generates Anime Server (MegaPlay Buzz) sub/dub download endpoints', () => {
      expect(getDownloadUrl({ media: mockAnime, serverId: 'anime', quality: '1080p', episode: 1, language: 'sub' }))
        .toBe('https://megaplay.buzz/download/ani/16498/1/sub?quality=1080p');

      expect(getDownloadUrl({ media: mockAnime, serverId: 'anime', quality: '720p', episode: 12, language: 'dub' }))
        .toBe('https://megaplay.buzz/download/ani/16498/12/dub?quality=720p');
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

  describe('triggerBrowserDownload', () => {
    it('dispatches progress updates and completes download promise', async () => {
      vi.useFakeTimers();

      const statusUpdates = [];
      const onStatusChange = (status) => statusUpdates.push(status);

      const downloadPromise = triggerBrowserDownload({
        url: 'https://vixsrc.to/download/movie/123?quality=1080p',
        filename: 'Test.Movie.1080P.mp4',
        onStatusChange
      });

      // Advance timers through download lifecycle
      vi.advanceTimersByTime(500);
      vi.advanceTimersByTime(500);
      vi.advanceTimersByTime(600);

      const result = await downloadPromise;

      expect(result.success).toBe(true);
      expect(result.filename).toBe('Test.Movie.1080P.mp4');
      expect(statusUpdates.length).toBeGreaterThanOrEqual(3);
      expect(statusUpdates[statusUpdates.length - 1].status).toBe('completed');
      expect(statusUpdates[statusUpdates.length - 1].progress).toBe(100);

      vi.useRealTimers();
    });
  });
});
