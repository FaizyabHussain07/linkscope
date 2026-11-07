# LinkScope

See how your links look everywhere.

LinkScope is a modern, privacy-first tool for inspecting, testing, and debugging website link previews and metadata. Enter a URL and receive a detailed report explaining how your website may appear when shared across social platforms, whether its metadata is correctly configured, and what needs to be fixed.

## Features

- **URL Inspection** — Fetch and analyze website metadata securely
- **Social Previews** — Simulate how links appear on 7 platforms:
  - WhatsApp, Facebook, LinkedIn, X (Twitter), Discord, Telegram, Slack
- **Metadata Extraction** — Open Graph, Twitter Cards, and SEO metadata
- **SEO Audit** — Score your metadata quality with actionable recommendations
- **Image Inspector** — Check image dimensions, format, and accessibility
- **Metadata Generator** — Generate HTML, Next.js, and React metadata code
- **Bulk Inspection** — Analyze multiple URLs at once
- **Comparison** — Compare metadata between websites
- **Export** — Download reports as JSON, CSV, or HTML

## Quick Start

```bash
git clone https://github.com/your-org/linkscope.git
cd linkscope
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Icons**: Lucide React
- **HTML Parsing**: Cheerio
- **Validation**: Zod
- **Testing**: Vitest + Playwright

## Security

LinkScope takes security seriously. The server-side fetcher implements:

- SSRF protection (blocks private IPs, localhost, cloud metadata endpoints)
- URL scheme validation (HTTP/HTTPS only)
- Redirect validation and limiting
- Response size limits
- Connection timeouts
- No credential forwarding
- Controlled User-Agent

See [SECURITY.md](docs/SECURITY.md) for details.

## Self-Hosting

LinkScope is designed to be self-hosted. No database required.

### Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your deployment | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `LinkScope` |
| `INSPECTION_TIMEOUT_MS` | Request timeout | `30000` |
| `INSPECTION_MAX_SIZE_BYTES` | Max response size | `10485760` (10MB) |
| `INSPECTION_MAX_REDIRECTS` | Max redirect following | `5` |

### Deployment

LinkScope can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Cloudflare Pages (with OpenNext)
- Node.js server
- Docker

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## Free vs Premium

### Free (Self-Hosted and Hosted)

- Single URL inspections
- Social previews
- Metadata extraction
- SEO audit
- Image inspection
- Metadata generation
- JSON export

### Premium (Hosted Only)

- Higher inspection limits
- Bulk URL inspection
- Advanced metadata comparison
- Detailed downloadable reports
- Advanced diagnostics
- Higher API usage limits

Self-hosted deployments can use all free features without any billing configuration. Premium features are only available on the official hosted service.

## API

LinkScope provides a REST API for programmatic access:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/inspect` | POST | Inspect a single URL |
| `/api/v1/bulk` | POST | Inspect multiple URLs |
| `/api/v1/compare` | POST | Compare metadata |
| `/api/v1/image-inspect` | POST | Inspect an image |
| `/api/v1/generate` | POST | Generate metadata code |
| `/api/v1/health` | GET | Health check |

See [docs/API.md](docs/API.md) for detailed documentation.

## Privacy

- No database required
- No server-side inspection history
- No account required
- Browser-local storage only for preferences and recent URLs
- Inspection results are not persisted on the server

## License

MIT License — see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## Credits

Created by [Your Name](https://github.com/your-username)

---

**LinkScope** — See how your links look everywhere.
