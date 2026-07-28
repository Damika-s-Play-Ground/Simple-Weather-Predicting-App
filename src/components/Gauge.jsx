const SEGMENTS = 20;
const CX = 60;
const CY = 58;
const RADIUS = 46;
const STROKE = 11;

const point = (deg, r = RADIUS) => {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)];
};

// Hand-rolled semicircular gauge (green -> red across 20 segments) with a
// needle. `percent` is a 0..1 position on the fixed -30..50°C scale. Purely
// decorative: the temperature is announced textually by WeatherCard.
export default function Gauge({ percent }) {
  const clamped = Math.min(Math.max(percent, 0), 1);
  const gapDeg = 1.6;
  const segSpan = 180 / SEGMENTS;

  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    const startDeg = 180 - i * segSpan - gapDeg / 2;
    const endDeg = 180 - (i + 1) * segSpan + gapDeg / 2;
    const [x0, y0] = point(startDeg);
    const [x1, y1] = point(endDeg);
    const hue = 120 - (120 * i) / (SEGMENTS - 1); // green -> red
    return (
      <path
        key={i}
        d={`M ${x0} ${y0} A ${RADIUS} ${RADIUS} 0 0 1 ${x1} ${y1}`}
        stroke={`hsl(${hue}, 85%, 45%)`}
        strokeWidth={STROKE}
        strokeLinecap="butt"
        fill="none"
      />
    );
  });

  const needleDeg = 180 - clamped * 180;
  const [nx, ny] = point(needleDeg, RADIUS - STROKE);

  return (
    <div className="gauge" aria-hidden="true" data-testid="gauge">
      <svg viewBox="0 0 120 66" className="gauge-svg">
        {segments}
        <line
          x1={CX}
          y1={CY}
          x2={nx}
          y2={ny}
          stroke="#464a4f"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="5" fill="#464a4f" />
      </svg>
    </div>
  );
}
