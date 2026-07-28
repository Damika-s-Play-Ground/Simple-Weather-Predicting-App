import "./App.css";
import { useState, useEffect } from "react";
import useWeather from "./hooks/useWeather";
import useTheme from "./hooks/useTheme";
import { getWeatherBackground } from "./utils/format";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import WeatherSkeleton from "./components/WeatherSkeleton";
import Footer from "./components/Footer";

function App() {
  const {
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
  } = useWeather("London");
  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem("unit") === "F" ? "F" : "C";
    } catch {
      return "C";
    }
  }); // "C" or "F"

  // Remember the chosen unit across reloads.
  useEffect(() => {
    try {
      localStorage.setItem("unit", unit);
    } catch {
      // Ignore storage errors (e.g. private mode / quota).
    }
  }, [unit]);

  const { theme, cycleTheme } = useTheme();
  const themeLabel = { system: "🖥️ Auto", light: "☀️ Light", dark: "🌙 Dark" }[
    theme
  ];

  const backgroundClass = getWeatherBackground(current?.weatherDescription);

  return (
    <main className={backgroundClass}>
      <button
        type="button"
        className="theme-toggle"
        onClick={cycleTheme}
        aria-label={`Theme: ${theme}. Activate to change.`}
      >
        {themeLabel}
      </button>
      <SearchForm
        onSearch={searchCity}
        onUseLocation={useMyLocation}
        recentSearches={recentSearches}
        onClearRecent={clearRecentSearches}
        loading={loading}
      />
      <section className="weather-section" aria-live="polite">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading && !error && (
          <>
            <span className="sr-only">Loading weather…</span>
            <WeatherSkeleton />
          </>
        )}

        {!loading && !error && !current && (
          <p className="status-message">
            Search for a city to see its weather.
          </p>
        )}

        {!loading && !error && current && (
          <WeatherCard
            data={current}
            forecast={forecast}
            hourly={hourly}
            unit={unit}
            onUnitChange={setUnit}
            lastUpdated={lastUpdated}
            onRefresh={refresh}
            loading={loading}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}

export default App;
