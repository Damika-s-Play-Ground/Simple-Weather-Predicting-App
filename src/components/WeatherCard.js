import Gauge from "./Gauge";
import {
  displayTemperature,
  temperatureToPercent,
  dayName,
} from "../utils/format";

// Current conditions, the °C/°F toggle, the gauge, and the 5-day forecast.
export default function WeatherCard({ data, forecast, unit, onUnitChange }) {
  return (
    <>
      {data.icon && (
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${data.icon}.png`}
          alt={data.weatherDescription || "Weather Icon"}
        />
      )}
      <h3>
        {data.city}, {data.country} -{" "}
        {displayTemperature(data.temperature, unit)}°{unit}
      </h3>
      <div className="unit-toggle" role="group" aria-label="Temperature unit">
        <button
          type="button"
          className={unit === "C" ? "active" : ""}
          aria-pressed={unit === "C"}
          onClick={() => onUnitChange("C")}
        >
          °C
        </button>
        <button
          type="button"
          className={unit === "F" ? "active" : ""}
          aria-pressed={unit === "F"}
          onClick={() => onUnitChange("F")}
        >
          °F
        </button>
      </div>
      <Gauge percent={temperatureToPercent(data.temperature)} />
      <p>Weather: {data.weatherDescription}</p>
      <p>Wind Speed: {data.windSpeed} m/s</p>
      <p>Humidity: {data.humidity}%</p>

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
                  {displayTemperature(day.max, unit)}° /{" "}
                  {displayTemperature(day.min, unit)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
