import { render, screen } from "@testing-library/react";
import Gauge from "./Gauge";

const needleOf = (container) => container.querySelector("line");

test("renders 20 colored segments and a needle", () => {
  const { container } = render(<Gauge percent={0.5} />);
  expect(container.querySelectorAll("path")).toHaveLength(20);
  expect(needleOf(container)).toBeInTheDocument();
  expect(screen.getByTestId("gauge")).toHaveAttribute("aria-hidden", "true");
});

test("clamps out-of-range percents instead of overshooting", () => {
  const low = render(<Gauge percent={-2} />).container;
  const zero = render(<Gauge percent={0} />).container;
  expect(needleOf(low).getAttribute("x2")).toBe(
    needleOf(zero).getAttribute("x2")
  );

  const high = render(<Gauge percent={2} />).container;
  const one = render(<Gauge percent={1} />).container;
  expect(needleOf(high).getAttribute("x2")).toBe(
    needleOf(one).getAttribute("x2")
  );
});
