import { describe, it, expect } from 'vitest';
import { STREAM_SERVERS, getStreamUrl, getTrailerUrl } from '../services/streamServers.js';

describe('STREAM_SERVERS Configuration & Specification Conformance', () => {
  it('contains exactly the required 7 streaming servers', () => {
    const serverIds = STREAM_SERVERS.map(s => s.id);
    expect(serverIds).toContain('server1');
    expect(serverIds).toContain('server2');
    expect(serverIds).toContain('server3');
    expect(serverIds).toContain('server4');
    expect(serverIds).toContain('server5');
    expect(serverIds).toContain('server6');
    expect(serverIds).toContain('anime');
  });

  describe('Server 1: https://vixsrc.to/movie/${id} | https://vixsrc.to/tv/${id}/${season}/${episode}', () => {
    it('generates exact movie endpoint', () => {
      expect(getStreamUrl({ serverId: 'server1', type: 'movie', id: '12345' }))
        .toBe('https://vixsrc.to/movie/12345');
    });

    it('generates exact TV endpoint', () => {
      expect(getStreamUrl({ serverId: 'server1', type: 'tv', id: '987', season: 3, episode: 14 }))
        .toBe('https://vixsrc.to/tv/987/3/14');
    });
  });

  describe('Server 2: https://vidcore.net/movie/${id} | https://vidcore.net/tv/${id}/${season}/${episode}', () => {
    it('generates exact movie endpoint', () => {
      expect(getStreamUrl({ serverId: 'server2', type: 'movie', id: '550' }))
        .toBe('https://vidcore.net/movie/550');
    });

    it('generates exact TV endpoint', () => {
      expect(getStreamUrl({ serverId: 'server2', type: 'tv', id: '550', season: 1, episode: 1 }))
        .toBe('https://vidcore.net/tv/550/1/1');
    });
  });

  describe('Server 3: https://vidsrc.to/embed/movie/${id} | https://vidsrc.to/embed/tv/${id}/${season}/${episode}', () => {
    it('generates exact movie endpoint', () => {
      expect(getStreamUrl({ serverId: 'server3', type: 'movie', id: '872585' }))
        .toBe('https://vidsrc.to/embed/movie/872585');
    });

    it('generates exact TV endpoint', () => {
      expect(getStreamUrl({ serverId: 'server3', type: 'tv', id: '1396', season: 5, episode: 16 }))
        .toBe('https://vidsrc.to/embed/tv/1396/5/16');
    });
  });

  describe('Server 4: https://vidy.st/movie/${id} | https://vidy.st/tv/${id}/${season}/${episode}', () => {
    it('generates exact movie endpoint', () => {
      expect(getStreamUrl({ serverId: 'server4', type: 'movie', id: '693134' }))
        .toBe('https://vidy.st/movie/693134');
    });

    it('generates exact TV endpoint', () => {
      expect(getStreamUrl({ serverId: 'server4', type: 'tv', id: '100088', season: 1, episode: 9 }))
        .toBe('https://vidy.st/tv/100088/1/9');
    });
  });

  describe('Server 5: https://moviesapi.to/movie/${id}?autoplay=true | https://moviesapi.to/tv/${id}/${season}/${episode}?autoplay=true', () => {
    it('generates exact movie endpoint with autoplay=true', () => {
      expect(getStreamUrl({ serverId: 'server5', type: 'movie', id: '157336' }))
        .toBe('https://moviesapi.to/movie/157336?autoplay=true');
    });

    it('generates exact TV endpoint with autoplay=true', () => {
      expect(getStreamUrl({ serverId: 'server5', type: 'tv', id: '66732', season: 4, episode: 9 }))
        .toBe('https://moviesapi.to/tv/66732/4/9?autoplay=true');
    });
  });

  describe('Server 6 (Hindi): https://screenscape.me/embed?tmdb=${id}&type=movie | ...&type=tv&s=${season}&e=${episode}', () => {
    it('generates exact movie endpoint with tmdb and type=movie query parameters', () => {
      expect(getStreamUrl({ serverId: 'server6', type: 'movie', id: '872906' }))
        .toBe('https://screenscape.me/embed?tmdb=872906&type=movie');
    });

    it('generates exact TV endpoint with tmdb, type=tv, s and e parameters', () => {
      expect(getStreamUrl({ serverId: 'server6', type: 'tv', id: '1399', season: 8, episode: 6 }))
        .toBe('https://screenscape.me/embed?tmdb=1399&type=tv&s=8&e=6');
    });
  });

  describe('Anime Server: https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${language}', () => {
    it('generates sub stream with anilistId, episode, and sub', () => {
      expect(getStreamUrl({ serverId: 'anime', anilistId: '16498', episode: 1, language: 'sub' }))
        .toBe('https://megaplay.buzz/stream/ani/16498/1/sub');
    });

    it('generates dub stream with anilistId, episode, and dub', () => {
      expect(getStreamUrl({ serverId: 'anime', anilistId: '113415', episode: 24, language: 'dub' }))
        .toBe('https://megaplay.buzz/stream/ani/113415/24/dub');
    });

    it('supports type=anime with id fallback to anilistId', () => {
      expect(getStreamUrl({ type: 'anime', id: '101922', episode: 26, language: 'sub' }))
        .toBe('https://megaplay.buzz/stream/ani/101922/26/sub');
    });

    it('defaults language to sub if unexpected value passed', () => {
      expect(getStreamUrl({ serverId: 'anime', anilistId: '21', episode: 1000, language: 'spanish' }))
        .toBe('https://megaplay.buzz/stream/ani/21/1000/sub');
    });
  });

  describe('Trailers: https://www.youtube.com/embed/${trailerKey}?autoplay=1', () => {
    it('generates exact trailer embed URL with autoplay=1', () => {
      expect(getTrailerUrl('uYPbbksJxIg'))
        .toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    });

    it('extracts key from full youtube watch URL', () => {
      expect(getTrailerUrl('https://www.youtube.com/watch?v=Way9Dexny3w&t=10s'))
        .toBe('https://www.youtube.com/embed/Way9Dexny3w?autoplay=1');
    });

    it('extracts key from youtu.be short URL', () => {
      expect(getTrailerUrl('https://youtu.be/zSWdZVtXT7E?si=123'))
        .toBe('https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1');
    });

    it('returns empty string when key is falsy', () => {
      expect(getTrailerUrl('')).toBe('');
      expect(getTrailerUrl(null)).toBe('');
      expect(getTrailerUrl(undefined)).toBe('');
    });
  });

  describe('Edge cases & Robustness', () => {
    it('gracefully handles missing ID by returning empty string', () => {
      expect(getStreamUrl({ serverId: 'server1', id: '' })).toBe('');
      expect(getStreamUrl({ serverId: 'server6', id: null })).toBe('');
      expect(getStreamUrl({ serverId: 'anime', anilistId: undefined })).toBe('');
    });

    it('handles numeric string conversion for seasons and episodes', () => {
      expect(getStreamUrl({ serverId: 'server1', type: 'tv', id: '10', season: '4', episode: '12' }))
        .toBe('https://vixsrc.to/tv/10/4/12');
    });

    it('allows switching away from anime server to other servers like server1 and server6', () => {
      // Prior attempt had a bug where type === 'anime' locked all servers to Megaplay
      expect(getStreamUrl({ serverId: 'server1', type: 'anime', id: '16498', episode: 5 }))
        .toBe('https://vixsrc.to/tv/16498/1/5');
      expect(getStreamUrl({ serverId: 'server3', type: 'anime', id: '16498', episode: 10 }))
        .toBe('https://vidsrc.to/embed/tv/16498/1/10');
      expect(getStreamUrl({ serverId: 'server6', type: 'anime', id: '16498', episode: 2 }))
        .toBe('https://screenscape.me/embed?tmdb=16498&type=tv&s=1&e=2');
    });

    it('supports trailer server mode directly in getStreamUrl', () => {
      expect(getStreamUrl({ serverId: 'trailer', trailerKey: 'uYPbbksJxIg' }))
        .toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
      expect(getStreamUrl({ serverId: 'trailer', id: 'cqGjhVJWtEg' }))
        .toBe('https://www.youtube.com/embed/cqGjhVJWtEg?autoplay=1');
    });

    it('extracts trailer key from youtube.com/embed/ URLs and handles query parameters', () => {
      expect(getTrailerUrl('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1'))
        .toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
      expect(getTrailerUrl('uYPbbksJxIg?si=special_tracking_param'))
        .toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
      expect(getTrailerUrl('  uYPbbksJxIg  '))
        .toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    });

    it('trims whitespace on IDs and parameter values', () => {
      expect(getStreamUrl({ serverId: 'server1', type: 'movie', id: ' 872585 ' }))
        .toBe('https://vixsrc.to/movie/872585');
      expect(getStreamUrl({ serverId: 'anime', anilistId: ' 16498 ', episode: ' 3 ', language: 'sub' }))
        .toBe('https://megaplay.buzz/stream/ani/16498/3/sub');
    });
  });
});

