vi.mock("axios", () => ({ default: { get: vi.fn() } }));

import axios from "axios";
import { fetchCitySuggestions, suggestionLabel } from "./geocoding";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("VITE_OWM_KEY", "test-key");
});

test("maps geocoding results to suggestion objects", async () => {
  axios.get.mockResolvedValue({
    data: [
      { name: "London", state: "England", country: "GB", lat: 51.5, lon: -0.1 },
      { name: "London", country: "CA", lat: 42.98, lon: -81.24 },
    ],
  });

  const result = await fetchCitySuggestions("Lond");
  expect(result).toEqual([
    { name: "London", state: "England", country: "GB", lat: 51.5, lon: -0.1 },
    { name: "London", state: "", country: "CA", lat: 42.98, lon: -81.24 },
  ]);
  expect(axios.get.mock.calls[0][0]).toContain("/geo/1.0/direct?q=Lond");
});

test("returns empty without calling the API for short or blank queries", async () => {
  expect(await fetchCitySuggestions("L")).toEqual([]);
  expect(await fetchCitySuggestions("  ")).toEqual([]);
  expect(axios.get).not.toHaveBeenCalled();
});

test("returns empty when the API key is missing", async () => {
  vi.stubEnv("VITE_OWM_KEY", "");
  expect(await fetchCitySuggestions("London")).toEqual([]);
  expect(axios.get).not.toHaveBeenCalled();
});

test("returns empty for a non-array payload", async () => {
  axios.get.mockResolvedValue({ data: { cod: 401 } });
  expect(await fetchCitySuggestions("London")).toEqual([]);
});

test("builds readable labels, skipping missing parts", () => {
  expect(
    suggestionLabel({ name: "London", state: "England", country: "GB" })
  ).toBe("London, England, GB");
  expect(suggestionLabel({ name: "Paris", state: "", country: "FR" })).toBe(
    "Paris, FR"
  );
});
