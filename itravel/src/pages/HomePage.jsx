import { useEffect, useState } from 'react';
import AIStatus from '../components/StatusAi';
import Map from '../components/Map';
import { getTravels } from '../lib/supabase';
import { useNavigate } from 'react-router';
const loadArr = [0, 0, 0, 0, 0, 0];
export default function HomePage() {
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
  if (isLoading) {
    return (
      <>
        <div className='lg:pt-25 min-h-screen'>
          <div className='  gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10 font-[Playfair_Display]'>
            {loadArr.map((elem) => {
              return (
                <div>
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
    <>
      <div className='lg:pt-25 min-h-screen'>
        <div>
          <AIStatus></AIStatus>
        </div>
        <div className='  gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10 font-[Playfair_Display]'>
          {travels.map((elem) => {
            return (
              <div
                key={elem.id}
                onClick={() => navigate(`/details/${elem.id}/`)}
                className='card card-side bg-base-100 shadow-lg hover:cursor-pointer hover:bg-base-200'
              >
                <figure>
                  <img src={elem.cover_image} alt='image' />
                </figure>
                <div className='card-body'>
                  <h2 className='card-title'>{elem.title}</h2>
                  <p>{elem.description}</p>
                  <div className='card-actions justify-center'>
                    <button className='btn btn-primary'>-</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
