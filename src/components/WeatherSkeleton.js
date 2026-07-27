// Placeholder shown while a lookup is in flight. Mirrors the WeatherCard
// layout so the content doesn't jump when the real data arrives. Decorative,
// so it is hidden from screen readers (App announces loading via sr-only text).
export default function WeatherSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-icon" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-toggle" />
      <div className="skeleton skeleton-gauge" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton-forecast">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-day" />
        ))}
      </div>
    </div>
  );
}
