# Climate Change News Aggregator API

A Node.js Express server that aggregates climate-related news articles from multiple international news sources through web scraping.

## Overview

This API scrapes climate-related articles from 13 major news sources and exposes them through REST endpoints. It uses Cheerio for HTML parsing and Axios for HTTP requests.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js 5.x** - Web framework
- **Axios** - HTTP client
- **Cheerio** - HTML parser

## Installation

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run start
```

The server runs on port 8000 by default (configurable via `PORT` environment variable).

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/news` | GET | Get all aggregated articles from all sources |
| `/news/:newspaperId` | GET | Get articles from a specific source |

### Response Format

```json
{
  "title": "Article headline",
  "url": "Full article URL",
  "source": "newspaper name"
}
```

### Available Sources

Use these IDs with `/news/:newspaperId`:

- `cityam` - City AM
- `thetimes` - The Times
- `guardian` - The Guardian
- `telegraph` - The Telegraph
- `nyt` - New York Times
- `latimes` - LA Times
- `smh` - Sydney Morning Herald
- `un` - UN Climate Change
- `bbc` - BBC
- `es` - Evening Standard
- `sun` - The Sun
- `dm` - Daily Mail
- `nyp` - New York Post

## Examples

```bash
# Get all news
curl http://localhost:8000/news

# Get articles from The Guardian
curl http://localhost:8000/news/guardian

# Get articles from BBC
curl http://localhost:8000/news/bbc
```

## Project Structure

```
project_rapidapi/
├── index.js          # Main application (server, scraping, routes)
├── package.json      # Dependencies and scripts
├── .claude/          # Claude Code configuration
└── README.md         # Documentation
```

## How It Works

1. On startup, the server fetches articles from all 13 news sources in parallel
2. Articles containing "climate" in their link text are extracted
3. Results are stored in memory and served via the `/news` endpoint
4. Individual source endpoints (`/news/:newspaperId`) fetch fresh data in real-time

## Notes

- Articles are stored in memory and lost on server restart
- The scraper uses a Chrome User-Agent header to avoid blocking
- Some sources may fail due to rate limiting or HTML structure changes
- No authentication required - API is fully public

## License

ISC
