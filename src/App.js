import "./App.css";
import { useState, useEffect } from "react"; // Corrected here
import axios from "axios";
import GaugeChart from "react-gauge-chart";

function App() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData("London"); // Pass the default city here
  }, []); // Added dependency array to run useEffect only once

  const fetchData = async (city) => {
    setLoading(true);
    setError("");
    try {
      const API_KEY = process.env.REACT_APP_OWM_KEY;
      const result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
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
      setError(`Could not find weather for "${city}". Please check the city name and try again.`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherStyle = () => {
    let backgroundClass;
    const description = allData ? allData.weatherDescription : "";

    if (description.includes("clear")) {
      backgroundClass = "clear-sky";
    } else if (description.includes("cloud")) {
      backgroundClass = "cloudy-sky";
    } else if (description.includes("rain")) {
      backgroundClass = "rainy-sky";
    }
    // Add more conditions as needed

    return { backgroundClass };
  };

  const { backgroundClass } = getWeatherStyle();
  const temperatureToPercent = (tempInCelsius) => {
    const minTemp = -30;
    const maxTemp = 50;
    const percent = (tempInCelsius - minTemp) / (maxTemp - minTemp);
    return Math.min(Math.max(percent, 0), 1);
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
              {allData.city}, {allData.country} - {Math.round(allData.temperature)}°C
            </h3>
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
