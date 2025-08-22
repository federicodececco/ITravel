import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

export default function Map({ location }) {
  const [map, setMap] = useState(null);
  console.log(location);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_KEY,
  });
  let point = { lat: 0, lng: 0 };
  if (location) {
    point = { lat: location.lat, lng: location.lng };
  }

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(point);
    map.fitBounds(bounds);
    setMap(map);
  }, []);
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div className='p-3 relative '>
      <div className=' justify-center align-center h-30 w-90'>
        <GoogleMap
          mapContainerClassName='w-full h-full'
          center={point}
          zoom={15}
          options={{
            disableDefaultUI: false,
            zoomControl: false,
          }}
        >
          <Marker position={point} title='punto' />
          <div className='absolute  bg-[#e6d3b3]/40 h-full w-full top-0 left-0'></div>
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
}
