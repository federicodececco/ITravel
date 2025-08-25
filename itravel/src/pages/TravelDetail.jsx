import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';
import { getTravelById, getPagesByTravelId, supabase } from '../lib/supabase';

export default function TravelDetail() {
  const { travelId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [travel, setTravel] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    loadTravelData();
  }, [travelId]);

  const isAuthor = async (userId) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Errore nel recupero utente:', error);
        setAuth(false);
        return;
      }

      if (user && user.id === userId) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (error) {
      console.error('Errore nella verifica autore:', error);
      setAuth(false);
    }
  };

  const loadTravelData = async () => {
    try {
      setLoading(true);
      setError('');

      // Carica i dati del viaggio e le pagine in parallelo
      const [travelData, pagesData] = await Promise.all([
        getTravelById(travelId),
        getPagesByTravelId(travelId),
      ]);
      isAuthor(travelData.profile_id);
      setTravel(travelData);

      setPages(pagesData);
    } catch (err) {
      console.error('Errore caricamento dati:', err);
      setError('Errore nel caricamento dei dati del viaggio');
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (pageId) => {
    navigate(`/travel/${travelId}/page/${pageId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-white text-xl flex items-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3'></div>
          Caricamento...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-400 text-xl mb-4'>{error}</div>
          <button
            onClick={() => navigate('/travel')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Torna ai Viaggi
          </button>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-white text-xl mb-4'>Viaggio non trovato</div>
          <button
            onClick={() => navigate('/travel')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Torna ai Viaggi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
      {/* Header con immagine di copertina */}
      <div className='relative h-64 sm:h-80 lg:h-96 overflow-hidden'>
        <img
          src={travel.cover_image || '/placeholder.png'}
          alt={travel.title}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>

        {/* Pulsanti di navigazione */}
        <button
          onClick={() => navigate('/travel')}
          className='fixed top-4 left-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10'
        >
          <i className='fa-solid fa-arrow-left'></i>
        </button>

        {isMobile && (
          <button
            onClick={() => navigate(`/add/${travelId}/new-page`)}
            className='fixed top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10'
          >
            <i className='fa-solid fa-plus'></i>
          </button>
        )}

        {/* Informazioni del viaggio */}
        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2'>
            {travel.title}
          </h1>
          <div className='flex flex-wrap items-center gap-4 text-sm sm:text-base opacity-90'>
            <div className='flex items-center gap-2'>
              <i className='fa-solid fa-location-dot'></i>
              <span>{travel.place}</span>
            </div>
            {travel.start_date && (
              <div className='flex items-center gap-2'>
                <i className='fa-solid fa-calendar'></i>
                <span>
                  {formatDate(travel.start_date)}
                  {travel.end_date && ` - ${formatDate(travel.end_date)}`}
                </span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <i className='fa-solid fa-book'></i>
              <span>
                {pages.length} {pages.length === 1 ? 'pagina' : 'pagine'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-8 max-w-7xl mx-auto'>
        {/* Descrizione del viaggio */}
        {travel.description && (
          <div className='bg-[#e6d3b3] rounded-2xl p-6 sm:p-8 mb-8 shadow-lg'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4 text-gray-800'>
              Descrizione del viaggio
            </h2>
            <p className='text-gray-700 text-lg leading-relaxed whitespace-pre-wrap'>
              {travel.description}
            </p>
          </div>
        )}

        {/* Sezione pagine */}
        <div className='mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-6 text-center'>
            {pages.length > 0
              ? 'Le tue pagine di viaggio'
              : 'Nessuna pagina ancora'}
          </h2>

          {pages.length > 0 ? (
            <div
              className={`grid gap-6 ${
                isMobile
                  ? 'grid-cols-1'
                  : isTablet
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              }`}
            >
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => handlePageClick(page.id)}
                  className='group relative bg-[#e6d3b3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105'
                >
                  <div className='relative h-48 sm:h-56 overflow-hidden'>
                    <img
                      src={page.cover_image || '/placeholder.png'}
                      alt={page.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm'>
                      {formatDate(page.created_at)}
                    </div>
                  </div>

                  <div className='p-4 sm:p-6'>
                    <h3 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors'>
                      {page.title}
                    </h3>

                    {page.description && (
                      <div className='max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-300 ease-out'>
                        <p className='text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-300'>
                          {page.description.length > 120
                            ? `${page.description.substring(0, 120)}...`
                            : page.description}
                        </p>
                      </div>
                    )}

                    <div className='flex justify-between items-center mt-3'>
                      <span className='text-xs text-gray-500 font-medium'>
                        Pagina {index + 1}
                      </span>
                      <i className='fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all'></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center text-gray-400 py-12'>
              <i className='fa-solid fa-book-open text-6xl mb-4 opacity-50'></i>
              <p className='text-xl mb-2'>Ancora nessuna pagina</p>
              <p className='text-sm'>Inizia a documentare il tuo viaggio!</p>
            </div>
          )}
        </div>

        {/* Pulsante aggiungi pagina */}
        {auth && (
          <div className='text-center pb-20 md:pb-0'>
            <button
              onClick={() => navigate(`/add/${travelId}/new-page`)}
              className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
            >
              <i className='fa-solid fa-plus mr-2'></i>
              {pages.length > 0
                ? 'Aggiungi nuova pagina'
                : 'Crea la prima pagina'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
