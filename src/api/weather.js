import axios from "axios";

const BASE = "https://api.openweathermap.org/data/2.5";

// True when an OpenWeather API key is available at build time.
export const isWeatherApiConfigured = () =>
  Boolean(import.meta.env.VITE_OWM_KEY);

// Map the OpenWeather "current weather" payload to the shape the UI needs.
const buildCurrent = (data) => ({
  city: data.name,
  country: data.sys.country,
  lat: data.coord?.lat,
  lon: data.coord?.lon,
  temperature: data.main.temp,
  feelsLike: data.main.feels_like,
  weatherDescription: data.weather[0].description,
  windSpeed: data.wind.speed,
  humidity: data.main.humidity,
  icon: data.weather[0].icon,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  timezone: data.timezone, // seconds offset from UTC for the queried location
});

// Collapse the API's 3-hourly forecast list into up to 5 daily min/max entries,
// preferring the midday (12:00) icon/description for each day.
export const buildDailyForecast = (list) => {
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

// The next 24 hours as up to eight 3-hour steps straight from the forecast
// list: time (unix UTC seconds), temp, icon, description, and precipitation
// probability (pop, 0..1).
export const buildHourlyForecast = (list) => {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 8).map((item) => ({
    time: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    pop: item.pop || 0,
  }));
};

// Fetch current conditions and forecast in parallel for a query string
// (either `q=<city>` or `lat=..&lon=..`). Returns { current, forecast, hourly }.
export const fetchWeatherByQuery = async (query) => {
  const API_KEY = import.meta.env.VITE_OWM_KEY;
  const [weatherRes, forecastRes] = await Promise.all([
    axios.get(`${BASE}/weather?${query}&units=metric&appid=${API_KEY}`),
    axios.get(`${BASE}/forecast?${query}&units=metric&appid=${API_KEY}`),
  ]);
  return {
    current: buildCurrent(weatherRes.data),
    forecast: buildDailyForecast(forecastRes.data.list),
    hourly: buildHourlyForecast(forecastRes.data.list),
  };
};
