import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';
import { getTravelById } from '../lib/supabase';

const fintoViaggio = {
  id: 1,
  title: 'Viaggio a Roma',
  description:
    'Un incredibile viaggio nella città eterna, tra storia, arte e cucina. Abbiamo esplorato i monumenti più famosi, gustato la cucina locale e vissuto momenti indimenticabili tra le strade di Roma.',
  coverImage: '/placeholder.png',
  startDate: '2024-08-15',
  endDate: '2024-08-20',
  location: 'Roma, Italia',
  pages: [
    {
      id: 1,
      title: 'Primo giorno - Colosseo',
      description:
        "Oggi abbiamo visitato il Colosseo e il Foro Romano. Un'esperienza incredibile immergersi nella storia di questa città eterna. La mattina era soleggiata e perfetta per camminare tra le rovine antiche...",
      coverImage: '/placeholder.png',
      date: '2024-08-15',
    },
    {
      id: 2,
      title: 'Secondo giorno - Vaticano',
      description:
        "Giornata dedicata alla Città del Vaticano. Abbiamo visitato i Musei Vaticani, la Cappella Sistina e la Basilica di San Pietro. L'arte e la spiritualità di questi luoghi sono davvero mozzafiato...",
      coverImage: '/placeholder.png',
      date: '2024-08-16',
    },
    {
      id: 3,
      title: 'Terzo giorno - Trastevere',
      description:
        "Esplorazione del caratteristico quartiere di Trastevere. Abbiamo passeggiato tra i vicoli medievali, gustato la cucina tradizionale romana e goduto dell'atmosfera bohémien del quartiere...",
      coverImage: '/placeholder.png',
      date: '2024-08-17',
    },
    {
      id: 4,
      title: 'Quarto giorno - Fontana di Trevi',
      description:
        'Giornata tra le fontane e le piazze più belle di Roma. Fontana di Trevi, Piazza di Spagna, Pantheon. Ogni angolo racconta una storia millenaria...',
      coverImage: '/placeholder.png',
      date: '2024-08-18',
    },
    {
      id: 5,
      title: 'Ultimo giorno - Villa Borghese',
      description:
        'Ultima giornata rilassante a Villa Borghese. Abbiamo visitato la Galleria Borghese e fatto una passeggiata nel parco prima di salutare questa meravigliosa città...',
      coverImage: '/placeholder.png',
      date: '2024-08-19',
    },
  ],
};
export default function TravelDetail() {
  const { travelId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTravel, setNewTravel] = useState(null);
  const fetchTravel = async (id) => {
    try {
      setLoading(true);
      const data = await getTravelById(id);
      setNewTravel(data);
      console.log(newTravel);
    } catch (error) {
      console.error('errore fetching viaggio', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravel(travelId);
    // simulazione di caricamento
    setTimeout(() => {
      setTravel(fintoViaggio);
      setLoading(false);
    }, 500);
  }, [travelId]);

  useEffect(() => {
    console.log(newTravel);
  }, [newTravel]);

  const handlePageClick = (pageId) => {
    navigate(`/travel/${travelId}/page/${pageId}`);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-white text-xl'>Caricamento...</div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-white text-xl'>Viaggio non trovato</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#1e1e1e] font-[Playfair_Display]'>
      <div className='relative h-64 sm:h-80 lg:h-96 overflow-hidden'>
        <img
          src={travel.cover_image}
          alt={travel.title}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>

        <button
          onClick={() => {
            navigate('/travel');
          }}
          className='fixed top-4 left-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10'
        >
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        {isMobile && (
          <button
            onClick={() => {
              navigate(`/add/${travelId}/new-page`);
            }}
            className='fixed top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10'
          >
            <i className='fa-solid fa-plus'></i>
          </button>
        )}

        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2'>
            {travel.title}
          </h1>
          <div className='flex flex-wrap items-center gap-4 text-sm sm:text-base opacity-90'>
            <div className='flex items-center gap-2'>
              <i className='fa-solid fa-location-dot'></i>
              <span>{travel.place}</span>
            </div>
            <div className='flex items-center gap-2'>
              <i className='fa-solid fa-calendar'></i>
              <span>
                {new Date(travel.start_date).toLocaleDateString('it-IT')} -{' '}
                {new Date(travel.end_date).toLocaleDateString('it-IT')}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <i className='fa-solid fa-book'></i>
              {/* <span>{travel.pages.length} pagine</span> */}
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-8 max-w-7xl mx-auto'>
        <div className='bg-[#e6d3b3] rounded-2xl p-6 sm:p-8 mb-8 shadow-lg'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-4 text-gray-800'>
            Descrizione del viaggio
          </h2>
          <p className='text-gray-700 text-lg leading-relaxed'>
            {travel.description}
          </p>
        </div>

        <div className='mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-6 text-center'>
            Le tue pagine di viaggio
          </h2>

          <div
            className={`grid gap-6 ${
              isMobile
                ? 'grid-cols-1'
                : isTablet
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
          >
            {travel.pages.map((page) => (
              <div
                key={page.id}
                onClick={() => handlePageClick(page.id)}
                className='group relative bg-[#e6d3b3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105'
              >
                <div className='relative h-48 sm:h-56 overflow-hidden'>
                  <img
                    src={page.coverImage}
                    alt={page.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                  <div className='absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm'>
                    {new Date(page.date).toLocaleDateString('it-IT')}
                  </div>
                </div>

                <div className='p-4 sm:p-6'>
                  <h3 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors'>
                    {page.title}
                  </h3>

                  <div className='max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-300 ease-out'>
                    <p className='text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-300'>
                      {page.description.substring(0, 120)}
                      {page.description.length > 120 ? '...' : ''}
                    </p>
                  </div>

                  <div className='flex justify-between items-center mt-3'>
                    <span className='text-xs text-gray-500 font-medium'>
                      Pagina {page.id}
                    </span>
                    <i className='fa-solid fa-arrow-right text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all'></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='text-center pb-15 md:pb-0 '>
          <button
            onClick={() => navigate(`/add/${travelId}/new-page`)}
            className='bg-[#e6d3b3] hover:bg-[#d4c49a] text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
          >
            <i className='fa-solid fa-plus mr-2'></i>
            Aggiungi nuova pagina
          </button>
        </div>
      </div>
    </div>
  );
}
