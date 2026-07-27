import "./App.css";
import { useState, useEffect } from "react"; // Corrected here
import axios from "axios";
import GaugeChart from "react-gauge-chart";

function App() {
  const [allData, setAllData] = useState({
    city: "London",
    country: "",
    temperature: "",
    weatherDescription: "",
    windSpeed: "",
    humidity: "",
    icon: "",
    // Add more fields as needed
  });

  useEffect(() => {
    fetchData("London"); // Pass the default city here
  }, []); // Added dependency array to run useEffect only once

  const fetchData = async (city) => {
    try {
      const API_KEY = "9a2e8ebb42f78cbc76941ac42dc13e9b";
      const result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
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
    } catch (error) {
      alert("City not found, please enter a valid city of a country!");
      console.log(error);
    }
  };

  const getWeatherStyle = () => {
    let backgroundClass;

    if (allData.weatherDescription.includes("clear")) {
      backgroundClass = "clear-sky";
    } else if (allData.weatherDescription.includes("cloud")) {
      backgroundClass = "cloudy-sky";
    } else if (allData.weatherDescription.includes("rain")) {
      backgroundClass = "rainy-sky";
    }
    // Add more conditions as needed

    return { backgroundClass };
  };

  const { backgroundClass } = getWeatherStyle();
  const temperatureToPercent = (tempInKelvin) => {
    const tempInCelsius = tempInKelvin - 273.15;
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
      <section className="weather-section">
        {/* Display the weather icon */}
        {allData.icon && (
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${allData.icon}.png`}
            alt="Weather Icon"
          />
        )}
        <h3>
          {allData.city}, {allData.country} - {Math.round(allData.temperature - 273.15)}°C
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
