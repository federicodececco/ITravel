import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, Home, Map, Plus, User } from 'lucide-react';

import MobileSearch from './MobileSearch';

export default function DockBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(1);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      handleCloseMobileSearch();
      setActiveItem(1);
    } else if (path === '/travel') {
      handleCloseMobileSearch();
      setActiveItem(2);
    } else if (path.includes('/profile')) {
      handleCloseMobileSearch();
      setActiveItem(3);
    }
  }, [location.pathname]);

  const handleNavigation = (index, path) => {
    setActiveItem(index);
    navigate(path);
  };
  const handleSearchClick = () => {
    setShowMobileSearch(true);
    setActiveItem(0);
  };

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
    if (location.pathname === '/') {
      setActiveItem(1);
    }
  };
  return (
    <>
      <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 font-[Playfair_Display] '>
        <div className='bg-[#e6d3b3]/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#d4c49a] px-4 py-3'>
          <div className='flex items-center justify-center space-x-2'>
            <button
              onClick={handleSearchClick}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                activeItem === 0
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md scale-110'
                  : 'text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
              title='Ricerca'
            >
              <Search
                size={20}
                className='transition-transform group-hover:scale-110'
              />
              {activeItem === 0 && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse'></div>
              )}
            </button>

            <button
              onClick={() => handleNavigation(1, '/')}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                activeItem === 1
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md scale-110'
                  : 'text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
              title='Home'
            >
              <Home
                size={20}
                className='transition-transform group-hover:scale-110'
              />
              {activeItem === 1 && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
              )}
            </button>

            <button
              onClick={() => navigate('/travel/add')}
              className='group relative flex items-center justify-center w-14 h-14 bg-gray-800 hover:bg-gray-900 text-[#e6d3b3] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 mx-2'
              title='Aggiungi Viaggio'
            >
              <Plus
                size={24}
                className='transition-transform group-hover:rotate-90'
              />
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </button>

            <button
              onClick={() => handleNavigation(2, '/travel')}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                activeItem === 2
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md scale-110'
                  : 'text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
              title='I miei Viaggi'
            >
              <Map
                size={20}
                className='transition-transform group-hover:scale-110'
              />
              {activeItem === 2 && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              )}
            </button>

            <button
              onClick={() => handleNavigation(3, '/profile')}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                activeItem === 3
                  ? 'bg-gray-800 text-[#e6d3b3] shadow-md scale-110'
                  : 'text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
              title='Profilo'
            >
              <User
                size={20}
                className='transition-transform group-hover:scale-110'
              />
              {activeItem === 3 && (
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse'></div>
              )}
            </button>
          </div>
        </div>

        <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
          <div className='w-2 h-2 bg-[#e6d3b3] rounded-full shadow-md'></div>
        </div>
      </div>
      <MobileSearch
        isOpen={showMobileSearch}
        onClose={handleCloseMobileSearch}
      />
    </>
  );
}
