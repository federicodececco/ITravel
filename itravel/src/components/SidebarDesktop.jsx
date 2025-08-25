import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

export default function SidebarDesktop() {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const { travelId } = useParams();
  <li>
    <a href='/'>
      <i className='fa-solid fa-house'></i>Home
    </a>
  </li>;
  return (
    <div className='fixed right-6 top-1/2 transform -translate-y-1/2 z-50'>
      <div className='bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-lg p-3 flex flex-col gap-3 border border-base-300'>
        <button
          onClick={() => navigate(`/`)}
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group ${
            activeItem === 0
              ? 'bg-primary text-primary-content shadow-lg'
              : 'bg-base-200 hover:bg-base-300 text-base-content'
          }`}
          title='Aggiungi Pagina'
        >
          <i className='fa-solid fa-house text-xl group-hover:rotate-360 transition-transform'></i>
        </button>
        <button
          onClick={() => navigate(`/add/${travelId}/new-page`)}
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group ${
            activeItem === 0
              ? 'bg-primary text-primary-content shadow-lg'
              : 'bg-base-200 hover:bg-base-300 text-base-content'
          }`}
          title='Aggiungi Pagina'
        >
          <i className='fa-solid fa-plus text-xl group-hover:rotate-90 transition-transform'></i>
        </button>

        {/* search da implementare */}
        <button
          onClick={() => {}}
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group ${
            activeItem === 1
              ? 'bg-secondary text-secondary-content shadow-lg'
              : 'bg-base-200 hover:bg-base-300 text-base-content'
          }`}
          title='Ricerca'
        >
          <i className='fa-solid fa-magnifying-glass text-xl group-hover:scale-110 transition-transform'></i>
        </button>

        <button
          onClick={() => {
            navigate('/travel');
          }}
          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group ${
            activeItem === 2
              ? 'bg-accent text-accent-content shadow-lg'
              : 'bg-base-200 hover:bg-base-300 text-base-content'
          }`}
          title='I miei Viaggi'
        >
          <i className='fa-solid fa-road text-xl group-hover:rotate-360 transition-transform'></i>
        </button>
      </div>
    </div>
  );
}
