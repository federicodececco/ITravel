import { viaggi } from '../../data/places';
import { useBreakpoint } from '../hooks/useScreenSize';
import { useNavigate } from 'react-router';
export default function MyTravels() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const navigate = useNavigate();
  return (
    <div className=' lg:my-20 gap-2 lg:mx-40 grid lg:grid-cols-3 lg:gap-4 relative mb-10 '>
      {viaggi.map((elem) => {
        return (
          <div
            onClick={() => navigate(`/details/${elem.id}/`)}
            className='card card-side bg-base-100 shadow-lg hover:cursor-pointer hover:bg-base-200'
          >
            <figure>
              <img src={elem.image} alt='image' />
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
      {isDesktop && (
        <button
          onClick={() => navigate('/travel/add')}
          className='card card-side bg-base-100 shadow-md hover:cursor-pointer hover:bg-base-200'
        >
          <figure className='border w-full text-7xl'>+</figure>
        </button>
      )}
      <button
        onClick={() => navigate('/travel/add')}
        className='btn btn-circle fixed bottom-17 right-5 text-2xl bg-slate-900/70  hover:bg-slate-900'
      >
        +
      </button>
    </div>
  );
}
