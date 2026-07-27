// City search form plus the "use my location" action and recent-search chips.
export default function SearchForm({
  onSearch,
  onUseLocation,
  recentSearches,
}) {
  return (
    <section className="form-section">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(e.currentTarget.elements.city.value);
        }}
      >
        <input type="text" name="city" placeholder="City" />
        <button type="submit">Search</button>
        <button
          type="button"
          className="location-button"
          onClick={onUseLocation}
        >
          📍 Use my location
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
              onClick={() => onSearch(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
