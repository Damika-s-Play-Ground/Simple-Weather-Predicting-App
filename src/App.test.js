import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";

// axios ships ESM that CRA's Jest cannot transform, and App fetches on mount.
// Mock it so the suite runs without a real network call.
jest.mock("axios", () => ({
  get: jest.fn(),
}));

// react-gauge-chart pulls in d3 (ESM), which CRA's Jest cannot transform.
jest.mock("react-gauge-chart", () => () => <div data-testid="gauge" />);

// Build responses shaped like the OpenWeather current-weather and forecast APIs.
const weatherResponse = (name, country) => ({
  data: {
    name,
    sys: { country },
    main: { temp: 20, humidity: 55 },
    weather: [{ description: "clear sky", icon: "01d" }],
    wind: { speed: 3 },
  },
});

const forecastResponse = () => ({
  data: {
    list: [
      {
        dt_txt: "2026-07-28 12:00:00",
        main: { temp_min: 15, temp_max: 22 },
        weather: [{ icon: "01d", description: "clear sky" }],
      },
    ],
  },
});

// Resolve the returned city from the request's `q=` param so a search for a
// different city produces different data than the default mount fetch.
const routeByUrl = (url) => {
  if (url.includes("/forecast")) return Promise.resolve(forecastResponse());
  const match = url.match(/[?&]q=([^&]+)/);
  const city = match ? decodeURIComponent(match[1]) : "Local";
  const country = city === "London" ? "GB" : city === "Paris" ? "FR" : "XX";
  return Promise.resolve(weatherResponse(city, country));
};

beforeEach(() => {
  jest.clearAllMocks();
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
});

test("searches for a typed city and shows its weather", async () => {
  render(<App />);
  await screen.findByText(/London, GB - 20°C/); // wait for the mount fetch

  const input = screen.getByRole("textbox");
  await userEvent.clear(input);
  await userEvent.type(input, "Paris");
  await userEvent.click(screen.getByRole("button", { name: /^search$/i }));

  expect(await screen.findByText(/Paris, FR - 20°C/)).toBeInTheDocument();
});

test("shows an inline error when the lookup fails", async () => {
  axios.get.mockRejectedValue(new Error("network error"));
  render(<App />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/could not find weather/i);
});
