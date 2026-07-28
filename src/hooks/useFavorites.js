import { useState } from "react";

const STORAGE_KEY = "favorites";
const MAX_FAVORITES = 8;

const load = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persist = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Ignore storage errors (e.g. private mode / quota).
  }
};

// Pinned cities ({name, lat, lon}), persisted, newest first, capped.
export default function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  const isFavorite = (name) =>
    favorites.some((f) => f.name.toLowerCase() === (name || "").toLowerCase());

  const toggleFavorite = ({ name, lat, lon }) => {
    if (!name || lat == null || lon == null) return;
    setFavorites((prev) => {
      const next = isFavoriteIn(prev, name)
        ? prev.filter((f) => f.name.toLowerCase() !== name.toLowerCase())
        : [{ name, lat, lon }, ...prev].slice(0, MAX_FAVORITES);
      persist(next);
      return next;
    });
  };

  return { favorites, isFavorite, toggleFavorite };
}

const isFavoriteIn = (list, name) =>
  list.some((f) => f.name.toLowerCase() === name.toLowerCase());
