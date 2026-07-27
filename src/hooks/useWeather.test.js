import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import useWeather from "./useWeather";

// axios ships ESM that CRA's Jest cannot transform; mock it.
jest.mock("axios", () => ({ get: jest.fn() }));

const forecastResponse = () => ({ data: { list: [] } });
const weatherResponse = (name, country) => ({
  data: {
    name,
    sys: { country },
    main: { temp: 20, humidity: 50 },
    weather: [{ description: "clear sky", icon: "01d" }],
    wind: { speed: 1 },
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  process.env.REACT_APP_OWM_KEY = "test-key";
});

test("ignores a stale response that resolves after a newer request", async () => {
  // Defer each city's weather response so we control resolution order.
  const resolvers = {};
  axios.get.mockImplementation((url) => {
    if (url.includes("/forecast")) return Promise.resolve(forecastResponse());
    const city = decodeURIComponent(url.match(/[?&]q=([^&]+)/)[1]);
    return new Promise((resolve) => {
      resolvers[city] = () =>
        resolve(weatherResponse(city, city === "London" ? "GB" : "FR"));
    });
  });

  const { result } = renderHook(() => useWeather("London"));
  // Mount kicks off London (older); now fire a newer Paris request.
  act(() => {
    result.current.searchCity("Paris");
  });

  // Newer (Paris) resolves first and becomes the current city.
  await act(async () => {
    resolvers.Paris();
  });
  await waitFor(() => expect(result.current.current?.city).toBe("Paris"));

  // Older (London) resolves last but must NOT overwrite Paris.
  await act(async () => {
    resolvers.London();
  });
  expect(result.current.current.city).toBe("Paris");
});
