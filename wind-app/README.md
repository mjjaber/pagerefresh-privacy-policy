# 💨 WindNow

A tiny, dependency-free web app that shows the **current wind speed** and a
**wind forecast** (next 24 hours + 7-day outlook) for any location.

- **No API key, no sign-up, no build step.** Just open `index.html`.
- **Free data** from [Open-Meteo](https://open-meteo.com/).
- Search any city, or use your device's location (📍).
- Switch units between km/h, m/s, mph, and knots.

## What it shows

- Current temperature and "feels like" (apparent) temperature
- Current wind speed, gusts, and direction (with a rotating compass arrow)
- Beaufort-scale description (e.g. "Fresh breeze")
- Hourly temperature + wind for the next 24 hours
- Daily high/low temperature, max wind, max gust, and dominant direction for 7 days
- Unit toggles: wind (km/h, m/s, mph, knots) and temperature (°C / °F)

## Running it

Because browsers block `fetch` from `file://` pages in some cases, the most
reliable way is to serve the folder over HTTP:

```bash
cd wind-app
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly usually works too, since Open-Meteo allows
cross-origin requests.

## APIs used (both free, no key)

| Purpose      | Endpoint                                          |
|--------------|---------------------------------------------------|
| City search  | `https://geocoding-api.open-meteo.com/v1/search`  |
| Wind data    | `https://api.open-meteo.com/v1/forecast`          |

## Files

- `index.html` — markup
- `styles.css` — styling
- `app.js` — logic (geocoding, fetching, rendering, unit conversion)
