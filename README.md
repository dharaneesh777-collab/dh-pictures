# StreamVerse - Multi-Server Streaming Frontend

A modern, responsive, dark-mode streaming web application designed for seamless video playback across multi-server embed APIs, including Hollywood blockbusters, TV series, Bollywood/Hindi cinema, and Anime with Sub/Dub audio.

## Integrated Embed Servers

| Server | Type | Movie Endpoint | TV Show Endpoint | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Server 1** (VixSrc) | Movies & TV | `https://vixsrc.to/movie/${id}` | `https://vixsrc.to/tv/${id}/${season}/${episode}` | 4K Ultra FastBitrate |
| **Server 2** (VidCore) | Movies & TV | `https://vidcore.net/movie/${id}` | `https://vidcore.net/tv/${id}/${season}/${episode}` | Reliable HD CDN Backup |
| **Server 3** (VidSrc To) | Movies & TV | `https://vidsrc.to/embed/movie/${id}` | `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` | VidSrc Embed Network |
| **Server 4** (Vidy) | Movies & TV | `https://vidy.st/movie/${id}` | `https://vidy.st/tv/${id}/${season}/${episode}` | Low latency buffer |
| **Server 5** (MoviesAPI) | Movies & TV | `https://moviesapi.to/movie/${id}?autoplay=true` | `https://moviesapi.to/tv/${id}/${season}/${episode}?autoplay=true` | Direct autoplay stream |
| **Server 6 (Hindi)** | Bollywood & TV | `https://screenscape.me/embed?tmdb=${id}&type=movie` | `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${season}&e=${episode}` | Indian & Hindi Audio |
| **Anime Server** (MegaPlay) | Anime | `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${language}` | N/A | Sub & Dub Audio Toggle |
| **Trailers** | YouTube | `https://www.youtube.com/embed/${trailerKey}?autoplay=1` | N/A | High-res YouTube embed |

---

## Key Features

1. **Multi-Server Switcher**: Switch between Servers 1 through 6 and Anime Server with 1 click.
2. **Sub / Dub Audio Switcher**: Dedicated Japanese SUB and English DUB switch for the MegaPlay Anime Server.
3. **Season & Episode Selector**: TV show and anime episode drawers with next/previous episode quick jump buttons.
4. **Ad-Protection Sandbox Toggle**: Switch between Protected Mode (`sandbox` attributes) to block invasive popups and Full Compatibility mode.
5. **Direct Custom ID Launcher**: Test and stream any arbitrary TMDB ID, TV Season/Episode, AniList Anime ID, or YouTube trailer key.
6. **Live Search**:
   - Real-time **AniList GraphQL API** queries for any anime title and episode metadata.
   - Built-in curated catalog + support for custom TMDB API key.
7. **Watch History & Watchlist**: Continue watching where you left off with local storage synchronization.
8. **Cinematic Theater Mode**: Expands the video player to full width.
9. **Deep Linking**: Launch media directly via URL queries (e.g. `?type=movie&id=872585&server=server1`, `?type=anime&id=16498&ep=1&lang=sub`).

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Test Suite
```bash
npx vitest run
```

### 4. Production Build
```bash
npm run build
```
