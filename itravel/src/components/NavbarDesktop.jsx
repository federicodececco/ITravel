import { useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import { UserAuth } from '../contexts/AuthContext';

export default function NavbarDesktop() {
  const { logout } = UserAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
      <nav className=' fixed  top-3 left-4 right-4 mb-4 z-100'>
        <div className='navbar  bg-base-100/90 shadow-md  rounded-2xl'>
          <div className='flex-1'>
            <a className='btn btn-ghost text-xl' href='/'>
              ITravel
            </a>
          </div>
          <div className='flex-3 gap-2'>
            <input
              type='text'
              placeholder='Cerca'
              className='input input-bordered w-80'
            />
          </div>
          <div className=' gap-2'>
            <div className='dropdown dropdown-end'>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar'
              >
                <div className='w-10 rounded-full'>
                  {isLoading ? (
                    // Skeleton/placeholder mentre carica
                    <div className='w-full h-full bg-gray-300 animate-pulse rounded-full'></div>
                  ) : profile?.avatar_url ? (
                    <img alt='Profile avatar' src={profile.avatar_url} />
                  ) : (
                    // Icona default se non c'è avatar
                    <div className='w-full h-full bg-gray-400 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-6 h-6 text-gray-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
              >
                <li>
                  <a href='/profile'>
                    <i class='fa-solid fa-user'></i> Profilo
                  </a>
                </li>
                <li>
                  <a href='/travel'>
                    <i class='fa-solid fa-road'></i> I miei Viaggi
                  </a>
                </li>
                <li>
                  <a>
                    <i class='fa-solid fa-gear'></i> impostazioni
                  </a>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg transition-colors'
                  >
                    <i className='fa-solid fa-door-open text-base'></i>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
