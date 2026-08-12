# Supertools

Supertools is a local Windows web application for diagnosing DNS, email, web, WordPress, network, SSL, and domain infrastructure from one dashboard.

**Tagline:** One input, complete results.

Built for:

- Network and systems administrators
- IT consultants
- DevOps and security engineers
- Developers troubleshooting infrastructure

Supertools replaces multiple browser tabs with a single, extensible diagnostic workspace. It runs locally and uses native Node.js capabilities wherever possible.

## Features

- DNS, mail, web, WordPress, network, SSL, and domain diagnostics
- Standardized API responses across all tools
- Responsive React dashboard with category navigation and search
- Light and dark themes with local persistence
- Browser-scoped history through optional Supabase integration
- JSON and CSV result export
- Passive, non-destructive web, WordPress, and SSL inspection
- Native Node.js tests and frontend production builds

## Technology Stack

| Layer | Technology |
|---|---|
| Operating system | Windows |
| Backend | Node.js 24 LTS, Express |
| Frontend | React, Vite, Shadcn/UI, Tailwind CSS |
| Package manager | npm or pnpm |
| Backend port | `3001` |
| Frontend port | `5173` |

## Project Structure

```text
supertools/
├── CLAUDE.md       Project requirements and implementation guide
├── CHECKLIST.md    Milestone and tool status
├── RULES.md        Mandatory coding rules
├── backend/        Express API and native tests
├── frontend/       React/Vite application
└── supabase/       Optional history schema
```

## Requirements

- Node.js 24 LTS
- npm or pnpm
- Windows development environment

## Installation

From the project root:

```powershell
npm install
npm --prefix backend install
npm --prefix frontend install
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Start backend and frontend together:

```powershell
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3001/health`

## Environment Variables

Backend configuration is stored in `backend/.env`:

```env
BACKEND_PORT=3001
NODE_ENV=development
DNS_TIMEOUT_MS=10000
HTTP_TIMEOUT_MS=15000
SMTP_TIMEOUT_MS=20000
TLS_TIMEOUT_MS=10000
TCP_TIMEOUT_MS=5000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=30
CACHE_TTL_DNS=300
CACHE_TTL_HTTP=60
CACHE_TTL_WHOIS=3600
IPAPI_KEY=
WHOISXML_KEY=
ABUSEIPDB_KEY=
```

Frontend configuration is stored in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Supertools
```

## Diagnostic Tools

All diagnostic endpoints use `POST` and accept a domain target.

### DNS

| Tool | Endpoint |
|---|---|
| DNS Lookup | `POST /api/dns/lookup` |
| DNS Propagation | `POST /api/dns/propagation` |
| DNS Record Inspector | `POST /api/dns/record-inspector` |
| DNSSEC Analyzer | `POST /api/dns/dnssec` |
| Nameserver Checker | `POST /api/dns/nameserver` |
| CNAME Chain | `POST /api/dns/cname-chain` |
| TTL Analyzer | `POST /api/dns/ttl` |
| Reverse DNS | `POST /api/dns/reverse` |
| IPv4 / IPv6 Check | `POST /api/dns/ipcheck` |
| Authoritative DNS | `POST /api/dns/authoritative` |

### Mail

| Tool | Endpoint |
|---|---|
| MX Lookup | `POST /api/mail/mx` |
| SMTP Test | `POST /api/mail/smtp-test` |
| SMTP Banner | `POST /api/mail/smtp-banner` |
| SPF Analyzer | `POST /api/mail/spf` |
| DKIM Analyzer | `POST /api/mail/dkim` |
| DMARC Analyzer | `POST /api/mail/dmarc` |
| PTR / Reverse DNS | `POST /api/mail/ptr` |
| TLS Check | `POST /api/mail/tls` |
| STARTTLS | `POST /api/mail/starttls` |
| Blacklist Check | `POST /api/mail/blacklist` |
| SMTP Connectivity | `POST /api/mail/connectivity` |

### Web

| Tool | Endpoint |
|---|---|
| HTTP Status | `POST /api/web/http-status` |
| Redirect Chain | `POST /api/web/redirect-chain` |
| SSL/TLS | `POST /api/web/ssl` |
| Certificate | `POST /api/web/certificate` |
| Security Headers | `POST /api/web/security-headers` |
| HTTP Headers | `POST /api/web/http-headers` |
| Compression | `POST /api/web/compression` |
| HTTP/2 | `POST /api/web/http2` |
| HTTP/3 | `POST /api/web/http3` |
| Response Time | `POST /api/web/response-time` |
| Server | `POST /api/web/server` |
| CDN | `POST /api/web/cdn` |
| Tech Stack | `POST /api/web/techstack` |
| WHOIS | `POST /api/web/whois` |

Web diagnostics use passive GET/HEAD inspection. They do not perform authentication, exploitation, or broad crawling.

### WordPress

| Tool | Endpoint |
|---|---|
| WordPress Version | `POST /api/wordpress/version` |
| PHP Version | `POST /api/wordpress/php` |
| Theme | `POST /api/wordpress/theme` |
| Plugins | `POST /api/wordpress/plugins` |
| REST API | `POST /api/wordpress/rest-api` |
| XML-RPC | `POST /api/wordpress/xmlrpc` |
| wp-login | `POST /api/wordpress/wp-login` |
| wp-json | `POST /api/wordpress/wp-json` |
| Security Headers | `POST /api/wordpress/security-headers` |
| Mixed Content | `POST /api/wordpress/mixed-content` |
| SSL | `POST /api/wordpress/ssl` |
| Performance | `POST /api/wordpress/performance` |
| Cache | `POST /api/wordpress/cache` |
| Database Hints | `POST /api/wordpress/db-hints` |
| Vulnerability Signals | `POST /api/wordpress/vuln-signals` |

WordPress diagnostics are passive. They do not attempt authentication or intrusive XML-RPC actions.

### Network

| Tool | Endpoint |
|---|---|
| Ping | `POST /api/network/ping` |
| TCP Port | `POST /api/network/tcp-port` |
| HTTP | `POST /api/network/http` |
| DNS | `POST /api/network/dns` |
| Traceroute | `POST /api/network/traceroute` |
| Reverse DNS | `POST /api/network/reverse` |
| ASN Lookup | `POST /api/network/asn` |
| IP Geolocation | `POST /api/network/ip-geo` |
| BGP | `POST /api/network/bgp` |
| Latency | `POST /api/network/latency` |

### SSL

| Tool | Endpoint |
|---|---|
| Certificate | `POST /api/ssl/certificate` |
| Issuer | `POST /api/ssl/issuer` |
| Expiration | `POST /api/ssl/expiration` |
| SAN | `POST /api/ssl/san` |
| Chain | `POST /api/ssl/chain` |
| TLS 1.2 | `POST /api/ssl/tls12` |
| TLS 1.3 | `POST /api/ssl/tls13` |
| Cipher | `POST /api/ssl/cipher` |
| OCSP | `POST /api/ssl/ocsp` |
| HSTS | `POST /api/ssl/hsts` |
| Certificate Transparency | `POST /api/ssl/ct` |

SSL diagnostics use passive TLS and HTTP inspection. OCSP and Certificate Transparency tools report available metadata and do not send active validation requests.

### Domain

| Tool | Endpoint |
|---|---|
| WHOIS | `POST /api/domain/whois` |
| Registrar | `POST /api/domain/registrar` |
| Registration | `POST /api/domain/registration` |
| Expiration | `POST /api/domain/expiration` |
| Nameserver | `POST /api/domain/nameserver` |
| Status | `POST /api/domain/status` |
| DNS | `POST /api/domain/dns` |
| ASN | `POST /api/domain/asn` |
| IP | `POST /api/domain/ip` |
| Hosting | `POST /api/domain/hosting` |

### Tech Stack

| Tool | Endpoint |
|---|---|
| Tech Stack Detection | `POST /api/techstack/detect` |

Signals may include CMS, framework, server, CDN, analytics, payment gateway, chat widget, tag manager, font provider, and JavaScript libraries.

## API Response Format

Every endpoint returns the same response structure.

Success:

```json
{
  "success": true,
  "tool": "dns-lookup",
  "target": "example.com",
  "duration": 142,
  "data": {},
  "error": null
}
```

Error:

```json
{
  "success": false,
  "tool": "dns-lookup",
  "target": "example.com",
  "duration": 38,
  "data": null,
  "error": {
    "code": "DNS_TIMEOUT",
    "message": "Request timed out"
  }
}
```

HTTP status conventions:

- `200` — successful or partial result
- `400` — invalid target or request
- `422` — valid request, diagnostic execution failed
- `429` — rate limit exceeded
- `500` — unexpected server error

## Supabase History

History is optional. To enable it:

1. Open the Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Add the Supabase project URL and anonymous key to `frontend/.env`.

History uses an anonymous browser ID stored in `localStorage`. It is a browser capability identifier, not strong authentication.

## Testing and Build

Run backend tests:

```powershell
npm --prefix backend test
```

Run focused category tests when available:

```powershell
node --test backend/test-web.js backend/test-wordpress.js backend/test-ssl.js
```

Build the frontend:

```powershell
npm --prefix frontend run build
```

Use `npm run dev` for end-to-end smoke testing. Results can be exported from the UI as JSON or CSV, and the selected light/dark theme persists in the browser.

## Development Guidelines

- Read `CLAUDE.md`, `CHECKLIST.md`, and `RULES.md` before changing code.
- Keep one service file per diagnostic tool.
- Use `validateTarget` and rate limiting on every API route.
- Use `run(target, options = {})` for every service.
- Use `useTool` in frontend pages; do not call `fetch` directly from page components.
- Prefer Node.js built-ins before adding dependencies.
- Keep timeouts and configuration in environment variables.
- Never commit `.env`, `node_modules`, logs, or build output.
