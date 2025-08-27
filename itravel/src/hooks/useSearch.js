import { useState, useEffect, useCallback, useRef } from 'react';
import { searchTravels } from '../lib/supabase';

export const useSearch = (debounceMs = 300, options = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [lastSearchTime, setLastSearchTime] = useState(null);

  const abortControllerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const {
    maxResults = 50,
    minQueryLength = 2,
    saveHistory = true,
    includeUserTravels = true,
  } = options;

  const loadSearchHistory = useCallback(() => {
    if (saveHistory) {
      try {
        const saved = localStorage.getItem('search_history');
        if (saved) {
          setSearchHistory(JSON.parse(saved));
        }
      } catch (error) {
        console.warn('Errore caricamento cronologia ricerca:', error);
      }
    }
  }, [saveHistory]);

  const saveSearchHistory = useCallback(
    (query) => {
      if (saveHistory && query.trim().length >= minQueryLength) {
        setSearchHistory((prev) => {
          const newHistory = [
            query,
            ...prev.filter((item) => item !== query),
          ].slice(0, 10);
          try {
            localStorage.setItem('search_history', JSON.stringify(newHistory));
          } catch (error) {
            console.warn('Errore salvataggio cronologia ricerca:', error);
          }
          return newHistory;
        });
      }
    },
    [saveHistory, minQueryLength],
  );

  const performSearch = useCallback(
    async (query, immediate = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const trimmedQuery = query.trim();

      if (trimmedQuery.length < minQueryLength) {
        setResults([]);
        setShowResults(false);
        setError(null);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        const startTime = Date.now();
        setLastSearchTime(startTime);

        const searchResults = await searchTravels(trimmedQuery, {
          includeUserTravels,
          limit: maxResults,
          signal: abortControllerRef.current.signal,
        });

        if (startTime === lastSearchTime || immediate) {
          setResults(searchResults);
          setShowResults(true);
          saveSearchHistory(trimmedQuery);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Errore durante la ricerca:', err);
        setError('Errore durante la ricerca. Riprova.');
        setResults([]);
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    },
    [
      minQueryLength,
      includeUserTravels,
      maxResults,
      saveSearchHistory,
      lastSearchTime,
    ],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch, debounceMs]);

  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
    setIsSearching(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const hideResults = useCallback(() => {
    setShowResults(false);
  }, []);

  const searchImmediate = useCallback(
    (query) => {
      setSearchQuery(query);
      performSearch(query, true);
    },
    [performSearch],
  );

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (saveHistory) {
      try {
        localStorage.removeItem('search_history');
      } catch (error) {
        console.warn('Errore rimozione cronologia ricerca:', error);
      }
    }
  }, [saveHistory]);

  /*  const searchStats = {
    resultsCount: results.length,
    hasResults: results.length > 0,
    isValidQuery: searchQuery.trim().length >= minQueryLength,
    isEmptyQuery: searchQuery.trim().length === 0,
  }; */

  return {
    searchQuery,
    setSearchQuery,
    results,
    isSearching,
    error,
    showResults,

    searchHistory,
    clearHistory,

    clearSearch,
    hideResults,
    setShowResults,
    searchImmediate,

    minQueryLength,
    maxResults,
  };
};

export default useSearch;
