import { renderHook, act } from "@testing-library/react";
import useDebouncedValue from "./useDebouncedValue";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("only emits after the value is stable for the delay", () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebouncedValue(value, 300),
    { initialProps: { value: "L" } }
  );
  expect(result.current).toBe("L");

  rerender({ value: "Lo" });
  act(() => vi.advanceTimersByTime(200));
  expect(result.current).toBe("L"); // not yet stable

  rerender({ value: "Lon" }); // typing resets the timer
  act(() => vi.advanceTimersByTime(200));
  expect(result.current).toBe("L");

  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe("Lon");
});
