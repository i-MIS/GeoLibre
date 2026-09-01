# BananaGIS Phase 1

Banana Smart Farm & Intelligence Platform — MVP integrated with GeoLibre.

## Phase 1 scope
- Banana farm polygons
- Grower and planting-cycle records
- Farm health observations
- Harvest records
- Dealer/collection points
- Web map configuration
- Field survey schema
- Sample data for Thailand

## Design principles
1. Stable IDs and relationships from day one.
2. GeoJSON-compatible data for GeoLibre/open web GIS.
3. ArcGIS Enterprise-compatible field names and domains.
4. No dependency on proprietary services for the core data model.
5. Ready for later Drone/Remote Sensing/AI modules.

## Relationship model
`Grower 1:N Farm 1:N PlantingCycle 1:N HealthObservation`

`PlantingCycle 1:N Harvest`

`Dealer 1:N Harvest`

See `schema/banana-schema.json` and `survey/banana-field-survey.json`.
