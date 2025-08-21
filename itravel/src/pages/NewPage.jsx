import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBreakpoint } from '../hooks/useScreenSize';

export default function NewPage() {
  const defaultFormState = {
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  };
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { travelId } = useParams();
  const [formData, setFormData] = useState(defaultFormState);
  const [mainImage, setMainImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);

      /* crea prev */
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageChange = (index, file) => {
    const updated = [...additionalImages];
    updated[index] = file;
    setAdditionalImages(updated);
  };

  const handleCancel = () => {
    navigate(`/details/${travelId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let cover_image = null;
      if (mainImage) {
        const uploadResult = await uploadImage(mainImage, `pages`);
        cover_image = uploadResult.publicUrl;
      }
      if (additionalImages) {
        additionalImages.map((elem) => {});
      }
      const pageData = {
        ...formData,
      };
    } catch (error) {}
  };
  return (
    <section className='min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 font-[Playfair_Display]  overflow-y-auto md:pt-20 pb-24 md:pb-0 '>
      <div className=' w-full max-w-md sm:max-w-lg md:max-w-xl bg-[#e6d3b3] rounded-2xl p-4 sm:p-6 shadow-lg text-lg text-black bg-[url(/test-bg.jpeg)] relative'>
        {/* filtro colorato per cercare di fare un blend delle immagini di palceholder (scarsi risultati) */}
        <div className='absolute inset-0 bg-[#e6d3b3] opacity-40 mix-blend-multiply'></div>
        <div className='z-10 relative '>
          <div className='text-center pt-2 pb-6 text-3xl sm:text-4xl font-bold'>
            Nuova Pagina
          </div>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label htmlFor='title' className='block text-xl sm:text-2xl mb-1'>
                Titolo
              </label>
              <input
                id='title'
                name='title'
                type='text'
                value={formData.title}
                placeholder='titolo'
                onChange={handleInputChange}
                aria-label='Titolo della pagina'
                className='w-full pr-2 pl-4 pt-2 pb-2 rounded-xl border-2 border-black text-base sm:text-lg'
              />
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
                placeholder='Cosa hai fatto oggi?'
                aria-label='Descrizione della giornata'
                className='w-full pr-2 pl-4 pt-2 pb-8 rounded-xl border-2 border-black text-base sm:text-lg resize-y min-h-[120px]'
              ></textarea>
            </div>

            <div>
              <label
                htmlFor='mainImage'
                className='block text-xl sm:text-2xl mb-2'
              >
                Immagine di copertina
              </label>
              <div className='border border-black rounded p-4 text-center'>
                <input
                  type='file'
                  id='mainImage'
                  accept='image/*'
                  onChange={handleMainImageChange}
                  className='hidden'
                />
                <label htmlFor='mainImage' className='cursor-pointer block'>
                  <img
                    src='/placeholder.png'
                    alt='Placeholder caricamento immagine'
                    className='mx-auto w-24 h-24 object-contain'
                  />
                  <p className='mt-2 text-sm'>Carica immagine di copertina</p>
                </label>
              </div>
            </div>

            <div>
              <label className='block text-xl sm:text-2xl mb-2'>
                Altre immagini
              </label>
              <div className='grid grid-cols-5 gap-2 sm:gap-3'>
                {additionalImages.map((_, index) => (
                  <div key={index}>
                    <input
                      type='file'
                      id={`additionalImage${index}`}
                      accept='image/*'
                      onChange={(e) =>
                        handleAdditionalImageChange(index, e.target.files[0])
                      }
                      className='hidden'
                    />
                    <label
                      htmlFor={`additionalImage${index}`}
                      className='cursor-pointer'
                    >
                      <div className='w-full aspect-square bg-gray-200 border border-black rounded overflow-hidden flex items-center justify-center'>
                        {additionalImages[index] ? (
                          <img
                            src={URL.createObjectURL(additionalImages[index])}
                            alt={`Anteprima immagine ${index + 1}`}
                            className='object-cover w-full h-full'
                          />
                        ) : (
                          <img src='/placeholder.png' alt='Placeholder' />
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={handleCancel}
                className='border border-black py-2 px-4 rounded hover:bg-gray-300 text-sm sm:text-base'
              >
                Annulla
              </button>
              <button
                type='submit'
                className='bg-black text-[#e6d3b3] py-2 px-6 rounded hover:bg-gray-800 text-sm sm:text-base'
              >
                OK
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
