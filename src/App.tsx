import React, { useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorMessage from './components/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator';
import VoiceSearch from './components/VoiceSearch';
import ChatBot from './components/ChatBot';
import { useWeather } from './hooks/useWeather';

function App() {
  const { 
    weatherData, 
    loading, 
    error, 
    getWeatherData, 
    getWeatherCondition 
  } = useWeather();

  // Auto refresh every minute
  useEffect(() => {
    if (weatherData) {
      const interval = setInterval(() => {
        getWeatherData(weatherData.name);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [weatherData, getWeatherData]);

  // Mock air quality data (replace with actual API data)
  const mockAirQuality = {
    pm2_5: 48,
    pm10: 36,
    co: 2,
    so2: 3,
    aqi: 48
  };

  const handleVoiceInput = (text: string) => {
    const cityMatch = text.match(/weather in ([a-zA-Z\s]+)/i);
    if (cityMatch) {
      getWeatherData(cityMatch[1]);
    } else {
      getWeatherData(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="flex gap-2">
          <SearchBar onSearch={getWeatherData} disabled={loading} />
          <VoiceSearch onVoiceInput={handleVoiceInput} />
        </div>
        
        {loading && <LoadingIndicator />}
        
        {error && <ErrorMessage message={error} />}
        
        {weatherData && !loading && !error && (
          <WeatherDisplay 
            data={weatherData}
            condition={getWeatherCondition}
            airQuality={mockAirQuality}
          />
        )}
      </div>
      
      <ChatBot />
    </div>
  );
}

export default App;