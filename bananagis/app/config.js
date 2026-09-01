// Production: leave empty when the web app and API are served by the same BananaGIS server.
// Remote API: set to the API origin, e.g. https://banana-api.example.com
window.BANANAGIS_API_URL = window.BANANAGIS_API_URL || (location.protocol === 'http:' || location.protocol === 'https:' ? location.origin : '');
