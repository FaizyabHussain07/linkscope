# LinkScope — Project Assessment

## Current Project State

This repository is a functional Open Graph metadata preview tool called "LinkPreview" that needs to be evolved into "LinkScope" per the PRD requirements.

### Existing Architecture

```
linkscope/
├── app/
│   ├── api/metadata/route.ts    # Server-side metadata extraction
│   ├── page.tsx                 # Main UI (client component)
│   ├── layout.tsx               # Root layout with fonts
│   ├── globals.css              # Tailwind 4 + shadcn styles
│   ├── robots.ts                # SEO robots.txt
│   └── sitemap.ts               # SEO sitemap
├── components/
│   ├── ui/                      # shadcn/ui components (16 components)
│   ├── previews/                # Platform preview components (7 platforms)
│   │   ├── base-preview.tsx
│   │   ├── telegram-preview.tsx
│   │   ├── facebook-preview.tsx
│   │   ├── discord-preview.tsx
│   │   ├── slack-preview.tsx
│   │   ├── x-preview.tsx
│   │   ├── linkedin-preview.tsx
│   │   ├── whatsapp-preview.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── metadata/                # Metadata display components
│   │   ├── fields.tsx
│   │   ├── html-generator.ts
│   │   ├── image-preview.tsx
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── url-input.tsx
│   ├── score-display.tsx
│   ├── metadata-tabs.tsx
│   ├── github-stars.tsx
│   └── keyboard-shortcuts.tsx
├── hooks/
│   ├── use-metadata.ts          # Metadata fetching hook
│   └── use-keyboard-shortcuts.ts
├── context/
│   └── settings-context.tsx     # Theme/settings context
├── lib/
│   ├── utils.ts                 # Utility functions
│   └── cache.ts                 # URL formatting
└── public/
    └── og.png                   # OG image
```

### Key Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `app/api/metadata/route.ts` | Core extraction API | Functional but lacks SSRF protection |
| `app/page.tsx` | Main UI | Functional but branded as "LinkPreview" |
| `lib/cache.ts` | URL normalization | Uses `normalize-url` package |
| `hooks/use-metadata.ts` | Client state management | Functional |
| `components/previews/` | 7 platform previews | Complete and working |
| `components/metadata/` | Metadata display | Complete |

### Technology Stack (Current)

- **Framework**: Next.js 16.1.4 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui (radix-vega style)
- **Icons**: lucide-react + react-icons
- **Animation**: motion (Framer Motion)
- **HTML Parsing**: cheerio 1.1.2
- **URL Normalization**: normalize-url 8.1.1
- **State**: React context + useState/useReducer
- **Package Manager**: Bun

### Missing Dependencies (Required by PRD)

| Package | Purpose | Priority |
|---------|---------|----------|
| `zod` | Input/response validation | High |
| `vitest` | Unit/integration testing | High |
| `@playwright/test` | E2E testing | High |
| `sharp` | Image inspection | Medium (optional) |

### What Works

1. **URL Input**: Clean input with loading/error states
2. **Metadata Extraction**: Extracts OG, Twitter, SEO meta tags via Cheerio
3. **Platform Previews**: All 7 platforms render with platform-specific styling
4. **Score Display**: Visual score with checklist
5. **Tabs Navigation**: Score, Previews, Basic, OG, X, Images, Raw tabs
6. **Metadata Generator**: HTML tag generation
7. **Image Preview**: Dimension detection via client-side Image loading
8. **Raw JSON/HTML View**: Copyable raw metadata
9. **Recent URLs**: localStorage-based history
10. **Keyboard Shortcuts**: Platform switching shortcuts
11. **Dark Theme**: Dark-first design

### Critical Issues to Address

#### 1. Security — SSRF Vulnerability (CRITICAL)

The current `app/api/metadata/route.ts` has **no SSRF protection**:
- No IP validation
- No private IP blocking
- No localhost/loopback protection
- No redirect validation
- No timeout limits
- No response size limits
- No User-Agent customization (uses generic browser UA)
- Fetches favicon/robots.txt/sitemap without validation

This is the most critical issue that must be fixed before any release.

#### 2. Branding

The project is branded as "LinkPreview" but needs to become "LinkScope":
- Package name: `linkpreview` → `linkscope`
- Repository references: `KartikLabhshetwar/linkpreview`
- Site URL: `linkpreview.kartikk.tech` → needs updating
- All UI text says "linkpreview"

#### 3. API Design

Current API is a single GET endpoint with query params. PRD requires:
- `POST /api/v1/inspect` — Single URL inspection
- `POST /api/v1/bulk` — Bulk inspection
- `POST /api/v1/compare` — Metadata comparison
- `POST /api/v1/image-inspect` — Image inspection
- `POST /api/v1/generate` — Metadata generation
- `GET /api/v1/health` — Health check

#### 4. Missing Features (Per PRD)

| Feature | Status | Priority |
|---------|--------|----------|
| Metadata audit with scoring | Basic score only | High |
| Image inspector (MIME, size, dimensions) | Basic dimensions only | High |
| Metadata generator (HTML, Next.js, React) | HTML only | High |
| Bulk inspector | Not implemented | Medium |
| Metadata comparison | Not implemented | Medium |
| Report exports (JSON, CSV, PDF) | JSON only (raw view) | Medium |
| SearchParams. |
| Zod validation | Not used | High |
| Tests (unit, integration, E2E) | None | High |
| Documentation (README, CONTRIBUTING, etc.) | Minimal README | High |
| .env.example | Not present | High |
| Security documentation | Not present | High |

#### 5. Code Quality Issues

- No input validation on URL parameter
- No Zod schema validation
- No automated tests
- Hardcoded GitHub repo reference in multiple places
- External tracking script in layout (databuddy.cc) — should be removed or made configurable
- `console.error` in API route leaks to server logs

#### 6. UI/UX Improvements Needed

- The UI is functional but minimal
- No metadata audit panel with findings/recommendations
- No bulk inspection UI
- No comparison UI
- No export buttons
- Score display is basic

---

## Product Requirements Checklist

Based on the PRD, here's what needs to be built:

### Core Features (Must Have)

- [ ] Secure URL fetching with SSRF protection
- [ ] Metadata extraction (OG, Twitter, SEO)
- [ ] 7 platform previews (WhatsApp, Facebook, LinkedIn, X, Discord, Telegram, Slack)
- [ ] Metadata audit with scoring
- [ ] Image inspector
- [ ] Metadata generator (HTML, Next.js, React)
- [ ] Raw metadata viewer
- [ ] JSON export

### Advanced Features (Should Have)

- [ ] Bulk inspector
- [ ] Metadata comparison
- [ ] CSV export
- [ ] Printable HTML report
- [ ] PDF export (if feasible)
- [ ] API documentation
- [ ] Recommendations engine

### Infrastructure (Must Have)

- [ ] Zod validation for all endpoints
- [ ] Unit tests for extraction/scoring
- [ ] Integration tests for API
- [ ] Security tests for SSRF
- [ ] E2E tests with Playwright
- [ ] MIT License
- [ ] README with installation/deployment
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] SECURITY.md
- [ ] .env.example

### Premium/Hosted (Future)

- [ ] Premium feature flags (configurable)
- [ ] License verification boundary (documented)

---

## Proposed Architecture

### Directory Structure (Target)

```
linkscope/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── inspect/
│   │       │   └── route.ts
│   │       ├── bulk/
│   │       │   └── route.ts
│   │       ├── compare/
│   │       │   └── route.ts
│   │       ├── image-inspect/
│   │       │   └── route.ts
│   │       ├── generate/
│   │       │   └── route.ts
│   │       └── health/
│   │           └── route.ts
│   ├── docs/
│   │   └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── previews/                # Platform previews
│   ├── metadata/                # Metadata display
│   ├── audit/                   # NEW: Audit panel
│   ├── generator/               # NEW: Metadata generator
│   ├── bulk/                    # NEW: Bulk inspector
│   ├── compare/                 # NEW: Comparison view
│   ├── exports/                 # NEW: Export buttons
│   └── layout/                  # NEW: Header, footer, etc.
├── lib/
│   ├── security/                # NEW: SSRF protection
│   │   ├── index.ts
│   │   ├── url-validator.ts
│   │   ├── ip-validator.ts
│   │   └── fetch.ts
│   ├── fetcher/                 # NEW: Page fetching
│   │   └── index.ts
│   ├── extractors/              # NEW: Metadata extraction
│   │   ├── index.ts
│   │   ├── open-graph.ts
│   │   ├── twitter.ts
│   │   └── seo.ts
│   ├── analyzers/               # NEW: Analysis
│   │   ├── index.ts
│   │   ├── audit.ts
│   │   └── recommendations.ts
│   ├── scoring/                 # NEW: Scoring engine
│   │   └── index.ts
│   ├── previews/                # NEW: Preview data
│   │   └── index.ts
│   ├── exports/                 # NEW: Export utilities
│   │   └── index.ts
│   ├── billing/                 # NEW: Premium config
│   │   └── index.ts
│   ├── utils.ts
│   └── cache.ts
├── hooks/
│   ├── use-metadata.ts
│   ├── use-keyboard-shortcuts.ts
│   └── use-settings.ts
├── types/
│   ├── metadata.ts
│   ├── api.ts
│   └── security.ts
├── config/
│   └── index.ts                 # App configuration
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── README.md
│   ├── CONTRIBUTING.md
│   ├── CODE_OF_CONDUCT.md
│   ├── SECURITY.md
│   └── API.md
├── public/
│   └── og.png
├── .env.example
├── LICENSE
├── package.json
├── tsconfig.json
├── next.config.ts
└── vitest.config.ts             # NEW
```

### Data Flow

```
User Input (URL)
    ↓
Client Validation (Zod)
    ↓
API Request (POST /api/v1/inspect)
    ↓
Server Security Check (SSRF protection)
    ↓
Page Fetch (with timeout, size limit, redirect limit)
    ↓
HTML Parsing (Cheerio)
    ↓
Metadata Extraction (OG, Twitter, SEO)
    ↓
Audit Analysis (missing, duplicate, invalid)
    ↓
Scoring (deterministic, documented)
    ↓
Response (JSON) → Client → Display
```

### Key Design Decisions

1. **No database** — All inspection is stateless. Results returned to client and discarded.
2. **Browser-local storage only** — Recent URLs, preferences, theme in localStorage.
3. **Security-first fetcher** — Dedicated security module for URL validation and safe fetching.
4. **Modular extraction** — Separate extractors for OG, Twitter, SEO metadata.
5. **Deterministic scoring** — Documented weights, no randomness.
6. **Zod throughout** — Input validation and response typing with Zod schemas.
7. **Configurable limits** — All limits (timeout, size, redirects) configurable via env.

---

## Implementation Phases

### Phase 1: Foundation & Security (Week 1)

1. Update branding (LinkPreview → LinkScope)
2. Add Zod dependency
3. Create security module:
   - URL validation
   - IP range checking
   - Safe fetch with timeouts
   - Redirect validation
4. Create types module
5. Create config module
6. Set up Vitest

**Deliverables**: Secure API foundation, types, config, test setup

### Phase 2: Metadata Extraction Engine (Week 1-2)

1. Refactor extraction into modular extractors
2. Add OG:title, og:description, og:image, og:url, og:type, og:site_name, og:locale
3. Add Twitter Card extraction
4. Add SEO metadata extraction
5. Add duplicate/empty detection
6. Add relative URL resolution
7. Add image metadata extraction

**Deliverables**: Complete extraction engine with duplicate/empty detection

### Phase 3: Audit & Scoring (Week 2)

1. Build audit engine
2. Implement scoring with documented weights
3. Generate recommendations
4. Create audit UI component

**Deliverables**: Audit panel with score, findings, recommendations

### Phase 4: Image Inspector (Week 2-3)

1. Server-side image validation (MIME, dimensions)
2. File size detection
3. Format detection
4. Recommended dimensions checker
5. Image inspector UI

**Deliverables**: Image inspector with full diagnostics

### Phase 5: Metadata Generator (Week 3)

1. HTML metadata generator (enhance existing)
2. Next.js Metadata API generator
3. Next.js static metadata generator
4. React metadata generator
5. Generator UI with editing

**Deliverables**: Multi-format metadata generator

### Phase 6: Bulk & Compare (Week 3-4)

1. Bulk inspection endpoint
2. Comparison endpoint
3. Bulk UI
4. Comparison UI

**Deliverables**: Bulk and comparison features

### Phase 7: Exports (Week 4)

1. JSON export (enhance)
2. CSV export
3. Printable HTML report
4. Export UI

**Deliverables**: Export functionality

### Phase 8: Documentation & Testing (Week 4-5)

1. Write README
2. Write CONTRIBUTING.md
3. Write CODE_OF_CONDUCT.md
4. Write SECURITY.md
5. Write API documentation
6. Write .env.example
7. Unit tests
8. Integration tests
9. Security tests
10. E2E tests

**Deliverables**: Complete documentation and test suite

### Phase 9: Polish & Release (Week 5)

1. Accessibility audit
2. Responsive design check
3. Performance optimization
4. Final security review
5. Production build verification
6. Release preparation

**Deliverables**: Release-ready application

---

## Dependency Recommendations

### Required (New)
```json
{
  "zod": "^3.23.0",
  "vitest": "^2.0.0",
  "@playwright/test": "^1.40.0"
}
```

### Optional (Evaluate)
```json
{
  "sharp": "^0.32.0"  // Only if image inspection needs server-side processing
}
```

### Existing (Keep)
- `cheerio` — HTML parsing (keep)
- `normalize-url` — URL normalization (keep or replace with custom)
- `lucide-react` — Icons (keep)
- `motion` — Animations (keep)
- `tailwindcss` + `shadcn/ui` — Styling (keep)

### Not Needed
- Database drivers (Prisma, etc.) — PRD explicitly excludes
- Auth libraries — No mandatory auth
- ORM — No database

---

## Security Threat Assessment

### Threat Model

| Threat | Severity | Mitigation |
|--------|----------|------------|
| SSRF — Private IP access | CRITICAL | IP validation, block private ranges |
| SSRF — Localhost/loopback | CRITICAL | Block 127.0.0.0/8, ::1, fe80::/10 |
| SSRF — Cloud metadata (169.254.169.254) | CRITICAL | Explicit block list |
| SSRF — Redirect bypass | HIGH | Validate each redirect, limit count |
| SSRF — DNS rebinding | HIGH | Validate IP at connection time |
| SSRF — IPv6 bypass | HIGH | Validate both IPv4 and IPv6 |
| SSRF — Unsafe schemes (file://, gopher://) | HIGH | Allow HTTP/HTTPS only |
| SSRF — Unsafe ports | MEDIUM | Block privileged ports |
| DoS — Large responses | MEDIUM | Response size limit |
| DoS — Slowloris | MEDIUM | Connection/read timeouts |
| DoS — Redirect loops | MEDIUM | Redirect count limit |
| Information leakage | MEDIUM | Sanitize errors, no URL logging |
| XSS — Metadata reflection | LOW | Escape all metadata in HTML output |

### Security Requirements

1. **URL Validation**
   - Parse with URL constructor
   - Reject non-HTTP/HTTPS schemes
   - Reject credentials (user:pass@host)
   - Reject localhost, loopback, private IPs
   - Reject link-local, multicast, reserved ranges

2. **DNS Validation**
   - Resolve hostname to IPs
   - Check all resolved IPs against blocklist
   - Handle DNS rebinding (re-validate on connect)

3. **Fetch Restrictions**
   - Timeout: configurable (default 10s connect, 30s total)
   - Redirects: max 5
   - Size: configurable (default 10MB)
   - User-Agent: controlled, identifiable

4. **Response Handling**
   - Validate Content-Type
   - Limit response size
   - Sanitize error messages
   - No logging of full URLs or content

5. **Image Inspector Security**
   - Same SSRF protections as page fetcher
   - Don't trust Content-Type from image URL
   - Validate image actually loads

---

## Next Steps

1. Begin Phase 1: Update branding, add Zod, create security module
2. Run initial type check and build to establish baseline
3. Create test infrastructure (Vitest config)
