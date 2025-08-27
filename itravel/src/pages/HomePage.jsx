import { useEffect, useMemo, useState } from 'react';
import { getTravels } from '../lib/supabase';
import { useNavigate } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';
import { BookOpen, Plus, MapPin, Calendar } from 'lucide-react';
const loadArr = [0, 0, 0, 0, 0, 0];
export default function HomePage() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [isLoading, setIsLoading] = useState(true);
  const [travels, setTravels] = useState([]);
  const navigate = useNavigate();

  const fetchTravel = async () => {
    try {
      setIsLoading(true);
      const data = await getTravels();
      setTravels(data);

      setIsLoading(false);
    } catch (error) {
      console.error("c'è stato un erorre col fetching dei dati");
      throw error;
    }
  };

  useEffect(() => {
    fetchTravel();
  }, []);
  const processedTravels = useMemo(() => {
    return travels.map((travel) => ({
      ...travel,
      username: travel?.profiles?.username || 'utente_sconosciuto',
      userAvatar: travel?.profiles?.avatar_url,
      userFullName:
        `${travel?.profiles?.first_name || ''} ${travel?.profiles?.last_name || ''}`.trim(),
    }));
  }, [travels]);

  if (isLoading) {
    return (
      <>
        <div className='lg:pt-25 min-h-screen'>
          <div className='  gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10 font-[Playfair_Display]'>
            {loadArr.map((elem, index) => {
              return (
                <div key={index}>
                  {' '}
                  <div className='skeleton lg:h-80 w-120'></div>{' '}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
  return (
    <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
      <div className='pt-20 md:pt-28 pb-20'>
        <div className='px-4 max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-6xl font-bold text-[#e6d3b3] mb-4'>
              Scopri il Mondo
            </h1>
            <p className='text-lg md:text-xl text-[#e6d3b3]/80 max-w-2xl mx-auto'>
              Esplora le avventure di altri viaggiatori e lasciati ispirare per
              la tua prossima destinazione
            </p>

            {travels.length > 0 && (
              <div className='mt-8 flex justify-center gap-8 text-[#e6d3b3]/70'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{travels.length}</div>
                  <div className='text-sm'>Viaggi condivisi</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {/* da emplementare eventualmente forse */}
                    {travels.reduce((total, travel) => {
                      return total + Math.floor(Math.random() * 10) + 1;
                    }, 0)}
                  </div>
                  <div className='text-sm'>Storie</div>
                </div>
                <div className='text-center'>
                  {/*  idem comparate */}
                  <div className='text-2xl font-bold'>
                    {Math.floor(Math.random() * 50) + 20}
                  </div>
                  <div className='text-sm'>Viaggiatori</div>
                </div>
              </div>
            )}
          </div>

          {processedTravels.length === 0 ? (
            <div className='text-center py-20'>
              <div className='bg-[#e6d3b3] rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                <BookOpen size={32} className='text-gray-600' />
              </div>
              <h3 className='text-2xl font-bold text-[#e6d3b3] mb-4'>
                Nessuna avventura da esplorare
              </h3>
              <p className='text-[#e6d3b3]/80 mb-8 max-w-md mx-auto'>
                Non ci sono ancora viaggi condivisi dalla community. Torna più
                tardi per scoprire nuove destinazioni!
              </p>
              <button
                onClick={() => navigate('/travel')}
                className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto'
              >
                <BookOpen size={24} />
                Vai ai tuoi viaggi
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 mb-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 `}
              >
                {processedTravels.map((travel) => (
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

                      <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='flex items-center justify-between text-white'>
                          <span className='text-sm font-medium bg-black/50 px-2 py-1 rounded'>
                            Clicca per esplorare
                          </span>
                          <BookOpen size={20} />
                        </div>
                      </div>
                    </div>
                    <div className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div
                          className='w-8 h-8 bg-gray-400 rounded-full flex-shrink-0 bg-cover bg-center'
                          style={{
                            backgroundImage: travel?.profiles?.avatar_url
                              ? `url(${travel.profiles.avatar_url})`
                              : 'none',
                          }}
                        >
                          {/* Mostra icona solo se non c'è avatar */}
                          {!travel?.profiles?.avatar_url && (
                            <div className='w-full h-full flex items-center justify-center'>
                              <i className='fa-solid fa-user text-white text-xs'></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-700'>
                            {travel?.profiles?.username}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {Math.floor(Math.random() * 30) + 1} giorni fa
                          </p>
                        </div>
                      </div>

                      <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors line-clamp-2'>
                        {travel.title}
                      </h2>

                      <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3'>
                        {travel.description}
                      </p>

                      <div className='mt-4 pt-4 border-t border-gray-300'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4 text-xs text-gray-500'>
                            <div className='flex items-center gap-1'>
                              <i className='fa-solid fa-heart'></i>
                              <span>
                                {Math.floor(Math.random() * 100) + 10}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <i className='fa-solid fa-comment'></i>
                              <span>{Math.floor(Math.random() * 20) + 2}</span>
                            </div>
                          </div>
                          <span className='text-xs text-gray-500 font-medium'>
                            Leggi il viaggio
                          </span>
                          <i className='fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all'></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!isMobile && (
                <div className='text-center'>
                  <div className='flex gap-4 justify-center flex-wrap'>
                    <button
                      onClick={() => navigate('/travel')}
                      className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3'
                    >
                      <BookOpen size={24} />I miei viaggi
                    </button>
                    <button
                      onClick={() => navigate('/travel/add')}
                      className='bg-black hover:bg-gray-800 text-[#e6d3b3] font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3'
                    >
                      <Plus size={24} />
                      Condividi un viaggio
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
