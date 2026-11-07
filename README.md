# LinkScope

> See how your links look everywhere.

[![npm](https://img.shields.io/badge/npm-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![next](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**LinkScope** is a professional-grade, privacy-first toolkit for inspecting, testing, and debugging how your website links appear across social platforms. Analyze Open Graph, Twitter Card, and SEO metadata with actionable recommendations.

**Live Demo:** https://linkscope.faizyab.me/

## Features

- **🔒 Privacy-First** — No database. No accounts. No tracking.
- **🔍 7 Platform Previews** — WhatsApp, Facebook, LinkedIn, X, Discord, Telegram, Slack
- **📊 SEO Audit & Scoring** — Deterministic scoring with actionable recommendations
- **🛡️ SSRF Protected** — Enterprise-grade security for URL fetching
- **📝 Code Generation** — Generate HTML, Next.js, and React metadata code
- **📥 Export Reports** — JSON, CSV, and printable HTML exports
- **🚀 Self-Hostable** — Deploy anywhere with zero dependencies

## Quick Start

```bash
# Clone the repository
git clone https://github.com/FaizyabHussain07/linkscope.git
cd linkscope

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Icons:** Lucide React
- **HTML Parsing:** Cheerio
- **Validation:** Zod
- **Testing:** Vitest + Playwright

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your deployment | `https://linkscope.faizyab.me` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `LinkScope` |
| `INSPECTION_TIMEOUT_MS` | Request timeout | `30000` |
| `INSPECTION_MAX_SIZE_BYTES` | Max response size | `10485760` (10MB) |
| `INSPECTION_MAX_REDIRECTS` | Max redirect following | `5` |

## Security

LinkScope implements comprehensive SSRF protection:

- HTTP/HTTPS only
- Private IP range blocking (RFC 1918)
- Loopback and link-local blocking
- Cloud metadata endpoint blocking (169.254.169.254)
- IPv6 validation
- Redirect validation
- Timeout and size limits

See [SECURITY.md](docs/SECURITY.md) for details.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/inspect` | POST | Inspect a single URL |
| `/api/v1/bulk` | POST | Inspect multiple URLs |
| `/api/v1/compare` | POST | Compare metadata between URLs |
| `/api/v1/image-inspect` | POST | Inspect an image |
| `/api/v1/generate` | POST | Generate metadata code |
| `/api/v1/health` | GET | Health check |

See [API Documentation](docs/API.md) for details.

## Free vs Premium

### Free (Self-Hosted & Hosted)

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

Self-hosted deployments can use all free features without any billing configuration.

## Project Structure

```
linkscope/
├── app/
│   ├── api/v1/           # API endpoints
│   ├── inspect/          # Inspection page
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── previews/         # Platform preview components
│   ├── metadata/         # Metadata display components
│   └── score-display/    # Score display component
├── lib/
│   ├── security/         # SSRF protection
│   ├── extractors/        # Metadata extraction
│   └── analyzers/         # Audit & scoring
├── hooks/                # React hooks
├── context/              # React context
├── types/                # TypeScript types
├── config/               # App configuration
├── docs/                 # Documentation
├── public/               # Static assets
└── tests/                # Test files
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Credits

Created by [Faizyab Hussain](https://github.com/FaizyabHussain07)

**LinkScope** — See how your links look everywhere.
