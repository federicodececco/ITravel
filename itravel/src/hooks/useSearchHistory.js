import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'travel_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  const loadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Errore nel caricamento della cronologia ricerca:', error);
      setSearchHistory([]);
    }
  }, []);

  const addToHistory = useCallback((query) => {
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return;
    }

    const trimmedQuery = query.trim();

    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmedQuery.toLowerCase(),
      );

      const newHistory = [trimmedQuery, ...filtered].slice(
        0,
        MAX_HISTORY_ITEMS,
      );

      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Errore nel salvataggio della cronologia ricerca:', error);
      }

      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((query) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((item) => item !== query);

      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Errore nel salvataggio della cronologia ricerca:', error);
      }

      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Errore nella rimozione della cronologia ricerca:', error);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    hasHistory: searchHistory.length > 0,
  };
};
