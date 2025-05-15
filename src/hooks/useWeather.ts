import { useState } from 'react';
import { WeatherData, WeatherCondition } from '../types/weather';
import { fetchWeatherData } from '../utils/api';

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = () => {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null
  });

  const getWeatherCondition = (condition: string): WeatherCondition => {
    const normalizedCondition = condition.toLowerCase();
    
    if (normalizedCondition.includes('clear')) return 'Clear';
    if (normalizedCondition.includes('cloud')) return 'Clouds';
    if (normalizedCondition.includes('rain')) return 'Rain';
    if (normalizedCondition.includes('drizzle')) return 'Drizzle';
    if (normalizedCondition.includes('snow')) return 'Snow';
    if (normalizedCondition.includes('mist')) return 'Mist';
    if (normalizedCondition.includes('fog')) return 'Fog';
    if (normalizedCondition.includes('haze')) return 'Haze';
    if (normalizedCondition.includes('thunder')) return 'Thunderstorm';
    if (normalizedCondition.includes('dust')) return 'Dust';
    if (normalizedCondition.includes('smoke')) return 'Smoke';
    
    return 'Default';
  };

  const getWeatherData = async (city: string) => {
    if (!city.trim()) return;
    
    setWeatherState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const data = await fetchWeatherData(city);
      console.log('Weather data received:', data);
      setWeatherState({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error in useWeather:', error);
      setWeatherState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
      }));
    }
  };

  return {
    weatherData: weatherState.data,
    loading: weatherState.loading,
    error: weatherState.error,
    getWeatherData,
    getWeatherCondition
  };
};