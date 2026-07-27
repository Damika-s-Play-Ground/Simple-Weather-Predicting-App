// Pure presentation helpers shared across components.

// Pick a themed background class for a weather description.
// Order matters: OpenWeather descriptions like "thunderstorm with rain",
// "sleet"/"rain and snow", and "drizzle rain" all contain "rain", so the more
// specific conditions must be matched before the generic rain case.
export const getWeatherBackground = (description = "") => {
  if (description.includes("thunderstorm")) return "thunderstorm-sky";
  if (description.includes("snow") || description.includes("sleet"))
    return "snowy-sky";
  if (description.includes("drizzle")) return "drizzle-sky";
  if (description.includes("rain")) return "rainy-sky";
  if (
    description.includes("mist") ||
    description.includes("fog") ||
    description.includes("haze") ||
    description.includes("smoke")
  )
    return "misty-sky";
  if (description.includes("clear")) return "clear-sky";
  if (description.includes("cloud")) return "cloudy-sky";
  return "default-sky";
};

// Map a Celsius temperature onto a 0..1 gauge position (-30°C..50°C range).
export const temperatureToPercent = (tempInCelsius) => {
  const minTemp = -30;
  const maxTemp = 50;
  const percent = (tempInCelsius - minTemp) / (maxTemp - minTemp);
  return Math.min(Math.max(percent, 0), 1);
};

// Convert a stored Celsius value to the chosen display unit, rounded.
export const displayTemperature = (tempInCelsius, unit) => {
  const value = unit === "C" ? tempInCelsius : tempInCelsius * (9 / 5) + 32;
  return Math.round(value);
};

// Short weekday label (e.g. "Mon") for a YYYY-MM-DD forecast date.
export const dayName = (dateStr) =>
  new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
  });

// Format a UTC unix timestamp (seconds) as a local wall-clock time for the
// queried location, applying its UTC offset. Rendered in UTC so the viewer's
// own timezone doesn't shift the result.
export const formatTime = (unixSeconds, tzOffsetSeconds = 0) => {
  if (unixSeconds == null) return "";
  return new Date((unixSeconds + tzOffsetSeconds) * 1000).toLocaleTimeString(
    undefined,
    { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
  );
};
