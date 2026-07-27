import "./App.css";
import { useState, useEffect } from "react"; // Corrected here
import axios from "axios";
import GaugeChart from "react-gauge-chart";

function App() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // "C" or "F"

  useEffect(() => {
    fetchData("London"); // Pass the default city here
    // Run once on mount to load a default city.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shared request/response handling for both city and coordinate lookups.
  const fetchByQuery = async (query, notFoundMessage) => {
    setLoading(true);
    setError("");
    try {
      const API_KEY = process.env.REACT_APP_OWM_KEY;
      const result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
      );
      setAllData({
        city: result.data.name,
        country: result.data.sys.country,
        temperature: result.data.main.temp,
        weatherDescription: result.data.weather[0].description,
        windSpeed: result.data.wind.speed,
        humidity: result.data.main.humidity,
        icon: result.data.weather[0].icon,
        // Add more fields as needed
      });
    } catch (err) {
      setError(notFoundMessage);
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
          </>
        )}
      </section>
      <footer className="app-footer">
        Damika Anupama made this app with <span className="heart">❤</span>
        <a
          href="https://github.com/Damika-Anupama/Simple-Weather-Predicting-App"
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
