import { renderHook, act } from "@testing-library/react";
import useFavorites from "./useFavorites";

const LONDON = { name: "London", lat: 51.5, lon: -0.1 };
const PARIS = { name: "Paris", lat: 48.85, lon: 2.35 };

beforeEach(() => localStorage.clear());

test("toggles a city in and out of favorites", () => {
  const { result } = renderHook(() => useFavorites());
  expect(result.current.favorites).toEqual([]);

  act(() => result.current.toggleFavorite(LONDON));
  expect(result.current.favorites).toEqual([LONDON]);
  expect(result.current.isFavorite("london")).toBe(true); // case-insensitive

  act(() => result.current.toggleFavorite(LONDON));
  expect(result.current.favorites).toEqual([]);
});

test("persists across remounts and puts newest first", () => {
  const first = renderHook(() => useFavorites());
  act(() => first.result.current.toggleFavorite(LONDON));
  act(() => first.result.current.toggleFavorite(PARIS));
  first.unmount();

  const second = renderHook(() => useFavorites());
  expect(second.result.current.favorites).toEqual([PARIS, LONDON]);
});

test("ignores entries without coordinates and caps at 8", () => {
  const { result } = renderHook(() => useFavorites());
  act(() => result.current.toggleFavorite({ name: "Nowhere" }));
  expect(result.current.favorites).toEqual([]);

  act(() => {
    for (let i = 0; i < 10; i++) {
      result.current.toggleFavorite({ name: `City${i}`, lat: i, lon: i });
    }
  });
  expect(result.current.favorites).toHaveLength(8);
});
