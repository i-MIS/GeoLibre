# BananaGIS API / Web Server

## Run with Node.js 20+

```bash
npm start
```

Open `http://localhost:8787/` for the BananaGIS web app.

Health check: `http://localhost:8787/health`

## Run with Docker

```bash
docker compose -f docker-compose.yml up -d --build
```

The application is available at `http://localhost:8787/`. Data is persisted in the `bananagis_data` Docker volume.

## API

- `GET /api/farms`
- `GET /api/farms/:farm_id`
- `POST /api/farms`
- `PUT /api/farms/:farm_id`
- `DELETE /api/farms/:farm_id`

## Production note

The current persistent store is a JSON file and is appropriate for a small single-instance MVP. Before public multi-user deployment, put HTTPS/reverse proxy and authentication/authorization in front of the service and migrate the datastore to PostgreSQL/PostGIS.
