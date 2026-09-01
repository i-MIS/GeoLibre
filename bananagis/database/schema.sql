-- BananaGIS production schema: PostgreSQL + PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS banana_grower (
  grower_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS banana_farm (
  farm_id TEXT PRIMARY KEY,
  grower_id TEXT NOT NULL REFERENCES banana_grower(grower_id),
  province TEXT,
  amphoe TEXT,
  tambon TEXT,
  area_rai NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (area_rai >= 0),
  irrigation TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  geom geometry(MultiPolygon,4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS banana_farm_geom_gix ON banana_farm USING GIST(geom);
CREATE INDEX IF NOT EXISTS banana_farm_grower_idx ON banana_farm(grower_id);

CREATE TABLE IF NOT EXISTS banana_planting (
  planting_id TEXT PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES banana_farm(farm_id) ON DELETE CASCADE,
  variety TEXT NOT NULL,
  planting_date DATE,
  plant_count INTEGER NOT NULL DEFAULT 0 CHECK (plant_count >= 0),
  spacing_m NUMERIC(6,2),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS banana_planting_farm_idx ON banana_planting(farm_id);

CREATE TABLE IF NOT EXISTS banana_health (
  health_id TEXT PRIMARY KEY,
  planting_id TEXT NOT NULL REFERENCES banana_planting(planting_id) ON DELETE CASCADE,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  health_score NUMERIC(5,2) NOT NULL CHECK (health_score BETWEEN 0 AND 100),
  symptoms TEXT,
  photo_url TEXT
);

CREATE TABLE IF NOT EXISTS banana_dealer (
  dealer_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dealer_type TEXT,
  phone TEXT,
  address TEXT,
  geom geometry(Point,4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS banana_dealer_geom_gix ON banana_dealer USING GIST(geom);

CREATE TABLE IF NOT EXISTS banana_harvest (
  harvest_id TEXT PRIMARY KEY,
  planting_id TEXT NOT NULL REFERENCES banana_planting(planting_id) ON DELETE CASCADE,
  harvest_date DATE NOT NULL,
  quantity_ton NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (quantity_ton >= 0),
  dealer_id TEXT REFERENCES banana_dealer(dealer_id),
  price_baht_per_kg NUMERIC(12,2)
);
