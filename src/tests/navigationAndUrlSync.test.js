import { describe, it, expect } from 'vitest';
import { getStreamUrl, getTrailerUrl } from '../services/streamServers.js';

describe('Deep Linking & URL Parameter Logic', () => {
  it('correctly constructs stream URLs for query parameter combinations', () => {
    // TV deep link: ?type=tv&id=1396&s=2&e=5&server=server6
    const tvUrl = getStreamUrl({
      serverId: 'server6',
      type: 'tv',
      id: '1396',
      season: '2',
      episode: '5'
    });
    expect(tvUrl).toBe('https://screenscape.me/embed?tmdb=1396&type=tv&s=2&e=5');

    // Movie deep link: ?type=movie&id=872585&server=server1
    const movieUrl = getStreamUrl({
      serverId: 'server1',
      type: 'movie',
      id: '872585'
    });
    expect(movieUrl).toBe('https://vixsrc.to/movie/872585');

    // Anime deep link: ?type=anime&id=16498&ep=3&lang=dub
    const animeUrl = getStreamUrl({
      type: 'anime',
      id: '16498',
      episode: '3',
      language: 'dub'
    });
    expect(animeUrl).toBe('https://megaplay.buzz/stream/ani/16498/3/dub');
  });

  it('correctly extracts trailer keys from varied formats', () => {
    // Plain key
    expect(getTrailerUrl('uYPbbksJxIg')).toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    // Full watch URL
    expect(getTrailerUrl('https://www.youtube.com/watch?v=uYPbbksJxIg&feature=emb_title')).toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    // Short URL
    expect(getTrailerUrl('https://youtu.be/uYPbbksJxIg?t=4')).toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    // Embed URL
    expect(getTrailerUrl('https://www.youtube.com/embed/uYPbbksJxIg')).toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
    // Key with tracking params
    expect(getTrailerUrl('uYPbbksJxIg?si=xyz123')).toBe('https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1');
  });

  it('handles TV series with large episode/season numbers safely', () => {
    const stream = getStreamUrl({
      serverId: 'server5',
      type: 'tv',
      id: '66732',
      season: 4,
      episode: 9
    });
    expect(stream).toBe('https://moviesapi.to/tv/66732/4/9?autoplay=true');
  });

  it('handles anime switching across all 6 servers without server lock', () => {
    const servers = ['server1', 'server2', 'server3', 'server4', 'server5', 'server6'];
    const expectedHosts = [
      'https://vixsrc.to/tv/21/1/1000',
      'https://vidcore.net/tv/21/1/1000',
      'https://vidsrc.to/embed/tv/21/1/1000',
      'https://vidy.st/tv/21/1/1000',
      'https://moviesapi.to/tv/21/1/1000?autoplay=true',
      'https://screenscape.me/embed?tmdb=21&type=tv&s=1&e=1000'
    ];

    servers.forEach((srv, idx) => {
      const url = getStreamUrl({
        serverId: srv,
        type: 'anime',
        id: '21',
        season: 1,
        episode: 1000
      });
      expect(url).toBe(expectedHosts[idx]);
    });
  });
});
