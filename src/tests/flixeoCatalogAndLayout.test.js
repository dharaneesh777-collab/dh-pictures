import { describe, it, expect } from 'vitest';
import { 
  FEATURED_HERO,
  RECOMMENDED_TITLES,
  TOP_5_DATA,
  CURATED_MOVIES, 
  TV_SHOWS, 
  HINDI_CINEMA, 
  ANIME_CATALOG 
} from '../services/catalogData.js';
import { getStreamUrl } from '../services/streamServers.js';

describe('Flixeo Artwork & Poster CDN Validation', () => {
  const allMediaItems = [
    FEATURED_HERO,
    ...RECOMMENDED_TITLES,
    ...TOP_5_DATA.day,
    ...TOP_5_DATA.week,
    ...TOP_5_DATA.month,
    ...CURATED_MOVIES,
    ...TV_SHOWS,
    ...HINDI_CINEMA,
    ...ANIME_CATALOG
  ];

  it('contains zero Unsplash placeholder images across all catalogs', () => {
    allMediaItems.forEach(item => {
      expect(item.poster).toBeDefined();
      expect(item.poster).not.toContain('unsplash.com');
      if (item.backdrop) {
        expect(item.backdrop).not.toContain('unsplash.com');
      }
    });
  });

  it('uses official TMDB or AniList CDN for all posters', () => {
    allMediaItems.forEach(item => {
      const isTmdb = item.poster.startsWith('https://image.tmdb.org/t/p/');
      const isAniList = item.poster.startsWith('https://s4.anilist.co/');
      expect(isTmdb || isAniList).toBe(true);
    });
  });

  it('includes all 6 exact titles from Flixeo reference screenshot in RECOMMENDED_TITLES', () => {
    const titles = RECOMMENDED_TITLES.map(m => m.title);
    expect(titles).toContain('Spider-Man: Brand New Day');
    expect(titles).toContain('Resident Evil');
    expect(titles).toContain('Insidious: Out of the Further');
    expect(titles).toContain('The Odyssey');
    expect(titles).toContain('The Fix');
    expect(titles).toContain('Runner');
  });

  it('includes exact TOP 5 day ranking titles matching Flixeo screenshot', () => {
    expect(TOP_5_DATA.day).toHaveLength(5);
    const dayTitles = TOP_5_DATA.day.map(t => t.title);
    expect(dayTitles[0]).toBe('LINK CLICK');
    expect(dayTitles[1]).toBe('Animals');
    expect(dayTitles[2]).toBe('Matchbox the Movie');
    expect(dayTitles[3]).toBe('Carrie');
    expect(dayTitles[4]).toBe('Spider-Man: Brand New Day');
  });

  it('provides week and month timeframes in TOP 5 with 5 items each', () => {
    expect(TOP_5_DATA.week).toHaveLength(5);
    expect(TOP_5_DATA.month).toHaveLength(5);
  });

  it('Bollywood titles use authentic TMDB artwork and correct IDs', () => {
    const kalki = HINDI_CINEMA.find(m => m.title === 'Kalki 2898 AD');
    const stree2 = HINDI_CINEMA.find(m => m.title === 'Stree 2');
    const jawan = HINDI_CINEMA.find(m => m.title === 'Jawan');

    expect(kalki.id).toBe('801688');
    expect(kalki.poster).toContain('rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg');

    expect(stree2.id).toBe('1112426');
    expect(stree2.poster).toContain('nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg');

    expect(jawan.id).toBe('872906');
    expect(jawan.poster).toContain('jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg');
    expect(jawan.backdrop).toContain('s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg');
  });

  it('Popular TV series use verified TMDB posters and valid backdrops', () => {
    const tlou = TV_SHOWS.find(m => m.title === 'The Last of Us');
    const theBoys = TV_SHOWS.find(m => m.title === 'The Boys');

    expect(tlou.poster).toBe('https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg');
    expect(theBoys.poster).toBe('https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg');

    const dune = CURATED_MOVIES.find(m => m.title === 'Dune: Part Two');
    expect(dune.backdrop).toBe('https://image.tmdb.org/t/p/original/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg');
  });

  it('all 8 streaming servers generate valid URLs for Flixeo items', () => {
    const spiderman = RECOMMENDED_TITLES[0];
    const linkClick = TOP_5_DATA.day[0];

    // Movie across Server 1-6
    expect(getStreamUrl({ serverId: 'server1', type: 'movie', id: spiderman.id }))
      .toBe(`https://vixsrc.to/movie/${spiderman.id}`);
    expect(getStreamUrl({ serverId: 'server2', type: 'movie', id: spiderman.id }))
      .toBe(`https://vidcore.net/movie/${spiderman.id}`);
    expect(getStreamUrl({ serverId: 'server3', type: 'movie', id: spiderman.id }))
      .toBe(`https://vidsrc.to/embed/movie/${spiderman.id}`);
    expect(getStreamUrl({ serverId: 'server4', type: 'movie', id: spiderman.id }))
      .toBe(`https://vidy.st/movie/${spiderman.id}`);
    expect(getStreamUrl({ serverId: 'server5', type: 'movie', id: spiderman.id }))
      .toBe(`https://moviesapi.to/movie/${spiderman.id}?autoplay=true`);
    expect(getStreamUrl({ serverId: 'server6', type: 'movie', id: spiderman.id }))
      .toBe(`https://screenscape.me/embed?tmdb=${spiderman.id}&type=movie`);

    // Anime / Megaplay server
    expect(getStreamUrl({ serverId: 'anime', anilistId: linkClick.anilistId, episode: 1, language: 'sub' }))
      .toBe(`https://megaplay.buzz/stream/ani/${linkClick.anilistId}/1/sub`);
    expect(getStreamUrl({ serverId: 'anime', anilistId: linkClick.anilistId, episode: 1, language: 'dub' }))
      .toBe(`https://megaplay.buzz/stream/ani/${linkClick.anilistId}/1/dub`);
  });
});
