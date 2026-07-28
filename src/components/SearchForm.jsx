import { useEffect, useRef, useState } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { fetchCitySuggestions, suggestionLabel } from "../api/geocoding";

// City search with debounced geocoding autocomplete (ARIA combobox), the
// "use my location" action, favorite chips, and recent-search chips.
export default function SearchForm({
  onSearch,
  onSearchCoords,
  onUseLocation,
  recentSearches,
  onClearRecent,
  favorites = [],
  loading = false,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(query, 300);
  const rootRef = useRef(null);
  const skipNextFetch = useRef(false); // don't re-open right after a selection

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (debounced.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    let cancelled = false;
    fetchCitySuggestions(debounced)
      .then((list) => {
        if (cancelled) return;
        setSuggestions(list);
        setOpen(list.length > 0);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  // Close the listbox on any click outside the search root.
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const selectSuggestion = (s) => {
    skipNextFetch.current = true;
    setQuery(s.name);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    onSearchCoords(s.lat, s.lon, s.name);
  };

  const onKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <section className="form-section" ref={rootRef}>
      <form
        role="search"
        aria-label="Search weather by city"
        aria-busy={loading}
        onSubmit={(e) => {
          e.preventDefault();
          if (loading) return; // Ignore submits (incl. Enter) while in flight.
          setOpen(false);
          onSearch(query);
        }}
      >
        <label htmlFor="city" className="sr-only">
          City
        </label>
        <div className="autocomplete">
          <input
            id="city"
            type="text"
            name="city"
            placeholder="City"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls="city-listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {open && (
            <ul id="city-listbox" role="listbox" className="suggestion-list">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.lat},${s.lon}`}
                  id={`city-option-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={
                    i === activeIndex ? "suggestion active" : "suggestion"
                  }
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep input focus
                    selectSuggestion(s);
                  }}
                >
                  {suggestionLabel(s)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
        <button
          type="button"
          className="btn btn-muted"
          onClick={onUseLocation}
          disabled={loading}
        >
          <span aria-hidden="true">📍 </span>Use my location
        </button>
      </form>
      {favorites.length > 0 && (
        <div className="recent-searches" aria-label="Favorite cities">
          <span className="recent-label">
            <span aria-hidden="true">★</span> Favorites:
          </span>
          {favorites.map((fav) => (
            <button
              key={`${fav.lat},${fav.lon}`}
              type="button"
              className="chip chip--solid"
              aria-label={`Show weather for favorite ${fav.name}`}
              onClick={() => onSearchCoords(fav.lat, fav.lon, fav.name)}
              disabled={loading}
            >
              {fav.name}
            </button>
          ))}
        </div>
      )}
      {recentSearches.length > 0 && (
        <div className="recent-searches" aria-label="Recent searches">
          <span className="recent-label">Recent:</span>
          {recentSearches.map((city) => (
            <button
              key={city}
              type="button"
              className="chip chip--solid"
              aria-label={`Show weather for ${city}`}
              onClick={() => onSearch(city)}
              disabled={loading}
            >
              {city}
            </button>
          ))}
          <button
            type="button"
            className="chip chip--ghost"
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
