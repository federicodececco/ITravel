import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session, signUpNewUser } = UserAuth();
  console.log(session);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signUpNewUser(
        formData.email.toLowerCase(),
        formData.password,
      );
      if (result.success) {
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
        setError('');
        navigate('/travel');
      }
    } catch (error) {
      setError("c'è stato un errore");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className='min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 font-[Playfair_Display]'>
      <div className='w-full max-w-md bg-[#e6d3b3] rounded-2xl p-6 sm:p-8 shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-2'>
            Registrati
          </h1>
          <p className='text-gray-600 text-lg'>Crea il tuo diario di viaggio</p>
        </div>

        <form onSubmit={handleSignUp} className='space-y-6'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl'>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor='email'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Inserisci la tua mail'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Inserisci una password'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-xl font-medium text-gray-700 mb-2'
            >
              Conferma password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-800 focus:outline-none text-lg'
              placeholder='Ripeti la password'
              disabled={isLoading}
            />
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
                Registrazione in corso...
              </div>
            ) : (
              'Registrati'
            )}
          </button>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Hai già un account?{' '}
            <Link
              to='/login'
              className='text-gray-800 font-semibold hover:underline'
            >
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
