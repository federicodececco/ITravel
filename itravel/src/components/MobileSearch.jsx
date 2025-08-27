import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearch } from '../contexts/SearchContext';
import { useSearchHistory } from '../hooks/useSearchHistory.js';
import { Search, X, Clock, MapPin, Trash2 } from 'lucide-react';

export default function MobileSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const {
    searchQuery,
    updateSearchQuery,
    performSearch,
    clearSearch,
    isSearching,
    searchResults,
  } = useSearch();

  const {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    hasHistory,
  } = useSearchHistory();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    addToHistory(trimmedQuery);

    updateSearchQuery(trimmedQuery);
    performSearch(trimmedQuery);

    navigate('/');
    onClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    updateSearchQuery(value);

    if (value.trim().length >= 2) {
      performSearch(value);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(localQuery);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setLocalQuery('');
    updateSearchQuery('');
    clearSearch();
    setShowSuggestions(true);
    searchInputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[#1e1e1e] z-30 font-[Playfair_Display] min-h-screen'>
      <div className='bg-[#e6d3b3] p-4 shadow-lg'>
        <div className='flex items-center gap-3'>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-200 rounded-full transition-colors'
            aria-label='Chiudi ricerca'
          >
            <X size={24} className='text-gray-700' />
          </button>

          <div className='flex-1 relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              size={20}
            />
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Cerca viaggi, destinazioni...'
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className='w-full pl-10 pr-12 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-gray-800 placeholder-gray-500 text-lg'
            />

            {localQuery && (
              <button
                onClick={handleClear}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
              >
                <X size={20} />
              </button>
            )}
          </div>

          {localQuery.length >= 2 && (
            <button
              onClick={() => handleSearch(localQuery)}
              className='bg-gray-800 text-[#e6d3b3] px-4 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors'
            >
              Cerca
            </button>
          )}
        </div>

        {isSearching && (
          <div className='mt-2 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2'></div>
            <span className='text-gray-600 text-sm'>Ricerca in corso...</span>
          </div>
        )}
      </div>

      <div className='flex-1 overflow-y-auto bg-[#1e1e1e] text-white'>
        {!showSuggestions && localQuery.length >= 2 && (
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-[#e6d3b3] mb-4 flex items-center gap-2'>
              <Search size={18} />
              Risultati per "{localQuery}"
            </h3>

            {searchResults.length > 0 ? (
              <div className='space-y-3'>
                {searchResults.slice(0, 5).map((travel) => (
                  <div
                    key={travel.id}
                    onClick={() => {
                      navigate(`/details/${travel.id}`);
                      onClose();
                    }}
                    className='flex items-center gap-3 p-3 bg-[#e6d3b3] rounded-xl cursor-pointer hover:bg-[#d4c49a] transition-colors'
                  >
                    <img
                      src={travel.cover_image || '/placeholder.png'}
                      alt={travel.title}
                      className='w-12 h-12 rounded-lg object-cover'
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-gray-800 text-sm'>
                        {travel.title}
                      </h4>
                      <p className='text-gray-600 text-xs flex items-center gap-1'>
                        <MapPin size={12} />
                        {travel.place}
                      </p>
                    </div>
                  </div>
                ))}

                {searchResults.length > 5 && (
                  <button
                    onClick={() => {
                      navigate('/');
                      onClose();
                    }}
                    className='w-full py-2 text-center text-[#e6d3b3] text-sm hover:text-white transition-colors'
                  >
                    Vedi tutti i {searchResults.length} risultati
                  </button>
                )}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-400'>
                <Search size={48} className='mx-auto mb-3 opacity-50' />
                <p>Nessun risultato trovato</p>
                <p className='text-xs'>Prova con altri termini di ricerca</p>
              </div>
            )}
          </div>
        )}
        {showSuggestions && (
          <div className='p-4 space-y-6'>
            {hasHistory && (
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-semibold text-[#e6d3b3] flex items-center gap-2'>
                    <Clock size={18} />
                    Ricerche recenti
                  </h3>
                  <button
                    onClick={() => {
                      clearHistory();
                    }}
                    className='text-gray-400 hover:text-gray-300 p-1'
                    title='Cancella cronologia'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className='space-y-2'>
                  {searchHistory.slice(0, 5).map((search, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <button
                        onClick={() => handleSuggestionClick(search)}
                        className='flex-1 text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-3'
                      >
                        <Clock size={16} className='text-gray-400' />
                        <span>{search}</span>
                      </button>
                      <button
                        onClick={() => removeFromHistory(search)}
                        className='p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors'
                        title='Rimuovi'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='bg-gray-800 rounded-xl p-4'>
              <h4 className='font-semibold text-[#e6d3b3] mb-2'>
                Suggerimenti per la ricerca
              </h4>
              <ul className='text-sm text-gray-300 space-y-1'>
                <li>• Cerca per destinazione: "Roma", "Giappone"</li>
                <li>• Cerca per titolo: "Weekend romantico", "Avventura..."</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
