import { createContext, useContext, useState, useCallback } from 'react';
import { searchTravels } from '../lib/supabase';

const SearchContext = createContext(undefined);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const performSearch = useCallback(async (query) => {
    const trimmedQuery = query?.trim() || '';

    if (!trimmedQuery) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
      setSearchQuery('');
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setHasSearched(true);

      const results = await searchTravels(trimmedQuery);

      setSearchResults(results || []);
    } catch (error) {
      console.error('Errore ricerca:', error);
      setSearchError('Errore durante la ricerca');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query || '');
  }, []);

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    hasSearched,
    searchError,
    performSearch,
    clearSearch,
    updateSearchQuery,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
};
