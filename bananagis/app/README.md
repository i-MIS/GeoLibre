# BananaGIS Web MVP

Open `index.html` through a static web server. The app loads the Phase 1 sample GeoJSON and provides:

- Interactive MapLibre map
- Banana farm polygons
- Farm popups
- Farm list with map zoom
- Farm count, total area and province count
- Province filter

## Local test

From the repository root:

```bash
python -m http.server 8080
```

Then open `/bananagis/app/` in the browser.

## Production

The app is intentionally static and can be hosted by GitHub Pages, Firebase Hosting, Netlify, or served from the GeoLibre web application shell.
