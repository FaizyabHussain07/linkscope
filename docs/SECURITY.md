# Security Policy

## Overview

LinkScope takes security seriously. This document outlines our security practices, what we protect against, and how to report vulnerabilities.

## Security Features

### SSRF Protection

All URL fetching is protected against Server-Side Request Forgery (SSRF) attacks:

- **Protocol validation**: Only HTTP and HTTPS URLs are accepted
- **Credential rejection**: URLs with embedded credentials are rejected
- **IP validation**: All resolved IPs are checked against blocked ranges
- **Private IP blocking**: RFC 1918 private ranges are blocked
- **Loopback blocking**: localhost and loopback addresses are blocked
- **Cloud metadata blocking**: 169.254.169.254 and similar endpoints are blocked
- **IPv6 support**: IPv6 addresses are validated with the same protections
- **Redirect validation**: Each redirect destination is validated

### Request Limits

- **Timeout**: Requests timeout after 30 seconds (configurable)
- **Size limit**: Response body limited to 10MB (configurable)
- **Redirect limit**: Maximum 5 redirects followed
- **Content-Type validation**: Only expected content types are accepted

### Data Privacy

- **No persistence**: Inspected URLs, HTML, and results are not stored
- **No database**: LinkScope requires no database
- **No tracking**: No user tracking or analytics by default
- **Local storage only**: Optional browser-local storage for preferences

## Blocked IP Ranges

The following IP ranges are blocked by default:

### IPv4
- 127.0.0.0/8 (Loopback)
- 10.0.0.0/8 (Private)
- 172.16.0.0/12 (Private)
- 192.168.0.0/16 (Private)
- 169.254.0.0/16 (Link-local)
- 169.254.169.254/32 (Cloud metadata)
- 0.0.0.0/8 (Reserved)
- 224.0.0.0/4 (Multicast)
- 192.0.2.0/24 (Documentation)
- 198.51.100.0/24 (Documentation)
- 203.0.113.0/24 (Documentation)

### IPv6
- ::1/128 (Loopback)
- fe80::/10 (Link-local)
- fc00::/7 (Unique local)
- ff00::/8 (Multicast)
- 2001:db8::/32 (Documentation)

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public issue
2. Email us at security@linkscope.faizyab.me (or use GitHub's private vulnerability reporting)
3. Include a description of the vulnerability and steps to reproduce
4. Allow reasonable time for a fix before disclosure

## Self-Hosting Security

When self-hosting LinkScope:

1. Keep your deployment updated
2. Configure environment variables properly
3. Use HTTPS in production
4. Consider rate limiting at the reverse proxy level
5. Never expose internal services through LinkScope

## Environment Variables

See `.env.example` for configurable security settings:

- `INSPECTION_TIMEOUT_MS`: Request timeout
- `INSPECTION_MAX_SIZE_BYTES`: Maximum response size
- `INSPECTION_MAX_REDIRECTS`: Maximum redirects to follow
- `BLOCKED_HOSTS`: Additional hosts to block
