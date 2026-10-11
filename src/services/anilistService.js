/**
 * AniList GraphQL API Integration
 * Free, public, zero-auth required API for searching anime and getting episode counts & covers
 */

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

const SEARCH_ANIME_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      bannerImage
      episodes
      genres
      averageScore
      seasonYear
      description(asHtml: false)
      trailer {
        id
        site
      }
    }
  }
}
`;

export async function searchAniList(searchQuery, page = 1, perPage = 12) {
  if (!searchQuery || !searchQuery.trim()) return [];

  try {
    const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: SEARCH_ANIME_QUERY,
        variables: {
          search: searchQuery.trim(),
          page,
          perPage
        }
      })
    });

    if (!response.ok) {
      console.warn('AniList API error status:', response.status);
      return [];
    }

    const data = await response.json();
    const mediaList = data?.data?.Page?.media || [];

    return mediaList.map(item => ({
      id: String(item.id),
      anilistId: String(item.id),
      type: 'anime',
      preferredServer: 'anime',
      title: item.title.english || item.title.romaji || item.title.native,
      year: item.seasonYear ? String(item.seasonYear) : 'Unknown',
      rating: item.averageScore ? (item.averageScore / 10).toFixed(1) : '8.0',
      genres: item.genres || [],
      episodesCount: item.episodes || 12,
      poster: item.coverImage?.large || item.coverImage?.medium,
      backdrop: item.bannerImage,
      trailerKey: item.trailer?.site === 'youtube' ? item.trailer.id : null,
      overview: item.description ? item.description.replace(/<[^>]*>?/gm, '') : 'No description available.',
      audioOptions: ['sub', 'dub']
    }));
  } catch (err) {
    console.error('Error querying AniList:', err);
    return [];
  }
}
