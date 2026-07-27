import {
  getWeatherBackground,
  temperatureToPercent,
  displayTemperature,
  displayWindSpeed,
  windUnitLabel,
  dayName,
  formatTime,
  formatClock,
} from "./format";

describe("getWeatherBackground", () => {
  it("maps plain conditions to their background class", () => {
    expect(getWeatherBackground("clear sky")).toBe("clear-sky");
    expect(getWeatherBackground("broken clouds")).toBe("cloudy-sky");
    expect(getWeatherBackground("light rain")).toBe("rainy-sky");
    expect(getWeatherBackground("fog")).toBe("misty-sky");
  });

  it("prefers the specific condition when a description also contains 'rain'", () => {
    expect(getWeatherBackground("thunderstorm with rain")).toBe(
      "thunderstorm-sky"
    );
    expect(getWeatherBackground("rain and snow")).toBe("snowy-sky");
    expect(getWeatherBackground("drizzle rain")).toBe("drizzle-sky");
  });

  it("falls back to default-sky for unknown or missing descriptions", () => {
    expect(getWeatherBackground("tornado")).toBe("default-sky");
    expect(getWeatherBackground("")).toBe("default-sky");
    expect(getWeatherBackground()).toBe("default-sky");
  });
});

describe("temperatureToPercent", () => {
  it("maps the midpoint of the -30..50 range to 0.5", () => {
    expect(temperatureToPercent(10)).toBeCloseTo(0.5);
  });

  it("clamps values outside the range to [0, 1]", () => {
    expect(temperatureToPercent(-100)).toBe(0);
    expect(temperatureToPercent(100)).toBe(1);
    expect(temperatureToPercent(-30)).toBe(0);
    expect(temperatureToPercent(50)).toBe(1);
  });
});

describe("displayTemperature", () => {
  it("rounds Celsius unchanged", () => {
    expect(displayTemperature(20.4, "C")).toBe(20);
    expect(displayTemperature(20.5, "C")).toBe(21);
  });

  it("converts Celsius to Fahrenheit and rounds", () => {
    expect(displayTemperature(0, "F")).toBe(32);
    expect(displayTemperature(100, "F")).toBe(212);
    expect(displayTemperature(37, "F")).toBe(99); // 98.6 -> 99
  });
});

describe("displayWindSpeed", () => {
  it("keeps m/s for metric and rounds to one decimal", () => {
    expect(displayWindSpeed(3, "C")).toBe(3);
    expect(displayWindSpeed(2.68, "C")).toBe(2.7);
  });

  it("converts m/s to mph for imperial", () => {
    expect(displayWindSpeed(10, "F")).toBe(22.4); // 10 * 2.23694
    expect(displayWindSpeed(0, "F")).toBe(0);
  });

  it("labels the unit to match", () => {
    expect(windUnitLabel("C")).toBe("m/s");
    expect(windUnitLabel("F")).toBe("mph");
  });
});

describe("dayName", () => {
  it("returns the short weekday for a YYYY-MM-DD date", () => {
    expect(dayName("2026-07-28")).toBe("Tue");
    expect(dayName("2026-01-01")).toBe("Thu");
  });
});

describe("formatTime", () => {
  it("formats a UTC timestamp with the location's offset applied", () => {
    // 06:00 UTC; with no offset it stays 06:00, +1h offset makes it 07:00.
    expect(formatTime(21600, 0)).toMatch(/06:00/);
    expect(formatTime(21600, 3600)).toMatch(/07:00/);
  });

  it("returns an empty string when the timestamp is missing", () => {
    expect(formatTime(undefined)).toBe("");
    expect(formatTime(null)).toBe("");
  });
});

describe("formatClock", () => {
  it("formats an epoch-millis timestamp as HH:MM", () => {
    expect(formatClock(new Date("2026-07-28T09:05:00").getTime())).toMatch(
      /\d{1,2}:\d{2}/
    );
  });

  it("returns an empty string when the timestamp is missing", () => {
    expect(formatClock(null)).toBe("");
    expect(formatClock(undefined)).toBe("");
  });
});
