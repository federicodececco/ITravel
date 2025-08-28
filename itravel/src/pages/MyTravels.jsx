import { useEffect, useState } from 'react';
import { useBreakpoint } from '../hooks/useScreenSize';
import { useNavigate } from 'react-router';
import {
  getTravelsByUserIdCached,
  invalidateCache,
} from '../lib/supabase-cache';
import { useCachedData } from '../hooks/useCache';
import { UserAuth } from '../contexts/AuthContext';
import { BookOpen, Plus, MapPin, Calendar, User } from 'lucide-react';

export default function MyTravels() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const navigate = useNavigate();
  const { session } = UserAuth();

  const fetchUserTravels = () => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    return getTravelsByUserIdCached(session.user.id);
  };

  const {
    data: travels,
    loading,
    error,
    refresh: refreshTravels,
  } = useCachedData(`my-travels-${session?.user?.id}`, fetchUserTravels, {
    ttl: 5 * 60 * 1000, // 5 minuti
    enableCache: true,
    dependencies: [session?.user?.id],
  });

  const handleRefresh = () => {
    if (session?.user?.id) {
      invalidateCache.userTravels(session.user.id);
      refreshTravels();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const loadArr = [0, 0, 0, 0, 0, 0];

  if (loading) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
        <div className='pt-20 md:pt-28 pb-20'>
          <div className='px-4 max-w-7xl mx-auto'>
            <div className='text-center mb-12'>
              <h1 className='text-4xl md:text-6xl font-bold text-[#e6d3b3] mb-4'>
                I Miei Viaggi
              </h1>
              <p className='text-lg md:text-xl text-[#e6d3b3]/80 max-w-2xl mx-auto'>
                Caricamento dei tuoi viaggi...
              </p>
            </div>

            <div className='grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {loadArr.map((_, index) => (
                <div
                  key={index}
                  className='bg-[#e6d3b3] rounded-2xl overflow-hidden shadow-lg animate-pulse'
                >
                  <div className='h-48 sm:h-56 bg-gray-300'></div>
                  <div className='p-6 space-y-4'>
                    <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                    <div className='h-3 bg-gray-300 rounded w-full'></div>
                    <div className='h-3 bg-gray-300 rounded w-5/6'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
        <div className='pt-20 md:pt-28 pb-20'>
          <div className='px-4 max-w-7xl mx-auto'>
            <div className='text-center py-20'>
              <div className='bg-red-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                <i className='fa-solid fa-exclamation-triangle text-red-600 text-2xl'></i>
              </div>
              <h3 className='text-2xl font-bold text-[#e6d3b3] mb-4'>
                Errore nel caricamento
              </h3>
              <p className='text-[#e6d3b3]/80 mb-8'>
                Non è stato possibile caricare i tuoi viaggi. Riprova.
              </p>
              <button
                onClick={handleRefresh}
                className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                Riprova
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
      <div className='pt-20 md:pt-28 pb-20'>
        <div className='px-4 max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-6xl font-bold text-[#e6d3b3] mb-4'>
              I Miei Viaggi
            </h1>
            <p className='text-lg md:text-xl text-[#e6d3b3]/80 max-w-2xl mx-auto'>
              {travels?.length === 0
                ? 'Inizia a documentare le tue avventure'
                : `${travels?.length} ${travels?.length === 1 ? 'viaggio creato' : 'viaggi creati'}`}
            </p>

            {travels?.length > 0 && (
              <div className='mt-8 flex justify-center gap-8 text-[#e6d3b3]/70'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{travels?.length}</div>
                  <div className='text-sm'>Viaggi</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {travels?.reduce((total, travel) => {
                      return total + Math.floor(Math.random() * 10) + 1;
                    }, 0) || 0}
                  </div>
                  <div className='text-sm'>Pagine</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {travels?.reduce((total, travel) => {
                      return total + Math.floor(Math.random() * 20) + 5;
                    }, 0) || 0}
                  </div>
                  <div className='text-sm'>Foto</div>
                </div>
              </div>
            )}
          </div>

          {travels?.length === 0 ? (
            <div className='text-center py-20'>
              <div className='bg-[#e6d3b3] rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                <BookOpen size={32} className='text-gray-600' />
              </div>
              <h3 className='text-2xl font-bold text-[#e6d3b3] mb-4'>
                Nessun viaggio ancora
              </h3>
              <p className='text-[#e6d3b3]/80 mb-8 max-w-md mx-auto'>
                Non hai ancora creato nessun viaggio. Inizia a documentare le
                tue avventure e condividile con il mondo!
              </p>
              <button
                onClick={() => navigate('/travel/add')}
                className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto'
              >
                <Plus size={24} />
                Crea il tuo primo viaggio
              </button>
            </div>
          ) : (
            <>
              <div className='grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                {travels?.map((travel) => (
                  <div
                    key={travel.id}
                    onClick={() => navigate(`/details/${travel.id}/`)}
                    className='group bg-[#e6d3b3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform'
                  >
                    <div className='relative h-48 sm:h-56 overflow-hidden'>
                      <img
                        src={travel.cover_image || '/placeholder.png'}
                        alt={travel.title}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                      <div className='absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm'>
                        <i className='fa-solid fa-user mr-1'></i>
                        Mio
                      </div>

                      <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='flex items-center justify-between text-white'>
                          <span className='text-sm font-medium bg-black/50 px-2 py-1 rounded'>
                            Clicca per aprire
                          </span>
                          <BookOpen size={20} />
                        </div>
                      </div>
                    </div>

                    <div className='p-6'>
                      <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors line-clamp-2'>
                        {travel.title}
                      </h2>

                      <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3'>
                        {travel.description}
                      </p>

                      <div className='space-y-2 mb-4'>
                        {travel.place && (
                          <div className='flex items-center gap-2 text-xs text-gray-600'>
                            <MapPin size={12} className='text-green-600' />
                            <span>{travel.place}</span>
                          </div>
                        )}

                        {(travel.start_date || travel.end_date) && (
                          <div className='flex items-center gap-2 text-xs text-gray-600'>
                            <Calendar size={12} className='text-blue-600' />
                            <span>
                              {travel.start_date &&
                                formatDate(travel.start_date)}
                              {travel.start_date && travel.end_date && ' - '}
                              {travel.end_date && formatDate(travel.end_date)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='pt-4 border-t border-gray-300'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <div className='flex items-center gap-1'>
                              <i className='fa-solid fa-book-open'></i>
                              <span>
                                {Math.floor(Math.random() * 15) + 1} pagine
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <i className='fa-solid fa-camera'></i>
                              <span>
                                {Math.floor(Math.random() * 30) + 5} foto
                              </span>
                            </div>
                          </div>
                          <i className='fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isDesktop && (
                  <div
                    onClick={() => navigate('/travel/add')}
                    className='group bg-gray-800 hover:bg-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform border-2 border-dashed border-gray-600 flex items-center justify-center min-h-[320px]'
                  >
                    <div className='text-center'>
                      <Plus
                        size={48}
                        className='text-[#e6d3b3] mx-auto mb-4 group-hover:rotate-90 transition-transform duration-300'
                      />
                      <p className='text-[#e6d3b3] font-semibold text-lg'>
                        Nuovo Viaggio
                      </p>
                      <p className='text-[#e6d3b3]/70 text-sm mt-2'>
                        Clicca per creare
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className='text-center'>
                  <div className='flex gap-4 justify-center flex-wrap'>
                    <button
                      onClick={() => navigate('/')}
                      className='bg-gray-600 hover:bg-gray-700 text-[#e6d3b3] font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3'
                    >
                      <BookOpen size={24} />
                      Esplora altri viaggi
                    </button>
                    <button
                      onClick={() => navigate('/travel/add')}
                      className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3'
                    >
                      <Plus size={24} />
                      Nuovo viaggio
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
