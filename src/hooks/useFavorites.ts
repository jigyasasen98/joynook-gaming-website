"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "joynook_favorites";
const EVENT_NAME = "joynook_favorites_updated";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFavorites = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFavorites();

    const handleUpdate = () => {
      loadFavorites();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadFavorites]);

  const toggleFavorite = useCallback((slug: string) => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      let updated: string[];

      if (currentList.includes(slug)) {
        updated = currentList.filter((s) => s !== slug);
      } else {
        updated = [...currentList, slug];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error("Failed to update favorites in localStorage", e);
    }
  }, []);

  const isFavorite = useCallback(
    (slug: string) => {
      return favorites.includes(slug);
    },
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
}
