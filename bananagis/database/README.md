# BananaGIS PostgreSQL/PostGIS

This is the production data layer for BananaGIS.

## Deploy

1. Copy `.env.example` to `.env`.
2. Set a long random `POSTGRES_PASSWORD` locally. Never commit `.env`.
3. Run `docker compose up -d`.
4. Verify with `docker compose ps` and `docker compose logs db`.
5. Connect with a PostgreSQL client to database `bananagis`.

The schema is initialized automatically on the first creation of the database volume.

## Important

This creates the database on the machine where Docker is run. GitHub stores the schema and source code, not your production records. Keep the database volume and backups on your controlled server.

Before Internet exposure, restrict port 5432 to the private network/firewall. The browser must never connect directly to PostgreSQL; only the API should access it.
