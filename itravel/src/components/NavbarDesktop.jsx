import { useLocation, useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import { UserAuth } from '../contexts/AuthContext';
import {
  Search,
  Home,
  Map,
  User,
  Settings,
  LogOut,
  Plus,
  Bell,
} from 'lucide-react';

export default function NavbarDesktop() {
  const { logout } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  useEffect(() => {
    loadProfile();
  }, []);
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className='fixed top-4 left-4 right-4 z-50 font-[Playfair_Display]'>
      <div className='bg-[#e6d3b3]/90 backdrop-sepia-60 backdrop-blur-xs rounded-2xl shadow-lg border border-[#d4c49a]'>
        <div className='flex items-center justify-between px-6 py-4'>
          {/* Logo */}
          <div className='flex items-center'>
            <button
              onClick={() => navigate('/')}
              className='text-2xl font-bold text-gray-800 hover:text-gray-900 transition-colors'
            >
              ITravel
            </button>
          </div>

          {/* Navigazione centrale */}
          <div className='hidden md:flex items-center space-x-6'>
            <button
              onClick={() => navigate('/')}
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
              onClick={() => navigate('/travel')}
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

          {/* Search Bar */}
          <div className='flex-1 max-w-md mx-6'>
            <div className='relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                size={20}
              />
              <input
                type='text'
                placeholder='Cerca viaggi, destinazioni...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-gray-800 placeholder-gray-500'
              />
            </div>
          </div>

          {/* Azioni utente */}
          <div className='flex items-center space-x-4'>
            {/* Pulsante aggiungi viaggio */}
            <button
              onClick={() => navigate('/travel/add')}
              className='bg-gray-800 hover:bg-gray-900 text-[#e6d3b3] p-2 rounded-xl transition-all hover:scale-105 shadow-md'
              title='Aggiungi nuovo viaggio'
            >
              <Plus size={20} />
            </button>

            {/* Notifiche */}
            <button className='text-gray-700 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-200 transition-all'>
              <Bell size={20} />
            </button>

            {/* Profilo utente */}
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

              {/* Menu dropdown profilo */}
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
                      onClick={() => navigate('/profile')}
                      className='w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      <User size={16} />
                      <span>Il mio Profilo</span>
                    </button>

                    <button
                      onClick={() => navigate('/settings')}
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

      {/* Overlay per chiudere il menu */}
      {showProfileMenu && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </nav>
  );
}
