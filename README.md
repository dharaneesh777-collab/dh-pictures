# DH PICTURES - Multi-Server Streaming Frontend

A high-performance, dark-mode streaming web application built with React, Vite, and Lucide icons. Features multi-server embed players (Movies, TV Shows, Bollywood, and Anime with Sub/Dub audio), live AniList & TMDB integration, and responsive luxury cinema UI.

---

## Live Demo & Free Hosting

DH PICTURES is configured for 1-click free static hosting:

- **GitHub Pages**: Automated CI/CD workflow included in `.github/workflows/deploy.yml`. Automatically builds and deploys on push to `master`.
- **Vercel**: Preconfigured with `vercel.json` SPA client-side rewrite rules.
- **Netlify / Cloudflare Pages**: Preconfigured with `public/_redirects` and `public/404.html`.

---

## Integrated Embed Servers

| Server | Type | Movie Endpoint | TV Show Endpoint | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Server 1** (VixSrc) | Movies & TV | `https://vixsrc.to/movie/${id}` | `https://vixsrc.to/tv/${id}/${season}/${episode}` | 4K Ultra Fast Bitrate |
| **Server 2** (VidCore) | Movies & TV | `https://vidcore.net/movie/${id}` | `https://vidcore.net/tv/${id}/${season}/${episode}` | Reliable HD CDN Backup |
| **Server 3** (VidSrc To) | Movies & TV | `https://vidsrc.to/embed/movie/${id}` | `https://vidsrc.to/embed/tv/${id}/${season}/${episode}` | VidSrc Embed Network |
| **Server 4** (Vidy) | Movies & TV | `https://vidy.st/movie/${id}` | `https://vidy.st/tv/${id}/${season}/${episode}` | Low latency buffer |
| **Server 5** (MoviesAPI) | Movies & TV | `https://moviesapi.to/movie/${id}?autoplay=true` | `https://moviesapi.to/tv/${id}/${season}/${episode}?autoplay=true` | Direct autoplay stream |
| **Server 6 (Hindi)** | Bollywood & TV | `https://screenscape.me/embed?tmdb=${id}&type=movie` | `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${season}&e=${episode}` | Indian & Hindi Audio |
| **Anime Server** (MegaPlay) | Anime | `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${language}` | N/A | Sub & Dub Audio Toggle |
| **Trailers** | YouTube | `https://www.youtube.com/embed/${trailerKey}?autoplay=1` | N/A | High-res YouTube embed |

---

## Key Features

1. **Brand Identity**: Modern **DH PICTURES** cinema aesthetic with electric cyan glow accents.
2. **Multi-Server Switcher**: Switch between Servers 1 through 6 and Anime Server with 1 click.
3. **Sub / Dub Audio Switcher**: Dedicated Japanese SUB and English DUB switch for the MegaPlay Anime Server.
4. **Season & Episode Drawer**: TV show and anime episode drawers with next/previous episode quick jump buttons.
5. **Ad-Protection Sandbox Toggle**: Switch between Protected Mode (`sandbox` attributes) to block invasive popups and Full Compatibility mode.
6. **Direct Custom ID Launcher**: Test and stream any arbitrary TMDB ID, TV Season/Episode, AniList Anime ID, or YouTube trailer key.
7. **Live Search**:
   - Real-time **AniList GraphQL API** queries for anime titles and episode metadata.
   - Built-in curated catalog + support for custom TMDB API key.
8. **Watch History & Watchlist**: Continue watching where you left off with local storage synchronization.
9. **Cinematic Theater Mode**: Expands the video player to full width.
10. **Deep Linking & URL Sync**: Launch media directly via URL queries (e.g. `?type=movie&id=872585&server=server1`, `?type=anime&id=16498&ep=1&lang=sub`).

---

## Local Development

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

### 4. Build for Production
```bash
npm run build
```

---

## Deployment Instructions

### Option 1: GitHub Pages (Automatic)
1. Go to repository **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Push to `master` (or trigger the workflow manually under **Actions**).
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Option 2: Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework preset will automatically detect Vite.
3. Click **Deploy**.

### Option 3: Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Set build command to `npm run build` and publish directory to `dist`.
3. Click **Deploy**.
