import { describe, it, expect } from 'vitest';
import {
  STREAM_SERVERS,
  getAvailableServersForMedia,
  getNextAvailableServer,
  getServerById
} from '../services/streamServers.js';

describe('Server Failover & Dynamic Switching Architecture', () => {
  describe('getAvailableServersForMedia(media)', () => {
    it('returns valid servers (server1 - server6) for standard movies', () => {
      const media = { id: 101, title: 'Inception', type: 'movie' };
      const servers = getAvailableServersForMedia(media);

      expect(servers).toBeDefined();
      expect(servers.length).toBe(6);
      expect(servers.map(s => s.id)).toEqual([
        'server1',
        'server2',
        'server3',
        'server4',
        'server5',
        'server6'
      ]);
      expect(servers.every(s => s.supports.includes('movie'))).toBe(true);
      expect(servers.some(s => s.id === 'anime')).toBe(false);
    });

    it('returns MegaPlay Ani server first for anime type', () => {
      const animeMedia = { id: 202, title: 'Attack on Titan', type: 'anime' };
      const servers = getAvailableServersForMedia(animeMedia);

      expect(servers).toBeDefined();
      expect(servers.length).toBeGreaterThan(1);
      expect(servers[0].id).toBe('anime');
      expect(servers[0].shortName).toBe('MegaPlay Ani');
      // Subsequent servers should be fallback standard servers
      expect(servers.slice(1).map(s => s.id)).toEqual([
        'server1',
        'server2',
        'server3',
        'server4',
        'server5',
        'server6'
      ]);
    });

    it('returns Screenscape Hindi server first for Hindi titles when isHindi is true', () => {
      const hindiMedia = { id: 303, title: 'RRR', type: 'movie', isHindi: true };
      const servers = getAvailableServersForMedia(hindiMedia);

      expect(servers).toBeDefined();
      expect(servers.length).toBe(6);
      expect(servers[0].id).toBe('server6');
      expect(servers[0].shortName).toBe('Screenscape (Hindi)');
      expect(servers.slice(1).map(s => s.id)).toEqual([
        'server1',
        'server2',
        'server3',
        'server4',
        'server5'
      ]);
    });

    it('returns Screenscape Hindi server first when preferredServer is server6', () => {
      const hindiPrefMedia = { id: 404, title: 'Jawan', preferredServer: 'server6' };
      const servers = getAvailableServersForMedia(hindiPrefMedia);

      expect(servers).toBeDefined();
      expect(servers[0].id).toBe('server6');
      expect(servers.slice(1).map(s => s.id)).toEqual([
        'server1',
        'server2',
        'server3',
        'server4',
        'server5'
      ]);
    });

    it('handles missing or null/undefined media safely without crashing', () => {
      expect(() => getAvailableServersForMedia(null)).not.toThrow();
      expect(() => getAvailableServersForMedia(undefined)).not.toThrow();

      const nullServers = getAvailableServersForMedia(null);
      expect(Array.isArray(nullServers)).toBe(true);
      expect(nullServers.length).toBe(6);
      expect(nullServers[0].id).toBe('server1');
      expect(nullServers.some(s => s.id === 'anime')).toBe(false);

      const undefinedServers = getAvailableServersForMedia(undefined);
      expect(Array.isArray(undefinedServers)).toBe(true);
      expect(undefinedServers.length).toBe(6);
      expect(undefinedServers[0].id).toBe('server1');
    });

    it('handles TV series type appropriately', () => {
      const tvMedia = { id: 505, title: 'Breaking Bad', type: 'tv' };
      const servers = getAvailableServersForMedia(tvMedia);

      expect(servers.length).toBe(6);
      expect(servers.every(s => s.supports.includes('tv'))).toBe(true);
      expect(servers[0].id).toBe('server1');
    });
  });

  describe('getNextAvailableServer(currentServerId, media, failedServerIds)', () => {
    const movieMedia = { id: 606, type: 'movie' };

    it('follows standard movie progression sequence: server1 -> server2 -> server3 -> server4 -> server5 -> server6', () => {
      const nextFrom1 = getNextAvailableServer('server1', movieMedia, []);
      expect(nextFrom1?.id).toBe('server2');

      const nextFrom2 = getNextAvailableServer('server2', movieMedia, []);
      expect(nextFrom2?.id).toBe('server3');

      const nextFrom3 = getNextAvailableServer('server3', movieMedia, []);
      expect(nextFrom3?.id).toBe('server4');

      const nextFrom4 = getNextAvailableServer('server4', movieMedia, []);
      expect(nextFrom4?.id).toBe('server5');

      const nextFrom5 = getNextAvailableServer('server5', movieMedia, []);
      expect(nextFrom5?.id).toBe('server6');
    });

    it('cycles around when reaching the end of the server list (server6 -> server1)', () => {
      const nextFrom6 = getNextAvailableServer('server6', movieMedia, []);
      expect(nextFrom6).toBeDefined();
      expect(nextFrom6?.id).toBe('server1');
    });

    it('skips already failed servers (single failed server: server1 directly lands on server3 when server2 has failed)', () => {
      const next = getNextAvailableServer('server1', movieMedia, ['server2']);
      expect(next).toBeDefined();
      expect(next?.id).toBe('server3');
    });

    it('skips multiple already failed servers in sequence', () => {
      // server1 with failed server2 and server3 should jump to server4
      const next = getNextAvailableServer('server1', movieMedia, ['server2', 'server3']);
      expect(next).toBeDefined();
      expect(next?.id).toBe('server4');
    });

    it('handles failedServerIds passed as a Set as well as an Array', () => {
      const failedSet = new Set(['server2', 'server3', 'server4']);
      const next = getNextAvailableServer('server1', movieMedia, failedSet);
      expect(next).toBeDefined();
      expect(next?.id).toBe('server5');
    });

    it('cycles back to available servers after end of list when earlier ones are healthy', () => {
      // server5 failed, server6 failed, server1 already failed, but server2 is healthy
      const next = getNextAvailableServer('server5', movieMedia, ['server6', 'server1']);
      expect(next).toBeDefined();
      expect(next?.id).toBe('server2');
    });

    it('handles all servers being in failedServerIds gracefully by cycling to next in sequence', () => {
      const allFailed = ['server1', 'server2', 'server3', 'server4', 'server5', 'server6'];
      
      const fallbackFrom1 = getNextAvailableServer('server1', movieMedia, allFailed);
      expect(fallbackFrom1).toBeDefined();
      expect(fallbackFrom1?.id).toBe('server2');

      const fallbackFrom6 = getNextAvailableServer('server6', movieMedia, allFailed);
      expect(fallbackFrom6).toBeDefined();
      expect(fallbackFrom6?.id).toBe('server1');
    });

    it('works correctly for Anime media types (starting with anime, cycling through fallbacks and looping back)', () => {
      const animeMedia = { id: 707, type: 'anime' };

      // Normal next server from anime is server1
      const nextFromAnime = getNextAvailableServer('anime', animeMedia, []);
      expect(nextFromAnime?.id).toBe('server1');

      // Next from server1 is server2
      const nextFrom1 = getNextAvailableServer('server1', animeMedia, []);
      expect(nextFrom1?.id).toBe('server2');

      // End of list (server6) cycles back to anime server
      const nextFrom6 = getNextAvailableServer('server6', animeMedia, []);
      expect(nextFrom6?.id).toBe('anime');

      // If server1 failed, anime jumps to server2
      const nextWithFailed = getNextAvailableServer('anime', animeMedia, ['server1']);
      expect(nextWithFailed?.id).toBe('server2');
    });

    it('works correctly for Hindi media types (prioritizing server6, cycling to server1, looping back to server6)', () => {
      const hindiMedia = { id: 808, type: 'movie', isHindi: true };

      // Next server from preferred server6 is server1
      const nextFrom6 = getNextAvailableServer('server6', hindiMedia, []);
      expect(nextFrom6?.id).toBe('server1');

      // Next from server5 cycles back to server6
      const nextFrom5 = getNextAvailableServer('server5', hindiMedia, []);
      expect(nextFrom5?.id).toBe('server6');

      // If server1 has failed, jumping from server6 goes to server2
      const nextSkippingFailed = getNextAvailableServer('server6', hindiMedia, ['server1']);
      expect(nextSkippingFailed?.id).toBe('server2');
    });

    it('handles unknown or unlisted currentServerId by picking the first healthy candidate', () => {
      const next = getNextAvailableServer('unknown_server', movieMedia, ['server1']);
      expect(next).toBeDefined();
      expect(next?.id).toBe('server2');
    });
  });

  describe('getServerById(serverId)', () => {
    it('returns correct server object for standard servers (server1 to server6)', () => {
      const s1 = getServerById('server1');
      expect(s1).toBeDefined();
      expect(s1?.id).toBe('server1');
      expect(s1?.name).toContain('VixSrc');

      const s2 = getServerById('server2');
      expect(s2?.id).toBe('server2');
      expect(s2?.name).toContain('VidCore');

      const s3 = getServerById('server3');
      expect(s3?.id).toBe('server3');
      expect(s3?.name).toContain('VidSrc');

      const s4 = getServerById('server4');
      expect(s4?.id).toBe('server4');
      expect(s4?.name).toContain('Vidy');

      const s5 = getServerById('server5');
      expect(s5?.id).toBe('server5');
      expect(s5?.name).toContain('MoviesAPI');

      const s6 = getServerById('server6');
      expect(s6?.id).toBe('server6');
      expect(s6?.name).toContain('Screenscape');
    });

    it('returns correct server object for anime server', () => {
      const anime = getServerById('anime');
      expect(anime).toBeDefined();
      expect(anime?.id).toBe('anime');
      expect(anime?.name).toContain('MegaPlay');
      expect(anime?.supports).toContain('anime');
    });

    it('returns trailer pseudo-server for "trailer" with required properties', () => {
      const trailer = getServerById('trailer');
      expect(trailer).toBeDefined();
      expect(trailer?.id).toBe('trailer');
      expect(trailer?.name).toBe('Official Trailer (YouTube)');
      expect(trailer?.shortName).toBe('Trailer');
      expect(trailer?.tag).toBe('Trailer');
      expect(trailer?.badgeColor).toBe('#ef4444');
      expect(trailer?.description).toBe('Official YouTube Trailer');
    });

    it('returns default server (server1) when serverId is empty, null, or undefined', () => {
      expect(getServerById('')?.id).toBe('server1');
      expect(getServerById(null)?.id).toBe('server1');
      expect(getServerById(undefined)?.id).toBe('server1');
    });

    it('returns null safely for invalid or unrecognized server IDs', () => {
      expect(getServerById('invalid_server_id')).toBeNull();
      expect(getServerById('server99')).toBeNull();
      expect(getServerById('xyz_stream')).toBeNull();
    });
  });
});
