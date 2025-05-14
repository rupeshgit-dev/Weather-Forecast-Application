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
    
    setWeatherState({
      data: null,
      loading: true,
      error: null
    });

    try {
      const data = await fetchWeatherData(city);
      setWeatherState({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setWeatherState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred"
      });
    }
  };

  return {
    weatherData: weatherState.data,
    loading: weatherState.loading,
    error: weatherState.error,
    getWeatherData,
    getWeatherCondition: weatherState.data 
      ? getWeatherCondition(weatherState.data.weather[0].main) 
      : 'Default'
  };
};