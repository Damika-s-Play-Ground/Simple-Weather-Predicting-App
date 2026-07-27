// City search form plus the "use my location" action and recent-search chips.
export default function SearchForm({
  onSearch,
  onUseLocation,
  recentSearches,
  onClearRecent,
  loading = false,
}) {
  return (
    <section className="form-section">
      <form
        role="search"
        aria-label="Search weather by city"
        aria-busy={loading}
        onSubmit={(e) => {
          e.preventDefault();
          if (loading) return; // Ignore submits (incl. Enter) while in flight.
          onSearch(e.currentTarget.elements.city.value);
        }}
      >
        <label htmlFor="city" className="sr-only">
          City
        </label>
        <input id="city" type="text" name="city" placeholder="City" />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
        <button
          type="button"
          className="location-button"
          onClick={onUseLocation}
          disabled={loading}
        >
          <span aria-hidden="true">📍 </span>Use my location
        </button>
      </form>
      {recentSearches.length > 0 && (
        <div className="recent-searches" aria-label="Recent searches">
          <span className="recent-label">Recent:</span>
          {recentSearches.map((city) => (
            <button
              key={city}
              type="button"
              className="recent-chip"
              aria-label={`Show weather for ${city}`}
              onClick={() => onSearch(city)}
              disabled={loading}
            >
              {city}
            </button>
          ))}
          <button
            type="button"
            className="recent-clear"
            aria-label="Clear recent searches"
            onClick={onClearRecent}
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
