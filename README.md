# Supertools

MVP diagnostik domain lokal: DNS/IP, HTTP status, SSL certificate, WHOIS, dan Network Connectivity.

Fitur lanjutan: hasil visual per tool, export JSON/CSV, dark mode, pencarian per kategori, dan native Node.js tests.

## Setup

Prasyarat: Node.js 24 LTS.

```powershell
npm install
npm --prefix backend install
npm --prefix frontend install
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
npm run dev
```

Buka `http://localhost:5173`.

## Supabase

1. Buka Supabase SQL Editor.
2. Jalankan `supabase/schema.sql`.
3. Isi `frontend/.env` dengan project URL dan anon key.

Riwayat memakai anonymous browser ID dari `localStorage`. Tanpa login, ID itu menjadi capability token; jangan anggap sebagai autentikasi kuat.

## Endpoint

- `POST /api/dns/lookup`
- `POST /api/web/http-status`
- `POST /api/ssl/certificate`
- `POST /api/domain/whois`
- `POST /api/network/connectivity`

Body semua endpoint: `{ "target": "example.com" }`.

## Test dan build

```powershell
npm --prefix backend test
npm --prefix frontend run build
```

Hasil tool dapat diunduh dari halaman hasil dalam JSON atau CSV. Tombol tema menyimpan pilihan light/dark di browser.
