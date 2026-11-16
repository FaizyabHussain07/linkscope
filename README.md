# LinkScope

> Understand Every Link. Perfect Every Preview.

[![npm](https://img.shields.io/badge/npm-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![next](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**LinkScope** is a professional-grade, privacy-first link intelligence platform for developers, marketers, and SEO specialists. Inspect how your URLs appear across social platforms, analyze metadata, and generate production-ready code.

**Live Demo:** https://linkscope.faizyab.me/

## ✨ Features

### Core Inspection
- **🔍 Real URL Inspection** - Fetches and analyzes actual webpages
- **📊 Comprehensive Metadata Extraction** - Open Graph, Twitter Cards, SEO tags
- **🛡️ SSRF Protection** - Enterprise-grade security for URL fetching
- **⚡ Fast & Privacy-First** - No data stored, no database required

### Analytics & Audit
- **📈 SEO Audit & Scoring** - 100-point scale with detailed recommendations
- **🔍 Open Graph Analyzer** - Validate all OG tags
- **🐦 Twitter/X Card Analyzer** - Check Twitter Card implementation
- **🖼️ Image Inspector** - Extract and analyze all images
- **🔧 Metadata Debugger** - Identify and fix metadata issues

### Tools
- **📝 Metadata Generator** - Generate HTML, Next.js, and React code
- **📊 Bulk URL Analyzer** - Inspect multiple URLs at once
- **⚖️ Comparison Tool** - Compare metadata between URLs
- **📥 Export** - JSON, CSV, and copy functionality

### Public pages
- `/inspect` — interactive single-URL inspection
- `/tools` — metadata generator, bulk inspection, comparison, and exports
- `/features` — product capabilities
- `/guides/open-graph` — Open Graph implementation guide
- `/faq` — product and metadata troubleshooting answers
- `/privacy` — current transient-processing privacy policy

### Platform Previews
- Facebook-style link previews
- LinkedIn-style link previews
- X/Twitter summary and large image cards
- Generic website previews

## 🚀 Quick Start

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

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/inspect` | POST | Inspect a single URL |
| `/api/v1/bulk` | POST | Bulk inspect multiple URLs |
| `/api/v1/compare` | POST | Compare two URLs |
| `/api/v1/image-inspect` | POST | Inspect images on a page |
| `/api/v1/generate` | POST | Generate metadata code |

### API Examples

#### Inspect a URL
```bash
curl -X POST https://linkscope.faizyab.me/api/v1/inspect \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Bulk Inspect
```bash
curl -X POST https://linkscope.faizyab.me/api/v1/bulk \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com", "https://example.org"]}'
```

#### Generate Metadata
```bash
curl -X POST https://linkscope.faizyab.me/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Page Title",
    "description": "My page description",
    "url": "https://example.com",
    "siteName": "My Site",
    "imageUrl": "https://example.com/image.jpg",
    "contentType": "website",
    "twitterCardType": "summary_large_image"
  }'
```

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Icons:** Lucide React
- **HTML Parsing:** Cheerio
- **Validation:** Zod
- **Testing:** Vitest + Playwright

## 🔒 Security

LinkScope implements comprehensive SSRF protection:

- HTTP/HTTPS only
- Private IP range blocking (RFC 1918)
- Loopback and link-local blocking
- Cloud metadata endpoint blocking (169.254.169.254)
- IPv6 validation
- Redirect validation
- Timeout and size limits
- Rate limiting

See [Security Documentation](docs/SECURITY.md) for details.

## 🌍 Environment Variables

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

## 📁 Project Structure

```
linkscope/
├── app/
│   ├── api/v1/           # API endpoints
│   │   ├── inspect/       # URL inspection
│   │   ├── bulk/          # Bulk inspection
│   │   ├── compare/       # URL comparison
│   │   ├── image-inspect/ # Image inspection
│   │   ├── generate/      # Metadata generation
│   │   └── health/        # Health check
│   ├── inspect/          # Inspection page
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── previews/         # Platform preview components
│   ├── metadata-tabs/    # Metadata display components
│   └── score-display/    # Score display component
├── lib/
│   ├── security/         # SSRF protection
│   ├── extractors/        # Metadata extraction
│   ├── analyzers/         # Audit & scoring
│   └── generators/        # Code generation
├── hooks/                # React hooks
├── context/              # React context
├── types/                # TypeScript types
├── config/               # App configuration
├── docs/                 # Documentation
├── public/               # Static assets
└── tests/                # Test files
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- HTML parsing with [Cheerio](https://cheerio.js.org/)

---

**LinkScope** - Understand Every Link. Perfect Every Preview.

Made with ❤️ by [Faizyab Hussain](https://github.com/FaizyabHussain07)
