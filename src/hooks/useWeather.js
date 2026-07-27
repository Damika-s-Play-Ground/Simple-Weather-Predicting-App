import { useState, useEffect } from "react";
import { fetchWeatherByQuery } from "../api/weather";

// Owns all weather data state and the actions that mutate it. Components stay
// presentational and read from the values this hook returns.
export default function useWeather(defaultCity = "London") {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
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

  // Shared request/response handling for both city and coordinate lookups.
  const loadByQuery = async (query, notFoundMessage) => {
    setLoading(true);
    setError("");
    try {
      const { current: data, forecast: days } =
        await fetchWeatherByQuery(query);
      setCurrent(data);
      setForecast(days);
      addRecentSearch(data.city);
    } catch (err) {
      setError(notFoundMessage);
      setForecast([]);
      console.log(err);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    searchCity(defaultCity); // Load a default city once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    current,
    forecast,
    loading,
    error,
    recentSearches,
    searchCity,
    useMyLocation,
  };
}
