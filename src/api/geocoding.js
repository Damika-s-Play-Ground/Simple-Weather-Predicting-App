import axios from "axios";

const GEO_BASE = "https://api.openweathermap.org/geo/1.0";

// City suggestions for an autocomplete query. Returns up to `limit`
// {name, state, country, lat, lon}; empty for blank/too-short queries.
export const fetchCitySuggestions = async (query, limit = 5) => {
  const trimmed = (query || "").trim();
  if (trimmed.length < 2 || !import.meta.env.VITE_OWM_KEY) return [];

  const { data } = await axios.get(
    `${GEO_BASE}/direct?q=${encodeURIComponent(trimmed)}&limit=${limit}&appid=${
      import.meta.env.VITE_OWM_KEY
    }`
  );
  if (!Array.isArray(data)) return [];
  return data.map((place) => ({
    name: place.name,
    state: place.state || "",
    country: place.country || "",
    lat: place.lat,
    lon: place.lon,
  }));
};

// Human-readable label for a suggestion: "London, England, GB".
export const suggestionLabel = ({ name, state, country }) =>
  [name, state, country].filter(Boolean).join(", ");
