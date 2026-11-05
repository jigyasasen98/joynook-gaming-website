"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "joynook_recent_games";
const EVENT_NAME = "joynook_recents_updated";

export function useRecentGames() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadRecents = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      } else {
        setRecentSlugs([]);
      }
    } catch {
      setRecentSlugs([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadRecents();

    const handleUpdate = () => {
      loadRecents();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, [loadRecents]);

  const addRecent = useCallback((slug: string) => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : [];
      const filtered = currentList.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, 8); // Keep last 8

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentSlugs(updated);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.error("Failed to update recents in localStorage", e);
    }
  }, []);

  return {
    recentSlugs,
    addRecent,
    isLoaded,
  };
}
