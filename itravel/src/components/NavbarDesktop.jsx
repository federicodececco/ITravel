import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import { UserAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import {
  Search,
  Home,
  Map,
  User,
  Settings,
  LogOut,
  Plus,
  Bell,
  X,
} from 'lucide-react';

export default function NavbarDesktop() {
  const { logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    searchQuery,
    updateSearchQuery,
    performSearch,
    clearSearch,
    isSearching,
  } = useSearch();

  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      } catch (error) {
        console.error('errore parsing local storage', error);
      }
    }
    setIsLoading(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    updateSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      clearSearch();
      searchInputRef.current?.blur();
    } else if (event.key === 'Enter') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      searchInputRef.current?.blur();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    if (location.pathname !== '/') {
      navigate('/');
    }
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <nav className='fixed top-4 left-4 right-4 z-50 font-[Playfair_Display]'>
      <div className='bg-[#e6d3b3]/90 backdrop-sepia-60 backdrop-blur-xs rounded-2xl shadow-lg border border-[#d4c49a]'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center'>
            <button
              onClick={() => {
                navigate('/');

                if (searchQuery) {
                  performSearch(searchQuery);
                }
              }}
              className='text-2xl font-bold text-gray-800 hover:text-gray-900 transition-colors'
            >
              ITravel
            </button>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            <button
              onClick={() => {
                navigate('/');

                if (searchQuery) {
                  performSearch(searchQuery);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isActiveRoute('/')
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                clearSearch();
                navigate('/travel');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isActiveRoute('/travel')
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Map size={20} />
              <span>I miei Viaggi</span>
            </button>
          </div>

          <div className='flex-1 max-w-md mx-6 relative'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                size={20}
              />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Cerca viaggi, destinazioni...'
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className='w-full pl-10 pr-12 py-2 bg-white border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-gray-800 placeholder-gray-500 transition-colors'
              />

              <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                {isSearching ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500'></div>
                ) : searchQuery ? (
                  <button
                    onClick={handleClearSearch}
                    className='text-gray-500 hover:text-gray-700 transition-colors'
                    title='Pulisci ricerca'
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
            </div>

            {searchQuery && location.pathname !== '/' && (
              <div className='absolute top-full left-0 right-0 mt-1'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-2 text-center'>
                  <span className='text-xs text-blue-600'>
                    Premi Enter o clicca su Home per vedere i risultati
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={() => navigate('/travel/add')}
              className='bg-gray-800 hover:bg-gray-900 text-[#e6d3b3] p-2 rounded-xl transition-all hover:scale-105 shadow-md'
              title='Aggiungi nuovo viaggio'
            >
              <Plus size={20} />
            </button>

            <button className='text-gray-700 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-200 transition-all'>
              <Bell size={20} />
            </button>

            <div className='relative'>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-200 transition-all'
              >
                {isLoading ? (
                  <div className='w-8 h-8 bg-gray-300 animate-pulse rounded-full'></div>
                ) : (
                  <div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden'>
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt='Avatar'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <User size={16} className='text-white' />
                    )}
                  </div>
                )}
                <span className='text-gray-700 font-medium hidden lg:block'>
                  {isLoading ? 'Caricamento...' : profile?.username || 'Utente'}
                </span>
              </button>

              {showProfileMenu && (
                <div className='absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50'>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden'>
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt='Avatar'
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <User size={20} className='text-white' />
                        )}
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {profile?.username}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {profile?.first_name} {profile?.last_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='py-2'>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className='w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      <User size={16} />
                      <span>Il mio Profilo</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfileMenu(false);
                      }}
                      className='w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      <Settings size={16} />
                      <span>Impostazioni</span>
                    </button>
                  </div>

                  <div className='border-t border-gray-200 py-2'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <LogOut size={16} />
                      <span>Disconnetti</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProfileMenu && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
}
