import { useNavigate } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';
import { useState } from 'react';
import { createTravel, uploadImage } from '../lib/supabase';

export default function NewTravel() {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);

      /* crea prev */
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      let coverImageUrl = null;
      if (coverImage) {
        const uploadResult = await uploadImage(
          coverImage,
          `travels/${Date.now()}_${coverImage.name}`,
        );
        coverImageUrl = uploadResult.publicUrl;
      }
      const travelData = {
        ...formData,
        coverImage: coverImageUrl,
        user_id: 1,
      };
      const newTravel = await createTravel(travelData);
      console.log('funionza!', newTravel);
      navigate(`/details/${newTravel.id}`);
    } catch (err) {
      console.error('Errore', err);
      setError('Errore durante la creazione del viaggio. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
    });
    setCoverImage(null);
    setPrevImage(null);
    navigate('/travel');
  };
  return (
    <section className='min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 font-[Playfair_Display] overflow-y-auto md:pt-20 pb-24 md:pb-0'>
      <div className='w-full max-w-md sm:max-w-lg md:max-w-xl bg-[#e6d3b3] rounded-2xl p-4 sm:p-6 shadow-lg text-lg text-black bg-[url(/test-bg.jpeg)] relative'>
        {/* Filtro colorato */}
        <div className='absolute inset-0 bg-[#e6d3b3] opacity-40 mix-blend-multiply rounded-2xl'></div>

        <div className='z-10 relative'>
          <div className='text-center pt-2 pb-6 text-3xl sm:text-4xl font-bold'>
            Nuovo Viaggio
          </div>

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='title' className='block text-xl sm:text-2xl mb-1'>
                Titolo del Viaggio *
              </label>
              <input
                id='title'
                name='title'
                type='text'
                value={formData.title}
                onChange={handleInputChange}
                required
                aria-label='Titolo del viaggio'
                className='w-full pr-2 pl-4 pt-2 pb-2 rounded-xl border-2 border-black text-base sm:text-lg'
                placeholder='Es. Viaggio a Roma'
              />
            </div>

            <div>
              <label
                htmlFor='location'
                className='block text-xl sm:text-2xl mb-1'
              >
                Destinazione *
              </label>
              <input
                id='location'
                name='location'
                type='text'
                value={formData.location}
                onChange={handleInputChange}
                required
                aria-label='Destinazione del viaggio'
                className='w-full pr-2 pl-4 pt-2 pb-2 rounded-xl border-2 border-black text-base sm:text-lg'
                placeholder='Es. Roma, Italia'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label
                  htmlFor='startDate'
                  className='block text-lg sm:text-xl mb-1'
                >
                  Data Inizio
                </label>
                <input
                  id='startDate'
                  name='startDate'
                  type='date'
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className='w-full pr-2 pl-4 pt-2 pb-2 rounded-xl border-2 border-black text-sm sm:text-base'
                />
              </div>
              <div>
                <label
                  htmlFor='endDate'
                  className='block text-lg sm:text-xl mb-1'
                >
                  Data Fine
                </label>
                <input
                  id='endDate'
                  name='endDate'
                  type='date'
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className='w-full pr-2 pl-4 pt-2 pb-2 rounded-xl border-2 border-black text-sm sm:text-base'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-xl sm:text-2xl mb-1'
              >
                Descrizione
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Descrivi il tuo viaggio...'
                aria-label='Descrizione del viaggio'
                className='w-full pr-2 pl-4 pt-2 pb-8 rounded-xl border-2 border-black text-base sm:text-lg resize-y min-h-[120px]'
              />
            </div>

            <div>
              <label
                htmlFor='coverImage'
                className='block text-xl sm:text-2xl mb-2'
              >
                Immagine di Copertina
              </label>
              <div className='border border-black rounded p-4 text-center'>
                <input
                  type='file'
                  id='coverImage'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
                <label htmlFor='coverImage' className='cursor-pointer block'>
                  {prevImage ? (
                    <img
                      src={prevImage}
                      alt='Preview immagine di copertina'
                      className='mx-auto w-32 h-32 object-cover rounded'
                    />
                  ) : (
                    <>
                      <img
                        src='/placeholder.png'
                        alt='Placeholder caricamento immagine'
                        className='mx-auto w-24 h-24 object-contain'
                      />
                      <p className='mt-2 text-sm'>
                        Carica immagine di copertina
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={handleCancel}
                disabled={isLoading}
                className='border border-black py-2 px-4 rounded hover:bg-gray-300 text-sm sm:text-base disabled:opacity-50'
              >
                Annulla
              </button>
              <button
                type='submit'
                disabled={isLoading || !formData.title || !formData.location}
                className='bg-black text-[#e6d3b3] py-2 px-6 rounded hover:bg-gray-800 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Creazione...' : 'Crea Viaggio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
