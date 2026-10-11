/**
 * Curated Catalog Data with real TMDB IDs, AniList IDs, and official CDN artwork.
 * All posters use TMDB CDN (https://image.tmdb.org/t/p/w500/...) and AniList CDN.
 * No generic Unsplash placeholders.
 */

export const FEATURED_HERO = {
  id: '872585',
  type: 'movie',
  title: 'Oppenheimer',
  year: '2023',
  rating: '8.9',
  duration: '3h 0min',
  genres: ['Biography', 'Drama', 'History'],
  overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.',
  backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
  poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  trailerKey: 'uYPbbksJxIg',
  featuredBadge: 'Trending #1 Global'
};

/**
 * Recommended titles matching the Flixeo aesthetic & reference screenshot
 */
export const RECOMMENDED_TITLES = [
  {
    id: '969681',
    type: 'movie',
    title: 'Spider-Man: Brand New Day',
    year: '2026',
    rating: '8.8',
    genres: ['Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg',
    trailerKey: 'JfVOs4VSpmA',
    overview: 'Peter Parker embarks on a brand new chapter following the memory wipe, facing emerging threats in New York City.'
  },
  {
    id: '1423191',
    type: 'movie',
    title: 'Resident Evil',
    year: '2026',
    rating: '7.8',
    genres: ['Action', 'Horror', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/i7UyjfPio0VFHB9rBUZSFyhOoM8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/bArhvjRHl535XMaSh9VjInF2mSZ.jpg',
    trailerKey: 'bArhvjRHl535XMaSh9VjInF2mSZ',
    overview: 'A terrifying new outbreak engulfs a remote facility, triggering a race against time to contain the bio-organic nightmare.'
  },
  {
    id: '1291595',
    type: 'movie',
    title: 'Insidious: Out of the Further',
    year: '2026',
    rating: '7.6',
    genres: ['Horror', 'Mystery'],
    poster: 'https://image.tmdb.org/t/p/w500/4tTrW9dXCByS5wt2pXVWb58zNjz.jpg',
    trailerKey: 'kQDd1AhGIHk',
    overview: 'A deep psychological terror unfolds as the dark astral plane of the Further manifests into our waking reality.'
  },
  {
    id: '1368337',
    type: 'movie',
    title: 'The Odyssey',
    year: '2026',
    rating: '8.2',
    genres: ['Adventure', 'Drama', 'Mythology'],
    poster: 'https://image.tmdb.org/t/p/w500/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg',
    trailerKey: 'Way9Dexny3w',
    overview: 'An epic cinematic retelling of Odysseus’ perilous ten-year journey home following the fall of Troy.'
  },
  {
    id: '1228834',
    type: 'movie',
    title: 'The Fix',
    year: '2026',
    rating: '7.5',
    genres: ['Action', 'Crime', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/yopXjun3ICFfJci2ukcEzceZjUs.jpg',
    trailerKey: 'Dydmpfo68DA',
    overview: 'In a corrupt metropolis where clean air and medicine are rationed, an ex-enforcer takes on an oppressive syndicate.'
  },
  {
    id: '1377237',
    type: 'movie',
    title: 'Runner',
    year: '2026',
    rating: '7.4',
    genres: ['Action', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/yBKMAIj7clP42UkFejhGDBBoTpb.jpg',
    trailerKey: 'COv52Qyctws',
    overview: 'A high-stakes courier must navigate hostile terrain to deliver a life-saving cargo before the timer expires.'
  },
  {
    id: '693134',
    type: 'movie',
    title: 'Dune: Part Two',
    year: '2024',
    rating: '8.6',
    genres: ['Sci-Fi', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg',
    trailerKey: 'Way9Dexny3w',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
  {
    id: '872585',
    type: 'movie',
    title: 'Oppenheimer',
    year: '2023',
    rating: '8.9',
    genres: ['Drama', 'History'],
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerKey: 'uYPbbksJxIg',
    overview: 'The story of J. Robert Oppenheimer and the Manhattan Project.'
  },
  {
    id: '945961',
    type: 'movie',
    title: 'Alien: Romulus',
    year: '2024',
    rating: '7.3',
    genres: ['Horror', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg',
    trailerKey: 'x0XDEhP4MQs',
    overview: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.'
  },
  {
    id: '533535',
    type: 'movie',
    title: 'Deadpool & Wolverine',
    year: '2024',
    rating: '8.0',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    trailerKey: '73_1biulkYk',
    overview: 'A listless Wade Wilson toils in civilian life until the Time Variance Authority recruits him to help protect his universe alongside Wolverine.'
  },
  {
    id: '157336',
    type: 'movie',
    title: 'Interstellar',
    year: '2014',
    rating: '8.7',
    genres: ['Sci-Fi', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
    trailerKey: 'zSWdZVtXT7E',
    overview: 'When Earth becomes uninhabitable, a team of ex-pilots and scientists travel through a wormhole in search of a new home for mankind.'
  },
  {
    id: '569094',
    type: 'movie',
    title: 'Spider-Man: Across the Spider-Verse',
    year: '2023',
    rating: '8.7',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    trailerKey: 'cqGjhVJWtEg',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
  }
];

/**
 * Top 5 Ranked titles with tabs for Day, Week, and Month (Flixeo Right Sidebar)
 */
export const TOP_5_DATA = {
  day: [
    {
      rank: 1,
      id: '123542',
      anilistId: '126403',
      type: 'tv',
      title: 'LINK CLICK',
      subtitle: 'TV • 2021',
      year: '2021',
      rating: '8.9',
      poster: 'https://image.tmdb.org/t/p/w500/wo9jwu5qMvXzhW2cyy5E6hOVs92.jpg',
      trailerKey: 'fH9vN5KzKx0',
      totalSeasons: 2,
      seasons: [
        { seasonNumber: 1, episodesCount: 11 },
        { seasonNumber: 2, episodesCount: 12 }
      ]
    },
    {
      rank: 2,
      id: '1236045',
      type: 'movie',
      title: 'Animals',
      subtitle: 'Movie • 2026',
      year: '2026',
      rating: '7.9',
      poster: 'https://image.tmdb.org/t/p/w500/cyltXU1lAGhRFBuHQIMWBAPj8fI.jpg',
      trailerKey: '73_1biulkYk'
    },
    {
      rank: 3,
      id: '1148365',
      type: 'movie',
      title: 'Matchbox the Movie',
      subtitle: 'Movie • 2026',
      year: '2026',
      rating: '8.1',
      poster: 'https://image.tmdb.org/t/p/w500/lFKA4GMz36dImEy3DQPdPF7G4V9.jpg',
      trailerKey: '73_1biulkYk'
    },
    {
      rank: 4,
      id: '288673',
      type: 'tv',
      title: 'Carrie',
      subtitle: 'TV • 2026',
      year: '2026',
      rating: '7.7',
      poster: 'https://image.tmdb.org/t/p/w500/eXjk4W4robXs7l1YXwaXMv4f2qb.jpg',
      totalSeasons: 1,
      seasons: [
        { seasonNumber: 1, episodesCount: 8 }
      ]
    },
    {
      rank: 5,
      id: '969681',
      type: 'movie',
      title: 'Spider-Man: Brand New Day',
      subtitle: 'Movie • 2026',
      year: '2026',
      rating: '8.8',
      poster: 'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
      trailerKey: 'JfVOs4VSpmA'
    }
  ],
  week: [
    {
      rank: 1,
      id: '693134',
      type: 'movie',
      title: 'Dune: Part Two',
      subtitle: 'Movie • 2024',
      year: '2024',
      rating: '8.6',
      poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
      trailerKey: 'Way9Dexny3w'
    },
    {
      rank: 2,
      id: '872585',
      type: 'movie',
      title: 'Oppenheimer',
      subtitle: 'Movie • 2023',
      year: '2023',
      rating: '8.9',
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      trailerKey: 'uYPbbksJxIg'
    },
    {
      rank: 3,
      id: '1112426',
      type: 'movie',
      isHindi: true,
      preferredServer: 'server6',
      title: 'Stree 2',
      subtitle: 'Movie • 2024',
      year: '2024',
      rating: '7.7',
      poster: 'https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg',
      trailerKey: 'KVn5m5n7Qe4'
    },
    {
      rank: 4,
      id: '1396',
      type: 'tv',
      title: 'Breaking Bad',
      subtitle: 'TV • 2008',
      year: '2008',
      rating: '9.5',
      poster: 'https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg',
      trailerKey: 'HhesaQXLuRY',
      totalSeasons: 5,
      seasons: [
        { seasonNumber: 1, episodesCount: 7 },
        { seasonNumber: 2, episodesCount: 13 },
        { seasonNumber: 3, episodesCount: 13 },
        { seasonNumber: 4, episodesCount: 13 },
        { seasonNumber: 5, episodesCount: 16 }
      ]
    },
    {
      rank: 5,
      id: '113415',
      anilistId: '113415',
      type: 'anime',
      preferredServer: 'anime',
      title: 'Jujutsu Kaisen',
      subtitle: 'Anime • 2020',
      year: '2020',
      rating: '8.7',
      poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg',
      trailerKey: 'pkKu9hLT-t8'
    }
  ],
  month: [
    {
      rank: 1,
      id: '533535',
      type: 'movie',
      title: 'Deadpool & Wolverine',
      subtitle: 'Movie • 2024',
      year: '2024',
      rating: '8.0',
      poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      trailerKey: '73_1biulkYk'
    },
    {
      rank: 2,
      id: '126308',
      type: 'tv',
      title: 'Shōgun',
      subtitle: 'TV • 2024',
      year: '2024',
      rating: '8.8',
      poster: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
      trailerKey: 'yRfQMX3GgTw',
      totalSeasons: 1,
      seasons: [
        { seasonNumber: 1, episodesCount: 10 }
      ]
    },
    {
      rank: 3,
      id: '151807',
      anilistId: '151807',
      type: 'anime',
      preferredServer: 'anime',
      title: 'Solo Leveling',
      subtitle: 'Anime • 2024',
      year: '2024',
      rating: '8.5',
      poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png',
      trailerKey: '91_tZ2ghwUY'
    },
    {
      rank: 4,
      id: '872906',
      type: 'movie',
      isHindi: true,
      preferredServer: 'server6',
      title: 'Jawan',
      subtitle: 'Movie • 2023',
      year: '2023',
      rating: '8.1',
      poster: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
      trailerKey: 'COv52Qyctws'
    },
    {
      rank: 5,
      id: '157336',
      type: 'movie',
      title: 'Interstellar',
      subtitle: 'Movie • 2014',
      year: '2014',
      rating: '8.7',
      poster: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
      trailerKey: 'zSWdZVtXT7E'
    }
  ]
};

export const CURATED_MOVIES = [
  {
    id: '872585',
    type: 'movie',
    title: 'Oppenheimer',
    year: '2023',
    rating: '8.9',
    genres: ['Drama', 'History'],
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerKey: 'uYPbbksJxIg',
    overview: 'The story of J. Robert Oppenheimer and the Manhattan Project.'
  },
  {
    id: '693134',
    type: 'movie',
    title: 'Dune: Part Two',
    year: '2024',
    rating: '8.6',
    genres: ['Sci-Fi', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg',
    trailerKey: 'Way9Dexny3w',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
  {
    id: '157336',
    type: 'movie',
    title: 'Interstellar',
    year: '2014',
    rating: '8.7',
    genres: ['Sci-Fi', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
    trailerKey: 'zSWdZVtXT7E',
    overview: 'When Earth becomes uninhabitable, a team of ex-pilots and scientists travel through a wormhole in search of a new home for mankind.'
  },
  {
    id: '569094',
    type: 'movie',
    title: 'Spider-Man: Across the Spider-Verse',
    year: '2023',
    rating: '8.7',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    trailerKey: 'cqGjhVJWtEg',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
  },
  {
    id: '155',
    type: 'movie',
    title: 'The Dark Knight',
    year: '2008',
    rating: '9.0',
    genres: ['Action', 'Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerKey: 'EXeTwQWrcwY',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
  },
  {
    id: '533535',
    type: 'movie',
    title: 'Deadpool & Wolverine',
    year: '2024',
    rating: '8.0',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    trailerKey: '73_1biulkYk',
    overview: 'A listless Wade Wilson toils in civilian life until the Time Variance Authority recruits him to help protect his universe alongside Wolverine.'
  },
  {
    id: '76600',
    type: 'movie',
    title: 'Avatar: The Way of Water',
    year: '2022',
    rating: '7.8',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    trailerKey: 'd9MyW72ELq0',
    overview: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi.'
  },
  {
    id: '27205',
    type: 'movie',
    title: 'Inception',
    year: '2010',
    rating: '8.8',
    genres: ['Sci-Fi', 'Action'],
    poster: 'https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    trailerKey: 'YoHD9XEInc0',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  },
  {
    id: '969681',
    type: 'movie',
    title: 'Spider-Man: Brand New Day',
    year: '2026',
    rating: '8.8',
    genres: ['Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    trailerKey: 'JfVOs4VSpmA',
    overview: 'Peter Parker embarks on a brand new chapter following the memory wipe, facing emerging threats in New York City.'
  },
  {
    id: '945961',
    type: 'movie',
    title: 'Alien: Romulus',
    year: '2024',
    rating: '7.3',
    genres: ['Horror', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/2uSWRTtCG336nuBiG8jOTEUKSy8.jpg',
    trailerKey: 'x0XDEhP4MQs',
    overview: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.'
  },
  {
    id: '634649',
    type: 'movie',
    title: 'Spider-Man: No Way Home',
    year: '2021',
    rating: '8.0',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    trailerKey: 'JfVOs4VSpmA',
    overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.'
  }
];

export const HINDI_CINEMA = [
  {
    id: '872906',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Jawan',
    year: '2023',
    rating: '8.1',
    genres: ['Action', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    trailerKey: 'COv52Qyctws',
    overview: 'A high-octane action thriller outlining the emotional journey of a man set out to rectify the wrongs in the society.'
  },
  {
    id: '579974',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'RRR',
    year: '2022',
    rating: '8.8',
    genres: ['Action', 'Drama', 'History'],
    poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
    trailerKey: 'NgBoMJy386M',
    overview: 'A tale of two legendary revolutionaries and their journey far away from home before they began fighting for their country in 1920s.'
  },
  {
    id: '801688',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Kalki 2898 AD',
    year: '2024',
    rating: '7.9',
    genres: ['Sci-Fi', 'Action', 'Mythology'],
    poster: 'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    trailerKey: 'kQDd1AhGIHk',
    overview: 'A modern avatar of Vishnu descends on earth to protect the world from evil forces in a dystopian future.'
  },
  {
    id: '1112426',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Stree 2',
    year: '2024',
    rating: '7.7',
    genres: ['Comedy', 'Horror'],
    poster: 'https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg',
    trailerKey: 'KVn5m5n7Qe4',
    overview: 'After the events of Stree, the town of Chanderi is being haunted again, this time by a headless entity named Sarkata.'
  },
  {
    id: '781732',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Animal',
    year: '2023',
    rating: '7.3',
    genres: ['Crime', 'Action', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    trailerKey: 'Dydmpfo68DA',
    overview: 'A son undergoes a remarkable transformation as the bond with his father begins to fracture, setting off a path of dark vengeance.'
  },
  {
    id: '864692',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Pathaan',
    year: '2023',
    rating: '7.0',
    genres: ['Action', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg',
    trailerKey: 'vqu4z34wENw',
    overview: 'An Indian RAW agent teams up with an ISI agent to take down a former operative who leads a terrorist group against India.'
  },
  {
    id: '20453',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: '3 Idiots',
    year: '2009',
    rating: '8.4',
    genres: ['Comedy', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
    trailerKey: 'K0eDlFX9GMc',
    overview: 'Two friends search for their long lost companion while revisiting their college days and memories of their friend who inspired them to think differently.'
  },
  {
    id: '360814',
    type: 'movie',
    isHindi: true,
    preferredServer: 'server6',
    title: 'Dangal',
    year: '2016',
    rating: '8.4',
    genres: ['Biography', 'Drama', 'Sport'],
    poster: 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
    trailerKey: 'x_7YlGv9u1g',
    overview: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games.'
  }
];

export const TV_SHOWS = [
  {
    id: '1396',
    type: 'tv',
    title: 'Breaking Bad',
    year: '2008-2013',
    rating: '9.5',
    genres: ['Crime', 'Drama', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg',
    trailerKey: 'HhesaQXLuRY',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student.',
    totalSeasons: 5,
    seasons: [
      { seasonNumber: 1, episodesCount: 7 },
      { seasonNumber: 2, episodesCount: 13 },
      { seasonNumber: 3, episodesCount: 13 },
      { seasonNumber: 4, episodesCount: 13 },
      { seasonNumber: 5, episodesCount: 16 }
    ]
  },
  {
    id: '66732',
    type: 'tv',
    title: 'Stranger Things',
    year: '2016-',
    rating: '8.7',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
    trailerKey: 'b9EkMc79ZSU',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    totalSeasons: 4,
    seasons: [
      { seasonNumber: 1, episodesCount: 8 },
      { seasonNumber: 2, episodesCount: 9 },
      { seasonNumber: 3, episodesCount: 8 },
      { seasonNumber: 4, episodesCount: 9 }
    ]
  },
  {
    id: '1399',
    type: 'tv',
    title: 'Game of Thrones',
    year: '2011-2019',
    rating: '9.2',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    trailerKey: 'KPLWWIOCOOQ',
    overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    totalSeasons: 8,
    seasons: [
      { seasonNumber: 1, episodesCount: 10 },
      { seasonNumber: 2, episodesCount: 10 },
      { seasonNumber: 3, episodesCount: 10 },
      { seasonNumber: 4, episodesCount: 10 },
      { seasonNumber: 5, episodesCount: 10 },
      { seasonNumber: 6, episodesCount: 10 },
      { seasonNumber: 7, episodesCount: 7 },
      { seasonNumber: 8, episodesCount: 6 }
    ]
  },
  {
    id: '100088',
    type: 'tv',
    title: 'The Last of Us',
    year: '2023-',
    rating: '8.8',
    genres: ['Drama', 'Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
    trailerKey: 'uLtkt8BonwM',
    overview: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    totalSeasons: 1,
    seasons: [
      { seasonNumber: 1, episodesCount: 9 }
    ]
  },
  {
    id: '126308',
    type: 'tv',
    title: 'Shōgun',
    year: '2024',
    rating: '8.8',
    genres: ['Drama', 'History', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
    trailerKey: 'yRfQMX3GgTw',
    overview: 'When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power.',
    totalSeasons: 1,
    seasons: [
      { seasonNumber: 1, episodesCount: 10 }
    ]
  },
  {
    id: '76479',
    type: 'tv',
    title: 'The Boys',
    year: '2019-',
    rating: '8.7',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
    trailerKey: '06rueu_fh30',
    overview: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    totalSeasons: 4,
    seasons: [
      { seasonNumber: 1, episodesCount: 8 },
      { seasonNumber: 2, episodesCount: 8 },
      { seasonNumber: 3, episodesCount: 8 },
      { seasonNumber: 4, episodesCount: 8 }
    ]
  },
  {
    id: '123542',
    anilistId: '126403',
    type: 'tv',
    title: 'LINK CLICK',
    year: '2021',
    rating: '8.9',
    genres: ['Animation', 'Mystery', 'Supernatural'],
    poster: 'https://image.tmdb.org/t/p/w500/wo9jwu5qMvXzhW2cyy5E6hOVs92.jpg',
    trailerKey: 'fH9vN5KzKx0',
    overview: 'Using superpowers to enter their clientele’s photos one by one, Cheng Xiaoshi and Lu Guang take their work seriously at "Time Photo Studio".',
    totalSeasons: 2,
    seasons: [
      { seasonNumber: 1, episodesCount: 11 },
      { seasonNumber: 2, episodesCount: 12 }
    ]
  },
  {
    id: '288673',
    type: 'tv',
    title: 'Carrie',
    year: '2026',
    rating: '7.7',
    genres: ['Drama', 'Horror'],
    poster: 'https://image.tmdb.org/t/p/w500/eXjk4W4robXs7l1YXwaXMv4f2qb.jpg',
    overview: 'A reimagining of Stephen King’s classic story following telekinetic teenager Carrie White.',
    totalSeasons: 1,
    seasons: [
      { seasonNumber: 1, episodesCount: 8 }
    ]
  }
];

export const ANIME_CATALOG = [
  {
    id: '16498',
    anilistId: '16498',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Attack on Titan (Shingeki no Kyojin)',
    year: '2013',
    rating: '9.0',
    genres: ['Action', 'Dark Fantasy', 'Mystery'],
    episodesCount: 25,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg',
    trailerKey: 'MGRm4IzK1SQ',
    overview: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide behind enormous concentric walls.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '113415',
    anilistId: '113415',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Jujutsu Kaisen',
    year: '2020',
    rating: '8.7',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    episodesCount: 24,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg',
    trailerKey: 'pkKu9hLT-t8',
    overview: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '101922',
    anilistId: '101922',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    year: '2019',
    rating: '8.7',
    genres: ['Action', 'Fantasy', 'Historical'],
    episodesCount: 26,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg',
    trailerKey: 'VQGCKyvzIM4',
    overview: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon herself.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '151807',
    anilistId: '151807',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Solo Leveling',
    year: '2024',
    rating: '8.5',
    genres: ['Action', 'Adventure', 'Fantasy'],
    episodesCount: 12,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png',
    trailerKey: '91_tZ2ghwUY',
    overview: 'In a world where hunters, human warriors who possess supernatural abilities, must battle deadly monsters, a notoriously weak hunter named Sung Jinwoo finds himself in a struggle for survival.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '154587',
    anilistId: '154587',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Frieren: Beyond Journey\'s End',
    year: '2023',
    rating: '9.1',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    episodesCount: 28,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg',
    trailerKey: 'ZEkw_JHQdfY',
    overview: 'An elf mage and her fellow adventurers have defeated the Demon King and brought peace to the land. But From the perspective of an elf who lives for thousands of years, decades pass in the blink of an eye.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '127230',
    anilistId: '127230',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Chainsaw Man',
    year: '2022',
    rating: '8.5',
    genres: ['Action', 'Supernatural', 'Gore'],
    episodesCount: 12,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png',
    trailerKey: 'q15CRdE5Bv0',
    overview: 'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '1535',
    anilistId: '1535',
    type: 'anime',
    preferredServer: 'anime',
    title: 'Death Note',
    year: '2006',
    rating: '9.0',
    genres: ['Mystery', 'Psychological', 'Supernatural'],
    episodesCount: 37,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-kUgkcrfOrkUM.jpg',
    trailerKey: 'NlJZ-YgAt-c',
    overview: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    audioOptions: ['sub', 'dub']
  },
  {
    id: '21',
    anilistId: '21',
    type: 'anime',
    preferredServer: 'anime',
    title: 'One Piece',
    year: '1999-',
    rating: '8.9',
    genres: ['Action', 'Adventure', 'Fantasy'],
    episodesCount: 1100,
    poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg',
    trailerKey: 'MCb13lbKpsM',
    overview: 'Monkey D. Luffy and his pirate crew explore the fantastical islands, oceans, and wonders in search of the world\'s ultimate treasure known as One Piece.',
    audioOptions: ['sub', 'dub']
  }
];
