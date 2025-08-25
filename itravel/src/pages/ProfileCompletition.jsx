import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserAuth } from '../contexts/AuthContext';
import {
  getProfile,
  supabase,
  updateProfile,
  uploadAvatarImage,
} from '../lib/supabase';

export default function ProfileCompletition() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarPrev, setAvatarPrev] = useState(null);
  const [error, setError] = useState('');
  const [avatarUrlOld, setAvatarUrlOld] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { session } = UserAuth();

  const navigate = useNavigate();

  const fetchProfile = async (userId) => {
    try {
      setIsLoading(true);
      const data = await getProfile(userId);
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        username: data.username || '',
      });

      if (data.avatar_url) {
        setAvatarUrlOld(data.avatar_url);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('errore fetching profilo');
      throw error;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPrev(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      let avatarUrlRes = avatarUrlOld;

      // Se c'è una nuova immagine da caricare
      if (avatarImage) {
        const uploadResult = await uploadAvatarImage(avatarImage, 'avatars');
        console.log('successo upload immagine', uploadResult.publicUrl);
        // Aggiorna l'URL con quello della nuova immagine caricata
        avatarUrlRes = uploadResult.publicUrl;
      }

      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username.toLowerCase(), // Converte in minuscolo
        avatar_url: avatarUrlRes, // Usa il nome campo corretto
      };
      console.log('profileData', profileData, 'user', session.user.id);

      const updatedProfile = await updateProfile(profileData, session.user.id);
      console.log('Profilo aggiornato con successo');
      navigate('/');
    } catch (error) {
      console.error('Errore', error);
      setError("Errore durante l'aggiornamento. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 font-[Playfair_Display]'>
      <div className='w-full max-w-md bg-[#e6d3b3] rounded-2xl p-6 sm:p-8 shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-2'>
            Completa il Profilo
          </h1>
          <p className='text-gray-600 text-lg'>
            Ultimi dettagli per iniziare il tuo viaggio
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl'>
              {error}
            </div>
          )}

          <div className='flex flex-col items-center mb-6'>
            <div className='relative'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-300 border-4 border-gray-400'>
                {/* Mostra prima la preview della nuova immagine, poi quella vecchia */}
                {avatarPrev ? (
                  <img
                    src={avatarPrev}
                    alt='Avatar preview'
                    className='w-full h-full object-cover'
                  />
                ) : avatarUrlOld ? (
                  <img
                    src={avatarUrlOld}
                    alt='Avatar attuale'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <i className='fa-solid fa-user text-2xl text-gray-500'></i>
                  </div>
                )}
              </div>
              <label
                htmlFor='avatar'
                className='absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors'
              >
                <i className='fa-solid fa-camera text-sm'></i>
              </label>
              <input
                type='file'
                id='avatar'
                accept='image/*'
                onChange={handleAvatarChange}
                className='hidden'
                disabled={isLoading}
              />
            </div>
            <p className='text-sm text-gray-600 mt-2'>
              Carica una foto profilo
            </p>
          </div>

          <div>
            <label
              htmlFor='firstName'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Nome
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Il tuo nome'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='lastName'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Cognome
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Il tuo cognome'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='username'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Scegli un username'
              disabled={isLoading}
            />
            <p className='text-sm text-gray-500 mt-1'>
              Verrà convertito automaticamente in minuscolo
            </p>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl text-lg font-semibold transition-all ${
              isLoading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gray-800 text-[#e6d3b3] hover:bg-gray-900 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                Creazione profilo...
              </div>
            ) : (
              'Completa Registrazione'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
