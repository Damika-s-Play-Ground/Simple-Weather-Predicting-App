// Mock the network boundary so importing the module under test is pure.
vi.mock("axios", () => ({ default: { get: vi.fn() } }));

import { buildDailyForecast, buildHourlyForecast } from "./weather";

const entry = (dt_txt, temp_min, temp_max, icon, description) => ({
  dt_txt,
  main: { temp_min, temp_max },
  weather: [{ icon, description }],
});

describe("buildDailyForecast", () => {
  it("returns an empty array when given a non-array", () => {
    expect(buildDailyForecast(undefined)).toEqual([]);
    expect(buildDailyForecast(null)).toEqual([]);
    expect(buildDailyForecast({})).toEqual([]);
  });

  it("aggregates min/max per day and prefers the midday icon", () => {
    const list = [
      entry("2026-07-28 09:00:00", 10, 15, "01d", "clear sky"),
      entry("2026-07-28 12:00:00", 12, 20, "02d", "few clouds"),
      entry("2026-07-28 15:00:00", 8, 22, "03d", "scattered clouds"),
      entry("2026-07-29 12:00:00", 5, 9, "10d", "light rain"),
    ];

    const days = buildDailyForecast(list);

    expect(days).toHaveLength(2);
    expect(days[0]).toMatchObject({
      date: "2026-07-28",
      min: 8,
      max: 22,
      icon: "02d", // from the 12:00 entry
      description: "few clouds",
    });
    expect(days[1]).toMatchObject({ date: "2026-07-29", min: 5, max: 9 });
  });

  it("caps the result at 5 days", () => {
    const list = Array.from({ length: 8 }, (_, i) =>
      entry(`2026-08-0${i + 1} 12:00:00`, i, i + 5, "01d", "clear sky")
    );
    expect(buildDailyForecast(list)).toHaveLength(5);
  });
});

const hourlyEntry = (dt, temp, pop) => ({
  dt,
  main: { temp },
  weather: [{ icon: "01d", description: "clear sky" }],
  ...(pop != null && { pop }),
});

describe("buildHourlyForecast", () => {
  it("returns an empty array when given a non-array", () => {
    expect(buildHourlyForecast(undefined)).toEqual([]);
    expect(buildHourlyForecast(null)).toEqual([]);
  });

  it("maps time, temp, icon, description, and pop", () => {
    const hours = buildHourlyForecast([hourlyEntry(1753704000, 21.4, 0.4)]);
    expect(hours).toEqual([
      {
        time: 1753704000,
        temp: 21.4,
        icon: "01d",
        description: "clear sky",
        pop: 0.4,
      },
    ]);
  });

  it("defaults a missing pop to 0", () => {
    expect(buildHourlyForecast([hourlyEntry(1753704000, 20)])[0].pop).toBe(0);
  });

  it("caps the result at 8 slots (24 hours)", () => {
    const list = Array.from({ length: 12 }, (_, i) =>
      hourlyEntry(1753704000 + i * 10800, 20, 0)
    );
    expect(buildHourlyForecast(list)).toHaveLength(8);
  });
});
