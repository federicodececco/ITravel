import { useEffect, useState } from 'react';
import { useBreakpoint } from '../hooks/useScreenSize';
import { useNavigate } from 'react-router';
import {
  getTravelsByUserIdCached,
  invalidateCache,
} from '../lib/supabase-cache';
import { useCachedData } from '../hooks/useCache';
import { UserAuth } from '../contexts/AuthContext';

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

  const handleNewTravelCreated = () => {
    if (session?.user?.id) {
      invalidateCache.userTravels(session.user.id);
      invalidateCache.travels();
      invalidateCache.searchResults();
      refreshTravels();
    }
  };

  if (loading) {
    return (
      <div className='lg:pt-25 min-h-screen'>
        <div className='gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10 font-[Playfair_Display]'>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='skeleton lg:h-80 w-120'></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>
            Errore nel caricamento dei tuoi viaggi
          </p>
          <button
            onClick={handleRefresh}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='lg:pt-30 gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10'>
      {travels?.length === 0 ? (
        <div className='col-span-full text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <i className='fa-solid fa-suitcase-rolling text-6xl mb-4'></i>
            <p className='text-xl'>Non hai ancora creato nessun viaggio</p>
            <p className='text-sm'>Inizia a vivere le tue avventure!</p>
          </div>
          <button
            onClick={() => navigate('/travel/add')}
            className='bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors'
          >
            Crea il tuo primo viaggio
          </button>
        </div>
      ) : (
        travels?.map((elem) => (
          <div
            key={elem.id}
            onClick={() => navigate(`/details/${elem.id}/`)}
            className='card card-side bg-base-100 shadow-lg hover:cursor-pointer hover:bg-base-200 transition-colors'
          >
            <figure>
              <img
                src={elem.cover_image || '/placeholder.png'}
                alt={elem.title || 'Viaggio'}
                className='w-full h-32 object-cover'
              />
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{elem.title}</h2>
              <p className='text-sm text-gray-600 line-clamp-2'>
                {elem.description}
              </p>
              <div className='card-actions justify-end'>
                <span className='text-xs text-gray-500'>
                  {elem.place && ` ${elem.place}`}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      {isDesktop && travels?.length > 0 && (
        <button
          onClick={() => navigate('/travel/add')}
          className='card card-side bg-base-100 shadow-md hover:cursor-pointer hover:bg-base-200 border-2 border-dashed border-gray-300'
        >
          <figure className='border w-full text-7xl text-gray-400 flex items-center justify-center'>
            +
          </figure>
        </button>
      )}

      <button
        onClick={() => navigate('/travel/add')}
        className='btn btn-circle fixed bottom-17 right-5 text-2xl bg-slate-900/70 hover:bg-slate-900'
      >
        +
      </button>
    </div>
  );
}
