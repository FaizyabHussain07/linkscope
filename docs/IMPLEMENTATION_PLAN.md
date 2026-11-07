# LinkScope — Implementation Plan

## Phase 1: Foundation & Security

### 1.1 Update Branding

Replace all instances of "LinkPreview" with "LinkScope":

- Package name in `package.json`
- README.md
- All UI text references
- Remove hardcoded GitHub repo references
- Remove external tracking script from layout
- Update site URL references

### 1.2 Add Dependencies

```bash
bun add zod
bun add -d vitest @playwright/test
```

### 1.3 Create Type Definitions

New file: `types/metadata.ts`
- `MetaData` interface (enhanced)
- `ExtractResult` type
- `AuditFinding` type
- `ScoreBreakdown` type

New file: `types/api.ts`
- Request/response schemas for each endpoint
- Zod schemas for validation

New file: `types/security.ts`
- Security config types
- Blocked IP types

### 1.4 Create Configuration

New file: `config/index.ts`
- App name, version
- Default limits (timeout, size, redirects)
- Feature flags
- Environment variable loading

### 1.5 Create Security Module

New directory: `lib/security/`

**`lib/security/ip-validator.ts`**
- IPv4/IPv6 parsing
- Private IP range checking (RFC 1918, loopback, link-local, etc.)
- Cloud metadata IP blocking (169.254.169.254)
- Reserved address checking

**`lib/security/url-validator.ts`**
- Scheme validation (HTTP/HTTPS only)
- Credential rejection
- Hostname validation
- Port validation
- URL normalization

**`lib/security/fetch.ts`**
- Secure fetch wrapper
- DNS resolution and IP validation
- Redirect validation
- Timeout enforcement
- Size limiting
- Content-Type validation
- User-Agent enforcement

**`lib/security/index.ts`**
- Re-exports
- `validateUrl()` — Full URL security validation
- `secureFetch()` — Secure fetch function

### 1.6 Set Up Testing

New file: `vitest.config.ts`
- Vitest configuration
- Test environment setup

New directory: `tests/`
- `tests/unit/` — Unit tests
- `tests/integration/` — Integration tests
- `tests/security/` — Security tests

---

## Phase 2: Metadata Extraction Engine

### 2.1 Create Extractor Module

New directory: `lib/extractors/`

**`lib/extractors/open-graph.ts`**
- Extract all OG tags
- Handle duplicates
- Normalize values

**`lib/extractors/twitter.ts`**
- Extract all Twitter Card tags
- Handle duplicates

**`lib/extractors/seo.ts`**
- Extract title, description, canonical
- Extract robots, viewport, language
- Extract favicon, links

**`lib/extractors/index.ts`**
- `extractMetadata(html, baseUrl)` — Main extraction function
- Combines all extractors
- Returns structured result

### 2.2 Enhance Metadata Type

Add:
- `ogImageSecureUrl?`
- `ogImageWidth?`
- `ogImageHeight?`
- `ogImageAlt?`
- `twitterImageAlt?`
- `duplicateTags` — detected duplicates
- `emptyTags` — detected empty values
- `rawTags` — all raw meta/link tags

### 2.3 Relative URL Resolution

Ensure all relative URLs (images, canonical, etc.) are resolved against the page URL.

---

## Phase 3: Audit & Scoring

### 3.1 Create Audit Engine

New directory: `lib/analyzers/`

**`lib/analyzers/audit.ts`**
- Check for missing required tags
- Check for empty values
- Check for duplicates
- Check for invalid values
- Check for length issues
- Check for consistency between OG/Twitter/SEO

**`lib/analyzers/recommendations.ts`**
- Generate actionable recommendations
- Prioritize critical issues

### 3.2 Create Scoring Engine

New directory: `lib/scoring/`

**`lib/scoring/index.ts`**
- Documented scoring weights
- Category scores (SEO, Open Graph, Twitter, Technical)
- Overall score
- Deterministic calculation

### 3.3 Audit UI

New directory: `components/audit/`

**`components/audit/audit-panel.tsx`**
- Score display (enhanced)
- Category breakdown
- Findings list
- Recommendations list
- Passed checks

---

## Phase 4: Image Inspector

### 4.1 Server-Side Image Validation

New endpoint: `POST /api/v1/image-inspect`

**`lib/fetcher/image.ts`** (or extend fetcher)
- Fetch image with security checks
- Detect MIME type from headers
- Read dimensions (using Sharp if available, else header parsing)
- Get file size from headers
- Validate format

### 4.2 Image Inspector UI

New directory: `components/image-inspector/`

**`components/image-inspector/image-inspector.tsx`**
- Image preview
- Dimensions display
- Format detection
- File size
- MIME type
- Recommended dimensions comparison
- Accessibility warnings

---

## Phase 5: Metadata Generator

### 5.1 Enhance HTML Generator

Existing: `components/metadata/html-generator.ts`
- Add missing tag types
- Add validation
- Add copy button integration

### 5.2 Add Next.js Generator

New file: `lib/exports/nextjs-generator.ts`
- Next.js App Router Metadata API
- `generateMetadata()` function
- Static metadata object

### 5.3 Add React Generator

New file: `lib/exports/react-generator.ts`
- React Helmet-style meta tags
- Framework-agnostic HTML

### 5.4 Generator UI

New directory: `components/generator/`

**`components/generator/metadata-generator.tsx`**
- Input form (title, description, image, etc.)
- Live preview
- Tabbed output (HTML, Next.js, React)
- Copy buttons

---

## Phase 6: Bulk & Compare

### 6.1 Bulk Inspection

New endpoint: `POST /api/v1/bulk`
- Accept array of URLs
- Configurable concurrency limit
- Per-URL results with success/failure
- Aggregate summary

### 6.2 Comparison

New endpoint: `POST /api/v1/compare`
- Accept 2+ URLs
- Compare metadata fields
- Highlight differences
- Show missing/extra fields

### 6.3 Bulk UI

New directory: `components/bulk/`

**`components/bulk/bulk-inspector.tsx`**
- Multi-URL input
- Progress display
- Results table
- Export button

### 6.4 Compare UI

New directory: `components/compare/`

**`components/compare/comparison-view.tsx`**
- Side-by-side comparison
- Diff highlighting
- Missing field indicators

---

## Phase 7: Exports

### 7.1 Export Utilities

New directory: `lib/exports/`

**`lib/exports/json.ts`** — JSON formatting
**`lib/exports/csv.ts`** — CSV generation
**`lib/exports/html-report.ts`** — Printable HTML report
**`lib/exports/index.ts`** — Re-exports

### 7.2 Export UI

New directory: `components/exports/`

**`components/exports/export-bar.tsx`**
- JSON download button
- CSV download button
- HTML report button
- Copy to clipboard

---

## Phase 8: Documentation & Testing

### 8.1 Documentation Files

- `README.md` — Complete rewrite
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `docs/API.md`
- `.env.example`

### 8.2 Unit Tests

- Metadata extraction tests
- URL validation tests
- Scoring tests
- Recommendation tests
- Generator tests

### 8.3 Integration Tests

- API endpoint tests
- Successful inspection
- Error handling
- Redirect handling

### 8.4 Security Tests

- Localhost rejection
- Private IP rejection
- Redirect SSRF tests
- Scheme validation tests

### 8.5 E2E Tests

- Homepage load
- URL submission flow
- Preview switching
- Metadata display
- Error states

---

## Phase 9: Polish & Release

### 9.1 Accessibility
- Keyboard navigation
- ARIA attributes
- Focus management
- Color contrast

### 9.2 Responsive Design
- Mobile layout
- Tablet layout
- Touch targets

### 9.3 Performance
- Bundle size check
- Image optimization
- Code splitting

### 9.4 Final Security Review
- All endpoints validated
- No secret leakage
- Error messages sanitized

### 9.5 Release
- Version bump
- Changelog
- Tag release
