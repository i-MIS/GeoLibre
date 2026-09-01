# BananaGIS Data API

This repository includes a deployment-ready API contract for persistent farm data.

## Current deployment target

The API is designed for a serverless JSON store and uses a simple REST contract:

- `GET /api/farms` — list farms
- `POST /api/farms` — create farm
- `PUT /api/farms/:farm_id` — update farm
- `DELETE /api/farms/:farm_id` — delete farm

The frontend can use `BANANAGIS_API_URL` to point to the deployed API. Until an API URL is configured, the application uses IndexedDB locally and exports GeoJSON.

## Production requirement

Deploy the API behind HTTPS and configure authentication before multi-user operational use. Do not put database credentials in frontend JavaScript.
