// WindNow — wind speed & forecast using the free Open-Meteo API (no key required).
// Endpoints:
//   Geocoding: https://geocoding-api.open-meteo.com/v1/search
//   Forecast:  https://api.open-meteo.com/v1/forecast

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Unit handling. Open-Meteo returns wind in km/h by default; we convert client-side
// so switching units never needs another network request.
const UNITS = {
  kmh: { label: "km/h", factor: 1 },
  ms: { label: "m/s", factor: 1 / 3.6 },
  mph: { label: "mph", factor: 0.621371 },
  kn: { label: "knots", factor: 0.539957 },
};

const el = (id) => document.getElementById(id);
let lastData = null; // cache last forecast so unit changes re-render instantly
let lastPlace = "";

// ---- Helpers ----------------------------------------------------------------

function convert(kmh) {
  const unit = el("unit-select").value;
  return kmh * UNITS[unit].factor;
}

function unitLabel() {
  return UNITS[el("unit-select").value].label;
}

function fmt(kmh) {
  return Math.round(convert(kmh));
}

// Compass direction from degrees (meteorological: direction wind comes FROM).
function compass(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Beaufort scale description — based on km/h thresholds.
function beaufort(kmh) {
  const scale = [
    [1, "Calm"], [6, "Light air"], [12, "Light breeze"], [20, "Gentle breeze"],
    [29, "Moderate breeze"], [39, "Fresh breeze"], [50, "Strong breeze"],
    [62, "Near gale"], [75, "Gale"], [89, "Strong gale"], [103, "Storm"],
    [118, "Violent storm"], [Infinity, "Hurricane"],
  ];
  for (const [max, name] of scale) {
    if (kmh < max) return name;
  }
  return "Hurricane";
}

function setStatus(msg, isError = false) {
  const s = el("status");
  s.textContent = msg;
  s.hidden = !msg;
  s.classList.toggle("error", isError);
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

// ---- Geocoding & suggestions ------------------------------------------------

let suggestTimer = null;

function clearSuggestions() {
  const list = el("suggestions");
  list.innerHTML = "";
  list.hidden = true;
}

el("search-input").addEventListener("input", (e) => {
  const q = e.target.value.trim();
  clearTimeout(suggestTimer);
  if (q.length < 2) return clearSuggestions();
  suggestTimer = setTimeout(() => showSuggestions(q), 250);
});

async function showSuggestions(q) {
  try {
    const data = await fetchJSON(
      `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    );
    const list = el("suggestions");
    list.innerHTML = "";
    if (!data.results || data.results.length === 0) {
      return clearSuggestions();
    }
    for (const r of data.results) {
      const li = document.createElement("li");
      const region = [r.admin1, r.country].filter(Boolean).join(", ");
      li.innerHTML = `${r.name} <small>${region}</small>`;
      li.addEventListener("click", () => {
        el("search-input").value = r.name;
        clearSuggestions();
        loadForecast(r.latitude, r.longitude, formatPlace(r));
      });
      list.appendChild(li);
    }
    list.hidden = false;
  } catch (err) {
    clearSuggestions();
  }
}

function formatPlace(r) {
  return [r.name, r.admin1, r.country].filter(Boolean).join(", ");
}

// ---- Search & geolocation ---------------------------------------------------

el("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearSuggestions();
  const q = el("search-input").value.trim();
  if (!q) return;
  setStatus(`Searching for “${q}”…`);
  try {
    const data = await fetchJSON(
      `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=1&language=en&format=json`
    );
    if (!data.results || data.results.length === 0) {
      return setStatus(`No location found for “${q}”.`, true);
    }
    const r = data.results[0];
    loadForecast(r.latitude, r.longitude, formatPlace(r));
  } catch (err) {
    setStatus("Could not search right now. Check your connection.", true);
  }
});

el("geo-btn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return setStatus("Geolocation isn’t supported by this browser.", true);
  }
  setStatus("Getting your location…");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      loadForecast(latitude, longitude, "Your location");
    },
    () => setStatus("Location permission denied. Try searching instead.", true),
    { timeout: 10000 }
  );
});

el("unit-select").addEventListener("change", () => {
  if (lastData) render(lastData, lastPlace);
});

// ---- Forecast ---------------------------------------------------------------

async function loadForecast(lat, lon, placeName) {
  setStatus("Loading wind data…");
  try {
    const url =
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m` +
      `&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m` +
      `&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant` +
      `&wind_speed_unit=kmh&timezone=auto&forecast_days=7`;
    const data = await fetchJSON(url);
    lastData = data;
    lastPlace = placeName;
    setStatus("");
    render(data, placeName);
  } catch (err) {
    setStatus("Could not load wind data. Please try again.", true);
  }
}

function render(data, placeName) {
  renderCurrent(data, placeName);
  renderHourly(data);
  renderDaily(data);
}

function renderCurrent(data, placeName) {
  const c = data.current;
  el("place-name").textContent = placeName;
  el("wind-speed").textContent = fmt(c.wind_speed_10m);
  el("wind-gust").textContent = fmt(c.wind_gusts_10m);
  el("speed-unit").textContent = unitLabel();
  el("wind-dir").textContent = `${compass(c.wind_direction_10m)} (${Math.round(c.wind_direction_10m)}°)`;
  el("beaufort").textContent = beaufort(c.wind_speed_10m);
  document.querySelectorAll(".metric small").forEach((s) => {
    if (s.id !== "speed-unit") s.textContent = unitLabel();
  });

  // Arrow points in the direction the wind is blowing TOWARD.
  const arrow = el("wind-arrow");
  arrow.style.transform = `rotate(${c.wind_direction_10m + 180}deg)`;

  const t = new Date(c.time);
  el("updated").textContent = "Updated " + t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  el("current").hidden = false;
}

function renderHourly(data) {
  const h = data.hourly;
  const now = Date.now();
  const container = el("hourly-list");
  container.innerHTML = "";

  // Find the first hourly index at or after the current time, show next 24.
  let start = h.time.findIndex((t) => new Date(t).getTime() >= now);
  if (start < 0) start = 0;

  for (let i = start; i < Math.min(start + 24, h.time.length); i++) {
    const time = new Date(h.time[i]);
    const div = document.createElement("div");
    div.className = "hour";
    const arrowDeg = h.wind_direction_10m[i] + 180;
    div.innerHTML =
      `<div class="t">${time.toLocaleTimeString([], { hour: "2-digit" })}</div>` +
      `<div class="a" style="transform:rotate(${arrowDeg}deg)">↑</div>` +
      `<div class="v">${fmt(h.wind_speed_10m[i])}</div>` +
      `<div class="g">gust ${fmt(h.wind_gusts_10m[i])}</div>`;
    container.appendChild(div);
  }
  el("hourly").hidden = false;
}

function renderDaily(data) {
  const d = data.daily;
  const container = el("daily-list");
  container.innerHTML = "";
  const u = unitLabel();

  for (let i = 0; i < d.time.length; i++) {
    const date = new Date(d.time[i]);
    const name = i === 0 ? "Today" : date.toLocaleDateString([], { weekday: "short" });
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML =
      `<div class="name">${name}</div>` +
      `<div><span class="label">Max wind</span><br><span class="big">${fmt(d.wind_speed_10m_max[i])}</span> <small>${u}</small></div>` +
      `<div class="label-min"><span class="label">Max gust</span><br><span class="big">${fmt(d.wind_gusts_10m_max[i])}</span> <small>${u}</small></div>` +
      `<div class="a" title="Dominant direction">${compass(d.wind_direction_10m_dominant[i])}</div>`;
    container.appendChild(div);
  }
  el("daily").hidden = false;
}

// Hide suggestions when clicking elsewhere.
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search") && !e.target.closest(".suggestions")) {
    clearSuggestions();
  }
});
