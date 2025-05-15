import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapPin, Thermometer, CloudRain, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

interface Location {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
}

const CurrentLocationWeather: React.FC = () => {
  const [locationWeather, setLocationWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locationFetchedRef = useRef(false);

  useEffect(() => {
    const fetchLocationWeather = async (latitude: number, longitude: number) => {
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem('currentLocationWeather');
        const cachedTime = localStorage.getItem('currentLocationWeatherTime');
        const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

        if (cachedData && cachedTime) {
          const parsedTime = parseInt(cachedTime);
          if (Date.now() - parsedTime < cacheExpiry) {
            setLocationWeather(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );

        const data = response.data;
        const weatherData = {
          name: data.name,
          main: {
            temp: data.main.temp,
            humidity: data.main.humidity,
          },
          weather: data.weather
        };

        setLocationWeather(weatherData);
        setLoading(false);

        // Cache the weather data
        localStorage.setItem('currentLocationWeather', JSON.stringify(weatherData));
        localStorage.setItem('currentLocationWeatherTime', Date.now().toString());

      } catch (err) {
        console.error('Error fetching location weather:', err);
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (!locationFetchedRef.current && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            locationFetchedRef.current = true;
            fetchLocationWeather(position.coords.latitude, position.coords.longitude);
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Unable to get location');
            setLoading(false);
          }
        );
      }
    };

    getLocation();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <div className="animate-pulse flex items-center gap-2 text-white/60">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-white/80 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Retry</span>
        </button>
      </div>
    );
  }

  if (!locationWeather) return null;

  return (
    <div className="fixed top-4 right-4 bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-white">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span className="font-medium">{locationWeather.name}</span>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span>{Math.round(locationWeather.main.temp)}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <span>{locationWeather.main.humidity}%</span>
        </div>
      </div>
      <div className="text-xs text-white/70 mt-1">
        {locationWeather.weather[0].description}
      </div>
    </div>
  );
};

export default CurrentLocationWeather;
