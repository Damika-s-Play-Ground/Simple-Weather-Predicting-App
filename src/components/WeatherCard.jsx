import Gauge from "./Gauge";
import {
  displayTemperature,
  displayWindSpeed,
  windUnitLabel,
  temperatureToPercent,
  dayName,
  formatTime,
  formatClock,
} from "../utils/format";

// Current conditions, the °C/°F toggle, the gauge, and the 5-day forecast.
export default function WeatherCard({
  data,
  forecast,
  hourly = [],
  unit,
  onUnitChange,
  lastUpdated,
  onRefresh,
  loading = false,
  favorite = false,
  onToggleFavorite,
}) {
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
        {data.lat != null && data.lon != null && onToggleFavorite && (
          <button
            type="button"
            className="favorite-star"
            aria-pressed={favorite}
            aria-label={
              favorite
                ? `Remove ${data.city} from favorites`
                : `Add ${data.city} to favorites`
            }
            onClick={() =>
              onToggleFavorite({
                name: data.city,
                lat: data.lat,
                lon: data.lon,
              })
            }
          >
            {favorite ? "★" : "☆"}
          </button>
        )}
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
      {data.feelsLike != null && (
        <p>
          Feels Like: {displayTemperature(data.feelsLike, unit)}°{unit}
        </p>
      )}
      <p>
        Wind Speed: {displayWindSpeed(data.windSpeed, unit)}{" "}
        {windUnitLabel(unit)}
      </p>
      <p>Humidity: {data.humidity}%</p>
      {data.sunrise != null && data.sunset != null && (
        <p>
          Sunrise: {formatTime(data.sunrise, data.timezone)} · Sunset:{" "}
          {formatTime(data.sunset, data.timezone)}
        </p>
      )}

      {hourly.length > 0 && (
        <div className="hourly">
          <h4 className="forecast-title">Next 24 Hours</h4>
          <div className="hourly-list" aria-label="Hourly forecast">
            {hourly.map((h) => (
              <div className="hourly-slot" key={h.time}>
                <span className="hourly-time">
                  {formatTime(h.time, data.timezone)}
                </span>
                <img
                  className="forecast-icon"
                  src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                  alt={h.description}
                />
                <span className="hourly-temp">
                  {displayTemperature(h.temp, unit)}°
                </span>
                <span
                  className="hourly-pop"
                  title="Chance of precipitation"
                  aria-label={
                    h.pop >= 0.05
                      ? `${Math.round(h.pop * 100)}% chance of precipitation`
                      : undefined
                  }
                >
                  {h.pop >= 0.05 ? `💧${Math.round(h.pop * 100)}%` : " "}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      <div className="updated-row">
        {lastUpdated != null && (
          <span className="updated-time">
            Updated {formatClock(lastUpdated)}
          </span>
        )}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh weather"
        >
          <span aria-hidden="true">↻ </span>Refresh
        </button>
      </div>
    </>
  );
}
