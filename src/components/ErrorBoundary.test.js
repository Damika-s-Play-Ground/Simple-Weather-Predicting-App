import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const Bomb = () => {
  throw new Error("boom");
};

test("renders children when there is no error", () => {
  render(
    <ErrorBoundary>
      <p>All good</p>
    </ErrorBoundary>
  );
  expect(screen.getByText("All good")).toBeInTheDocument();
});

test("renders a fallback when a child throws", () => {
  // React logs the caught error; silence it to keep the test output clean.
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();

  spy.mockRestore();
});
