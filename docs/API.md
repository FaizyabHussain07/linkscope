# LinkScope API Documentation

## Base URL

```
https://linkscope.faizyab.me/api/v1
```

For self-hosted instances, replace with your deployment URL.

## Authentication

No authentication required for public API access. Rate limiting may apply.

## Endpoints

### GET /health

Check if the API is healthy.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

### POST /inspect

Inspect a single URL for metadata.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "url": "https://example.com",
  "fetchedAt": "2026-01-01T00:00:00.000Z",
  "metadata": {
    "title": "Example Title",
    "description": "Example description",
    "ogTitle": "Open Graph Title",
    "ogDescription": "Open Graph description",
    "ogImage": "https://example.com/image.jpg",
    "ogType": "website",
    "ogUrl": "https://example.com",
    "ogSiteName": "Example Site",
    "ogLocale": "en_US",
    "twitterCard": "summary_large_image",
    "twitterTitle": "Twitter Title",
    "twitterDescription": "Twitter description",
    "twitterImage": "https://example.com/image.jpg",
    "canonical": "https://example.com/page",
    "favicon": "https://example.com/favicon.ico",
    "language": "en",
    "viewport": "width=device-width, initial-scale=1",
    "duplicates": [],
    "emptyTags": [],
    "missingRequired": [],
    "warnings": []
  },
  "audit": {
    "score": 85,
    "maxScore": 100,
    "categoryScores": [
      { "name": "SEO", "score": 20, "maxScore": 25, "weight": 25 },
      { "name": "OpenGraph", "score": 30, "maxScore": 35, "weight": 35 },
      { "name": "Twitter", "score": 18, "maxScore": 20, "weight": 20 },
      { "name": "Technical", "score": 17, "maxScore": 20, "weight": 20 }
    ],
    "findings": [],
    "passed": [],
    "failed": [],
    "recommendations": []
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "url": "https://example.com",
  "fetchedAt": "2026-01-01T00:00:00.000Z"
}
```

---

### POST /bulk

Inspect multiple URLs (bulk operation).

**Request Body:**
```json
{
  "urls": [
    "https://example.com",
    "https://example.org"
  ],
  "concurrency": 2
}
```

**Response:**
```json
{
  "timestamp": "2026-01-01T00:00:00.000Z",
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "withMetadata": 2,
    "withoutMetadata": 0
  },
  "results": [
    {
      "url": "https://example.com",
      "success": true,
      "metadata": {},
      "audit": {}
    }
  ]
}
```

---

### POST /compare

Compare metadata between multiple URLs.

**Request Body:**
```json
{
  "urls": [
    "https://example.com",
    "https://example.org"
  ]
}
```

**Response:**
```json
{
  "urls": ["https://example.com", "https://example.org"],
  "comparison": [
    {
      "field": "title",
      "label": "Title",
      "values": [
        { "url": "https://example.com", "value": "Example Title" },
        { "url": "https://example.org", "value": "Different Title" }
      ],
      "hasDifferences": true,
      "status": "different"
    }
  ],
  "summary": {
    "totalFields": 10,
    "identicalFields": 5,
    "differentFields": 3,
    "missingFields": 2,
    "overallSimilarity": 50
  }
}
```

---

### POST /image-inspect

Inspect an image for metadata and validity.

**Request Body:**
```json
{
  "url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "url": "https://example.com/image.jpg",
  "accessible": true,
  "status": 200,
  "mimeType": "image/jpeg",
  "format": "jpeg",
  "width": 1200,
  "height": 630,
  "aspectRatio": 1.905,
  "fileSize": 123456,
  "fileSizeHuman": "120.6 KB",
  "recommendations": []
}
```

---

### POST /generate

Generate metadata code for various platforms.

**Request Body:**
```json
{
  "title": "Page Title",
  "description": "Page description",
  "canonicalUrl": "https://example.com/page",
  "imageUrl": "https://example.com/image.jpg",
  "siteName": "Example Site",
  "twitterCardType": "summary_large_image",
  "locale": "en_US"
}
```

**Response:**
```json
{
  "html": "<meta property=\"og:title\" content=\"Page Title\">...",
  "nextjsDynamic": "export async function generateMetadata() {...}",
  "nextjsStatic": "export const metadata = {...}",
  "react": "...",
  "openGraph": ["<meta property=\"og:title\" content=\"Page Title\">", ...],
  "twitterCards": ["<meta name=\"twitter:card\" content=\"summary_large_image\">", ...]
}
```

## Error Codes

| Status | Description |
|--------|-------------|
| 400 | Invalid request (bad URL, missing field) |
| 403 | URL blocked (SSRF protection, private IP, etc.) |
| 422 | URL validation failed |
| 429 | Rate limited |
| 500 | Internal server error |
| 504 | Request timeout |

## Rate Limiting

Public API may have rate limits. Self-hosted instances can configure limits via environment variables.

## Security

All endpoints validate URLs against SSRF attacks. See [SECURITY.md](SECURITY.md) for details.

Do not attempt to bypass security controls. Any abuse will result in IP blocking.
