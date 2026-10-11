/**
 * TMDB API Service
 * Handles live TMDB search when an API key is configured,
 * and provides fallbacks to curated datasets.
 */

import { CURATED_MOVIES, TV_SHOWS, HINDI_CINEMA, ANIME_CATALOG, RECOMMENDED_TITLES } from './catalogData';

export async function searchTMDB(query, apiKey = '') {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.toLowerCase().trim();

  // If user provided a TMDB API key, fetch real-time from TMDB
  if (apiKey && apiKey.trim()) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${encodeURIComponent(apiKey.trim())}&query=${encodeURIComponent(cleanQuery)}&include_adult=false`
      );
      if (res.ok) {
        const data = await res.json();
        return (data.results || [])
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .map(item => ({
            id: String(item.id),
            type: item.media_type,
            title: item.title || item.name,
            year: (item.release_date || item.first_air_date || '').substring(0, 4),
            rating: item.vote_average ? item.vote_average.toFixed(1) : '7.5',
            genres: [],
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
            overview: item.overview || 'No synopsis provided.',
            trailerKey: null,
            totalSeasons: item.media_type === 'tv' ? 1 : undefined,
            seasons: item.media_type === 'tv' ? [{ seasonNumber: 1, episodesCount: 10 }] : undefined
          }));
      }
    } catch (e) {
      console.warn('TMDB API fetch failed, falling back to local database:', e);
    }
  }

  // Fallback to searching our curated catalog of Movies, TV, Hindi cinema, Anime and Recommended
  const allCurated = [...RECOMMENDED_TITLES, ...CURATED_MOVIES, ...TV_SHOWS, ...HINDI_CINEMA, ...ANIME_CATALOG];
  return allCurated.filter(item => 
    item.title.toLowerCase().includes(cleanQuery) ||
    item.genres.some(g => g.toLowerCase().includes(cleanQuery)) ||
    (item.overview && item.overview.toLowerCase().includes(cleanQuery))
  );
}
