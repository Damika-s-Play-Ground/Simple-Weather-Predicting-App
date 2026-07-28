import { useState, useEffect, useRef } from "react";
import { fetchWeatherByQuery, isWeatherApiConfigured } from "../api/weather";

// Owns all weather data state and the actions that mutate it. Components stay
// presentational and read from the values this hook returns.
export default function useWeather(defaultCity = "London") {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  // Monotonic id of the most recent request; responses from older requests are
  // ignored so a slow earlier lookup can't overwrite a newer one.
  const latestRequestId = useRef(0);
  // The most recent lookup, so "refresh" can repeat it (city or coordinates).
  const lastQuery = useRef(null);

  // Persist the resolved city, most-recent first, deduped (case-insensitive),
  // capped at 5.
  const addRecentSearch = (cityName) => {
    if (!cityName) return;
    setRecentSearches((prev) => {
      const next = [
        cityName,
        ...prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase()),
      ].slice(0, 5);
      try {
        localStorage.setItem("recentSearches", JSON.stringify(next));
      } catch {
        // Ignore storage errors (e.g. private mode / quota).
      }
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch {
      // Ignore storage errors (e.g. private mode / quota).
    }
  };

  // Shared request/response handling for both city and coordinate lookups.
  const loadByQuery = async (query, notFoundMessage) => {
    if (!isWeatherApiConfigured()) {
      setError(
        "Weather service is not configured: the VITE_OWM_KEY environment variable is missing. See the README for setup."
      );
      setForecast([]);
      setHourly([]);
      return;
    }

    lastQuery.current = { query, notFoundMessage };
    const requestId = ++latestRequestId.current;
    const isStale = () => requestId !== latestRequestId.current;

    setLoading(true);
    setError("");
    try {
      const {
        current: data,
        forecast: days,
        hourly: hours,
      } = await fetchWeatherByQuery(query);
      if (isStale()) return; // A newer request superseded this one.
      setCurrent(data);
      setForecast(days);
      setHourly(hours);
      setLastUpdated(Date.now());
      addRecentSearch(data.city);
    } catch (err) {
      if (isStale()) return;
      setError(notFoundMessage);
      setForecast([]);
      setHourly([]);
      console.log(err);
    } finally {
      if (!isStale()) setLoading(false);
    }
  };

  const searchCity = (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }
    loadByQuery(
      `q=${encodeURIComponent(trimmedCity)}`,
      `Could not find weather for "${trimmedCity}". Please check the city name and try again.`
    );
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadByQuery(
          `lat=${latitude}&lon=${longitude}`,
          "Could not get weather for your location. Please try searching by city."
        );
      },
      (err) => {
        setLoading(false);
        setError(
          "Could not access your location. Please allow location access or search by city."
        );
        console.log(err);
      }
    );
  };

  // Re-run the most recent successful lookup to get fresh data.
  const refresh = () => {
    if (lastQuery.current) {
      loadByQuery(lastQuery.current.query, lastQuery.current.notFoundMessage);
    }
  };

  useEffect(() => {
    searchCity(defaultCity); // Load a default city once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    current,
    forecast,
    hourly,
    loading,
    error,
    recentSearches,
    lastUpdated,
    searchCity,
    useMyLocation,
    clearRecentSearches,
    refresh,
  };
}
