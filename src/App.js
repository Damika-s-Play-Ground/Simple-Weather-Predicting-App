import "./App.css";
import { useState, useEffect } from "react"; // Corrected here
import axios from "axios";
import GaugeChart from "react-gauge-chart";

function App() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // "C" or "F"
  const [forecast, setForecast] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchData("London"); // Pass the default city here
    // Run once on mount to load a default city.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the resolved city, most-recent first, deduped (case-insensitive), capped at 5.
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

  // Collapse the API's 3-hourly list into up to 5 daily min/max entries,
  // preferring the midday (12:00) icon/description for each day.
  const buildDailyForecast = (list) => {
    if (!Array.isArray(list)) return [];
    const days = {};
    list.forEach((item) => {
      const [date, time] = item.dt_txt.split(" ");
      if (!days[date]) {
        days[date] = {
          date,
          min: item.main.temp_min,
          max: item.main.temp_max,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        };
      }
      days[date].min = Math.min(days[date].min, item.main.temp_min);
      days[date].max = Math.max(days[date].max, item.main.temp_max);
      if (time === "12:00:00") {
        days[date].icon = item.weather[0].icon;
        days[date].description = item.weather[0].description;
      }
    });
    return Object.values(days).slice(0, 5);
  };

  // Shared request/response handling for both city and coordinate lookups.
  const fetchByQuery = async (query, notFoundMessage) => {
    setLoading(true);
    setError("");
    try {
      const API_KEY = process.env.REACT_APP_OWM_KEY;
      const base = "https://api.openweathermap.org/data/2.5";
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${base}/weather?${query}&units=metric&appid=${API_KEY}`),
        axios.get(`${base}/forecast?${query}&units=metric&appid=${API_KEY}`),
      ]);
      setAllData({
        city: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        temperature: weatherRes.data.main.temp,
        weatherDescription: weatherRes.data.weather[0].description,
        windSpeed: weatherRes.data.wind.speed,
        humidity: weatherRes.data.main.humidity,
        icon: weatherRes.data.weather[0].icon,
        // Add more fields as needed
      });
      setForecast(buildDailyForecast(forecastRes.data.list));
      addRecentSearch(weatherRes.data.name);
    } catch (err) {
      setError(notFoundMessage);
      setForecast([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }
    fetchByQuery(
      `q=${encodeURIComponent(trimmedCity)}`,
      `Could not find weather for "${trimmedCity}". Please check the city name and try again.`
    );
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchByQuery(
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

  const getWeatherStyle = () => {
    const description = allData ? allData.weatherDescription : "";

    // Order matters: OpenWeather descriptions like "thunderstorm with rain",
    // "sleet"/"rain and snow", and "drizzle rain" all contain "rain", so the
    // more specific conditions must be matched before the generic rain case.
    let backgroundClass = "default-sky";
    if (description.includes("thunderstorm")) {
      backgroundClass = "thunderstorm-sky";
    } else if (description.includes("snow") || description.includes("sleet")) {
      backgroundClass = "snowy-sky";
    } else if (description.includes("drizzle")) {
      backgroundClass = "drizzle-sky";
    } else if (description.includes("rain")) {
      backgroundClass = "rainy-sky";
    } else if (
      description.includes("mist") ||
      description.includes("fog") ||
      description.includes("haze") ||
      description.includes("smoke")
    ) {
      backgroundClass = "misty-sky";
    } else if (description.includes("clear")) {
      backgroundClass = "clear-sky";
    } else if (description.includes("cloud")) {
      backgroundClass = "cloudy-sky";
    }

    return { backgroundClass };
  };

  const { backgroundClass } = getWeatherStyle();
  const temperatureToPercent = (tempInCelsius) => {
    const minTemp = -30;
    const maxTemp = 50;
    const percent = (tempInCelsius - minTemp) / (maxTemp - minTemp);
    return Math.min(Math.max(percent, 0), 1);
  };
  const displayTemperature = (tempInCelsius) => {
    const value = unit === "C" ? tempInCelsius : tempInCelsius * (9 / 5) + 32;
    return Math.round(value);
  };
  const dayName = (dateStr) =>
    new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    });
  const chartStyle = { width: "40%" };
  // the section ta in react for sections and the main tag for the main build
  // under the main we will have sections for the form and for display the weather details
  return (
    <main className={backgroundClass}>
      <section className="form-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(e.target.city.value);
          }}
        >
          <input type="text" name="city" placeholder="City" />
          <button type="submit">Search</button>
          <button
            type="button"
            className="location-button"
            onClick={fetchByLocation}
          >
            📍 Use my location
          </button>
        </form>
        {recentSearches.length > 0 && (
          <div className="recent-searches" aria-label="Recent searches">
            <span className="recent-label">Recent:</span>
            {recentSearches.map((city) => (
              <button
                key={city}
                type="button"
                className="recent-chip"
                onClick={() => fetchData(city)}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="weather-section" aria-live="polite">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading && !error && <p className="status-message">Loading weather…</p>}

        {!loading && !error && !allData && (
          <p className="status-message">Search for a city to see its weather.</p>
        )}

        {!loading && !error && allData && (
          <>
            {/* Display the weather icon */}
            {allData.icon && (
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${allData.icon}.png`}
                alt={allData.weatherDescription || "Weather Icon"}
              />
            )}
            <h3>
              {allData.city}, {allData.country} - {displayTemperature(allData.temperature)}°{unit}
            </h3>
            <div
              className="unit-toggle"
              role="group"
              aria-label="Temperature unit"
            >
              <button
                type="button"
                className={unit === "C" ? "active" : ""}
                aria-pressed={unit === "C"}
                onClick={() => setUnit("C")}
              >
                °C
              </button>
              <button
                type="button"
                className={unit === "F" ? "active" : ""}
                aria-pressed={unit === "F"}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
            <div id="outer-div">
              <GaugeChart
                id="gauge-chart1"
                nrOfLevels={20}
                percent={temperatureToPercent(allData.temperature)}
                textColor="#000000"
                hideText={true} // This will remove the percentage text
                style={chartStyle}
              />
            </div>
            <p>Weather: {allData.weatherDescription}</p>
            <p>Wind Speed: {allData.windSpeed} m/s</p>
            <p>Humidity: {allData.humidity}%</p>
            {/* Add more fields as needed */}

            {forecast.length > 0 && (
              <div className="forecast">
                <h4 className="forecast-title">5-Day Forecast</h4>
                <div className="forecast-list">
                  {forecast.map((day) => (
                    <div className="forecast-day" key={day.date}>
                      <span className="forecast-dow">{dayName(day.date)}</span>
                      <img
                        className="forecast-icon"
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                        alt={day.description}
                      />
                      <span className="forecast-temp">
                        {displayTemperature(day.max)}° / {displayTemperature(day.min)}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <footer className="app-footer">
        Damika Anupama made this app with <span className="heart">❤</span>
        <a
          href="https://github.com/Damika-s-Play-Ground/Simple-Weather-Predicting-App"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}

export default App;
