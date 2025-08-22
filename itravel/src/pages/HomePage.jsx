import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Map from '../components/Map';
export default function HomePage() {
  const [location, setLocation] = useState(null);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('errore fetching location', error);
        },
      );
    } else {
      console.error('geolocation not supported by browser');
    }
  };
  const position = [51.505, -0.09];

  return (
    <>
      <div>HomePage</div>
      <div>
        <h1>Geolocation App</h1>
        {/* create a button that is mapped to the function which retrieves the users location */}
        <button onClick={getLocation}>Get User Location</button>
        {/* if the user location variable has a value, print the users location */}
        {location && (
          <div>
            <h2>User Location</h2>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
      </div>
      <Map location={location}></Map>
    </>
  );
}
