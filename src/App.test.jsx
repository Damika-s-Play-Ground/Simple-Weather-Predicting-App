import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";

// App fetches on mount; mock axios so the suite runs without network.
vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

// Build responses shaped like the OpenWeather current-weather and forecast APIs.
const weatherResponse = (name, country) => ({
  data: {
    name,
    coord: { lat: 51.5, lon: -0.12 },
    sys: { country, sunrise: 1753680000, sunset: 1753731000 },
    main: { temp: 20, feels_like: 18, humidity: 55 },
    weather: [{ description: "clear sky", icon: "01d" }],
    wind: { speed: 3 },
    timezone: 0,
  },
});

const forecastResponse = () => ({
  data: {
    list: [
      {
        dt: 1753704000, // 12:00 UTC
        dt_txt: "2026-07-28 12:00:00",
        main: { temp: 21, temp_min: 15, temp_max: 22 },
        weather: [{ icon: "01d", description: "clear sky" }],
        pop: 0.4,
      },
    ],
  },
});

// Resolve the returned city from the request's `q=` param so a search for a
// different city produces different data than the default mount fetch.
const geoResponse = () => ({
  data: [
    { name: "London", state: "England", country: "GB", lat: 51.5, lon: -0.12 },
    { name: "Londonderry", country: "GB", lat: 55, lon: -7.3 },
  ],
});

const routeByUrl = (url) => {
  if (url.includes("/geo/1.0/direct")) return Promise.resolve(geoResponse());
  if (url.includes("/forecast")) return Promise.resolve(forecastResponse());
  // Coordinate lookups (autocomplete/favorites) resolve to London.
  if (url.includes("lat="))
    return Promise.resolve(weatherResponse("London", "GB"));
  const match = url.match(/[?&]q=([^&]+)/);
  const city = match ? decodeURIComponent(match[1]) : "Local";
  const country = city === "London" ? "GB" : city === "Paris" ? "FR" : "XX";
  return Promise.resolve(weatherResponse(city, country));
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  // The guard in useWeather needs a key present for the normal-path tests;
  // CI runs `npm test` without one, so set a stub here.
  vi.stubEnv("VITE_OWM_KEY", "test-key");
  axios.get.mockImplementation(routeByUrl);
});

test("renders the search form", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("loads and displays weather for the default city on mount", async () => {
  render(<App />);

  expect(await screen.findByText(/London, GB - 20°C/)).toBeInTheDocument();
  expect(screen.getByText("Humidity: 55%")).toBeInTheDocument();
  expect(screen.getByText("Wind Speed: 3 m/s")).toBeInTheDocument();
  expect(screen.getByText(/Feels Like: 18°C/)).toBeInTheDocument();
  expect(screen.getByText(/Sunrise:/)).toBeInTheDocument();
});

test("searches for a typed city and shows its weather", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/); // wait for the mount fetch

  const input = screen.getByRole("combobox");
  await userEvent.clear(input);
  await userEvent.type(input, "Paris");
  await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

  expect(await screen.findByText(/Paris, FR - 20°C/)).toBeInTheDocument();
});

test("shows a configuration message when the API key is missing", async () => {
  vi.stubEnv("VITE_OWM_KEY", "");
  render(<App />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/not configured/i);
});

test("shows an inline error when the lookup fails", async () => {
  axios.get.mockRejectedValue(new Error("network error"));
  render(<App />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/could not find weather/i);
});

test("shows the hourly strip with temperature and precipitation chance", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/);

  expect(screen.getByText("Next 24 Hours")).toBeInTheDocument();
  expect(screen.getByText("21°")).toBeInTheDocument(); // hourly slot temp
  expect(screen.getByText(/💧40%/)).toBeInTheDocument(); // pop 0.4
});

test("restores the saved unit preference from localStorage", async () => {
  localStorage.setItem("unit", "F");
  render(<App />);

  // 20°C -> 68°F, so the saved preference should show Fahrenheit on load.
  expect(await screen.findByText(/London, GB - 68°F/)).toBeInTheDocument();
  // Imperial units also switch wind to mph (3 m/s -> 6.7 mph).
  expect(screen.getByText(/Wind Speed: 6.7 mph/)).toBeInTheDocument();
});

test("clears recent searches when Clear is clicked", async () => {
  render(<App />);
  // The default London fetch records a recent-search chip.
  expect(
    await screen.findByRole("button", { name: /show weather for london/i })
  ).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole("button", { name: /clear recent searches/i })
  );

  expect(
    screen.queryByRole("button", { name: /show weather for london/i })
  ).not.toBeInTheDocument();
  expect(localStorage.getItem("recentSearches")).toBeNull();
});

test("shows a last-updated time and refetches when Refresh is clicked", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/);
  expect(screen.getByText(/^Updated /)).toBeInTheDocument();

  const callsAfterLoad = axios.get.mock.calls.length;
  await userEvent.click(
    screen.getByRole("button", { name: /refresh weather/i })
  );
  await screen.findByText(/London, GB - 20°C/);
  expect(axios.get.mock.calls.length).toBeGreaterThan(callsAfterLoad);
});

test("disables the search controls while a request is in flight", async () => {
  let resolveWeather;
  axios.get.mockImplementation((url) => {
    if (url.includes("/forecast")) return Promise.resolve(forecastResponse());
    return new Promise((resolve) => {
      resolveWeather = () => resolve(weatherResponse("London", "GB"));
    });
  });

  render(<App />);

  // The mount fetch stays pending: the button shows "Searching…" and is disabled.
  const searching = await screen.findByRole("button", { name: /searching/i });
  expect(searching).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /use my location/i })
  ).toBeDisabled();

  // Once it resolves, the controls re-enable.
  await act(async () => {
    resolveWeather();
  });
  expect(
    await screen.findByRole("button", { name: /^search$/i })
  ).toBeEnabled();
});

// Note: the out-of-order/stale-response guard is verified at the hook level in
// src/hooks/useWeather.test.js — the UI now disables the controls while a
// request is in flight, so the two-concurrent-searches path can't be driven
// through the buttons here.

test("autocomplete suggests cities and selects via keyboard", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/);

  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Londo");

  const options = await screen.findAllByRole("option");
  expect(options[0]).toHaveTextContent("London, England, GB");
  expect(options[1]).toHaveTextContent("Londonderry, GB");

  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });

  // Selection fetches by exact coordinates and fills the input.
  await screen.findByText(/London, GB - 20°C/);
  const coordCall = axios.get.mock.calls.find(([url]) =>
    url.includes("lat=51.5&lon=-0.12")
  );
  expect(coordCall).toBeTruthy();
  expect(input).toHaveValue("London");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("escape closes the suggestion list", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/);

  const box = screen.getByRole("combobox");
  await userEvent.type(box, "Londo");
  await screen.findByRole("listbox");
  fireEvent.keyDown(box, { key: "Escape" });
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("pins and unpins the current city as a favorite", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/);

  await userEvent.click(
    screen.getByRole("button", { name: /add london to favorites/i })
  );
  expect(
    screen.getByRole("button", { name: /show weather for favorite london/i })
  ).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("favorites"))[0].name).toBe("London");

  await userEvent.click(
    screen.getByRole("button", { name: /remove london from favorites/i })
  );
  expect(
    screen.queryByRole("button", { name: /show weather for favorite london/i })
  ).not.toBeInTheDocument();
});
