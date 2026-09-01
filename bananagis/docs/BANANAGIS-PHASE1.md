# BananaGIS Phase 1 — Implementation Specification

## Objective
Create a working MVP for mapping and managing banana farms, growers, planting cycles, health observations, harvests, and dealers.

## Core entities
- BananaGrower (`BG-*`)
- BananaFarm (`BF-*`)
- BananaPlanting (`BP-*`)
- BananaHealth (`BH-*`)
- BananaHarvest (`BA-*`)
- BananaDealer (`BD-*`)

## Relationships
- Grower 1:N Farm
- Farm 1:N Planting
- Planting 1:N HealthObservation
- Planting 1:N Harvest
- Dealer 1:N Harvest

## MVP acceptance criteria
1. Farm polygons load as GeoJSON.
2. Farm popup exposes stable IDs and administrative fields.
3. Data model supports one grower with multiple farms and one farm with multiple planting cycles.
4. Health score is normalized 0–100.
5. Survey schema captures GPS/geometry, grower, farm, planting, health and photo fields.
6. Dashboard supports farm count and total area plus administrative filters.

## Next implementation step
Embed this module into the GeoLibre application shell, connect the map configuration to the actual map renderer, then add editable field forms and persistent storage.
