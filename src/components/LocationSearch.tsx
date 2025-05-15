import React, { useEffect, useRef, useState } from 'react';
import { initializeMap, searchPlace, LocationData } from '../utils/maps';

interface Props {
  onLocationSelect: (location: LocationData) => void;
}

const LocationSearch: React.FC<Props> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError('');
        const googleMap = await initializeMap(mapRef.current);
        setMap(googleMap);

        // Add click event listener
        googleMap.addListener('click', handleMapClick);

        // Create the search box
        if (searchInputRef.current) {
          const searchBox = new google.maps.places.SearchBox(searchInputRef.current);
          
          // Bias the SearchBox results towards current map's viewport.
          googleMap.addListener('bounds_changed', () => {
            searchBox.setBounds(googleMap.getBounds() as google.maps.LatLngBounds);
          });

          // Listen for search box events
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places && places.length > 0) {
              const place = places[0];
              if (place.geometry && place.geometry.location) {
                const location = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  address: place.formatted_address || '',
                  locality: place.address_components?.find(c => c.types.includes('locality'))?.long_name,
                  administrative_area: place.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name,
                  country: place.address_components?.find(c => c.types.includes('country'))?.long_name
                };
                handleLocationSelect(location);
              }
            }
          });
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to load Google Maps. Please check your internet connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []);

  const handleLocationSelect = async (location: LocationData) => {
    if (!map) return;

    try {
      // Update map view
      map.setCenter({ lat: location.lat, lng: location.lng });
      map.setZoom(12);

      // Update or create marker
      if (marker) {
        marker.setPosition({ lat: location.lat, lng: location.lng });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.address,
          animation: google.maps.Animation.DROP,
        });
        setMarker(newMarker);
      }

      // Call the parent callback
      onLocationSelect(location);
      setError('');
    } catch (err) {
      console.error('Location selection error:', err);
      setError('Failed to update location. Please try again.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    try {
      setError('');
      const location = await searchPlace(searchValue);
      handleLocationSelect(location);
    } catch (err) {
      console.error('Search error:', err);
      setError('Location not found. Please try a different search term.');
    }
  };

  const handleMapClick = async (e: google.maps.MouseEvent) => {
    try {
      setError('');
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const location: LocationData = {
        lat,
        lng,
        address: '',
      };

      // Update marker
      if (marker) {
        marker.setPosition({ lat, lng });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          animation: google.maps.Animation.DROP,
        });
        setMarker(newMarker);
      }

      // Get place details
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Failed to get place details'));
          }
        });
      });

      location.address = result.formatted_address || '';
      location.locality = result.address_components?.find(c => c.types.includes('locality'))?.long_name;
      location.administrative_area = result.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
      location.country = result.address_components?.find(c => c.types.includes('country'))?.long_name;

      onLocationSelect(location);
    } catch (err) {
      console.error('Map click error:', err);
      setError('Failed to get location details. Please try clicking a different area.');
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading || !searchValue.trim()}
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className="text-center text-gray-600">
          Loading Google Maps...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg shadow-md bg-gray-100"
      />
    </div>
  );
};

export default LocationSearch;
