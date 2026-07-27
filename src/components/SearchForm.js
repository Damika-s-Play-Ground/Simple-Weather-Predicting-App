// City search form plus the "use my location" action and recent-search chips.
export default function SearchForm({
  onSearch,
  onUseLocation,
  recentSearches,
  onClearRecent,
}) {
  return (
    <section className="form-section">
      <form
        role="search"
        aria-label="Search weather by city"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(e.currentTarget.elements.city.value);
        }}
      >
        <label htmlFor="city" className="sr-only">
          City
        </label>
        <input id="city" type="text" name="city" placeholder="City" />
        <button type="submit">Search</button>
        <button
          type="button"
          className="location-button"
          onClick={onUseLocation}
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
