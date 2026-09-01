# BananaGIS Phase 1 Deployment

## API on a server

Requirements: Docker + Docker Compose.

```bash
cd bananagis
docker compose up -d --build
curl http://localhost:8787/health
```

The farm data is persisted in `bananagis/api/data/farms.json` through the mounted volume.

## Connect the web app

Edit `bananagis/app/config.js` and set:

```js
window.BANANAGIS_API_URL = 'https://YOUR-API-DOMAIN';
```

Serve `bananagis/app/` over HTTPS. Browser GPS requires a secure context (HTTPS, or localhost during development).

## Production checklist

- Put the API behind HTTPS/reverse proxy.
- Set a specific `CORS_ORIGIN` instead of `*`.
- Add authentication/authorization before exposing write endpoints to multiple users.
- Back up `api/data/farms.json`, or migrate the persistence layer to PostgreSQL/PostGIS or ArcGIS Feature Service.
- Do not put secrets in frontend files.

## Current scope

This deployment is suitable for pilot/single-server use. It is not yet a hardened multi-user production service because authentication, rate limiting, audit logging, and database-level concurrency controls are not included.
