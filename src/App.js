import "./App.css";
import { useState } from "react";
import useWeather from "./hooks/useWeather";
import { getWeatherBackground } from "./utils/format";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import Footer from "./components/Footer";

function App() {
  const {
    current,
    forecast,
    loading,
    error,
    recentSearches,
    searchCity,
    useMyLocation,
  } = useWeather("London");
  const [unit, setUnit] = useState("C"); // "C" or "F"

  const backgroundClass = getWeatherBackground(current?.weatherDescription);

  return (
    <main className={backgroundClass}>
      <SearchForm
        onSearch={searchCity}
        onUseLocation={useMyLocation}
        recentSearches={recentSearches}
      />
      <section className="weather-section" aria-live="polite">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading && !error && (
          <p className="status-message">Loading weather…</p>
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
            unit={unit}
            onUnitChange={setUnit}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}

export default App;
