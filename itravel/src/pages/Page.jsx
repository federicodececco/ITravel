import { useNavigate, useParams } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  getImagesForPage,
  getPageById,
  getPageNavigation,
} from '../lib/supabase';

import Map from '../components/Map';

const viaggio = {
  id: 1,
  title: 'Primo giorno a Roma',
  description:
    "Oggi abbiamo visitato il Colosseo e il Foro Romano. Un'esperienza incredibile immergersi nella storia di questa città eterna. La mattina era soleggiata e perfetta per camminare tra le rovine.",
  coverImage: '/placeholder.png',
  images: ['/placeholder.png', '/placeholder.png', '/placeholder.png'],
  date: '2024-08-15',
  longitude: '',
  latitude: '',
};

export default function Page() {
  const { travelId, pageId } = useParams();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [navigationData, setNavigationData] = useState({
    hasPrevious: false,
    hasNext: false,
    totalPages: 0,
    currentIndex: 1,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(null);

  useEffect(() => {
    loadPageData();
  }, [pageId, travelId]);

  useEffect(() => {
    console.log(pageData);
  }, [pageData]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError('');

      const [page, pageImages, navigation] = await Promise.all([
        getPageById(pageId),
        getImagesForPage(pageId),
        getPageNavigation(pageId, travelId),
      ]);

      setPageData(page);
      setImages(pageImages);
      setNavigationData(navigation);
      if (page.latitude != null && page.longitude != 0) {
        setPosition({ lat: page.latitude, lng: page.longitude });
      }
      console.log(position);
    } catch (err) {
      console.error('Errore caricamento pagina:', err);
      setError('Errore nel caricamento della pagina');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    const prevPageId = parseInt(pageId) - 1;
    setPosition(null);
    if (prevPageId > 0) {
      navigate(`/travel/${travelId}/page/${prevPageId}`);
    }
  };

  const handleNextPage = () => {
    const nextPageId = parseInt(pageId) + 1;
    setPosition(null);
    navigate(`/travel/${travelId}/page/${nextPageId}`);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? pageData.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === pageData.images.length - 1 ? 0 : prev + 1,
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const pageSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (navigationData.hasNext && !showImageModal) {
        handleNextPage();
      }
    },
    onSwipedRight: () => {
      if (navigationData.hasPrevious && !showImageModal) {
        handlePreviousPage();
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true, //da spegnere in prod
    delta: 10, //sensibilità
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  const imageSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const allImages = [
        pageData?.cover_image,
        ...images.map((img) => img.image_url),
      ].filter(Boolean);
      if (allImages.length > 1) {
        handleNextImage();
      }
    },
    onSwipedRight: () => {
      const allImages = [
        pageData?.cover_image,
        ...images.map((img) => img.image_url),
      ].filter(Boolean);
      if (allImages.length > 1) {
        handlePrevImage();
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    delta: 15,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });
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

  if (error || !pageData) {
    return (
      <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-400 text-xl mb-4'>
            {error || 'Pagina non trovata'}
          </div>
          <button
            onClick={() => navigate(`/details/${travelId}`)}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            Torna al Viaggio
          </button>
        </div>
      </div>
    );
  }

  const allImages = [
    pageData.cover_image,
    ...images.map((img) => img.image_url),
  ].filter(Boolean);

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-fixed relative'
      {...(!showImageModal ? pageSwipeHandlers : {})}
    >
      <div className='absolute inset-0 bg-[#1e1e1e] backdrop-blur-[0.5px]'></div>

      <div className='relative z-10 min-h-screen pb-10 md:pt-0 pt-20'>
        {/* Header fisso */}
        <div className='flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm fixed top-0 w-full z-50'>
          <button
            onClick={() => navigate(`/details/${travelId}`)}
            className='text-white hover:text-gray-300 transition-colors'
          >
            <i className='fa-solid fa-arrow-left text-xl'></i>
          </button>
          <div className='text-white text-center'>
            <h1 className='text-lg font-semibold'>
              Pagina {navigationData.currentIndex}
            </h1>
            <p className='text-sm opacity-80'>
              {navigationData.totalPages} pagine
            </p>
          </div>
          <div className='w-6'></div>
        </div>

        <div className='px-4 py-6 max-w-4xl mx-auto md:pt-20 md:mt-4'>
          {/* Contenuto principale della pagina */}
          <div className='bg-[url(/test-bg.jpeg)] backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-6'>
            {pageData.cover_image && (
              <div className='relative'>
                <img
                  src={pageData.cover_image}
                  alt={pageData.title}
                  className='w-full h-64 sm:h-80 object-cover cursor-pointer'
                  onClick={() => handleImageClick(0)}
                />
                <div className='absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg'>
                  {formatDate(pageData.created_at)}
                </div>
              </div>
            )}

            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>
                {pageData.title}
              </h2>
              {pageData.description && (
                <p className='text-gray-600 leading-relaxed text-lg whitespace-pre-wrap'>
                  {pageData.description}
                </p>
              )}
            </div>
          </div>
          {position != null && <Map location={position}></Map>}
          {/* Immagini aggiuntive */}
          {images.length > 0 && (
            <div className='bg-[#e6d3b3]/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-800'>
                Altre foto
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className='relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={image.image_url}
                      alt={`Foto ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigazione inferiore */}
        <div className='fixed bottom-0 left-0 right-0 bg-black/20 md:backdrop-blur-sm p-4'>
          <div className='flex justify-between items-center max-w-md mx-auto'>
            <button
              onClick={handlePreviousPage}
              disabled={!navigationData.hasPrevious}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                navigationData.hasPrevious
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <i className='fa-solid fa-chevron-left'></i>
              <span>Precedente</span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={!navigationData.hasNext}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                navigationData.hasNext
                  ? 'bg-slate-600 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Successiva</span>
              <i className='fa-solid fa-chevron-right'></i>
            </button>
          </div>
        </div>

        {/* Modal per visualizzazione immagini */}
        {showImageModal && allImages.length > 0 && (
          <div
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
            {...imageSwipeHandlers}
          >
            <div className='relative max-w-4xl w-full'>
              <button
                onClick={handleCloseModal}
                className='absolute top-4 right-4 text-white hover:text-gray-300 z-10'
              >
                <i className='fa-solid fa-times text-2xl'></i>
              </button>

              <img
                src={allImages[currentImageIndex]}
                alt={`Foto ${currentImageIndex + 1}`}
                className='w-full h-auto max-h-[80vh] object-contain rounded-lg'
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300'
                  >
                    <i className='fa-solid fa-chevron-left text-3xl'></i>
                  </button>

                  <button
                    onClick={handleNextImage}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300'
                  >
                    <i className='fa-solid fa-chevron-right text-3xl'></i>
                  </button>
                </>
              )}

              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white'>
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
