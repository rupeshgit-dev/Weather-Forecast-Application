import React, { useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import WeatherNews from './components/WeatherNews';
import WeatherBackground from './components/WeatherBackground';
import ChatBot from './components/ChatBot';
import VoiceSearch from './components/VoiceSearch';
import CurrentLocationWeather from './components/CurrentLocationWeather';
import { useWeather } from './hooks/useWeather';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

function App() {
  const { 
    weatherData, 
    loading, 
    error, 
    getWeatherData, 
    getWeatherCondition 
  } = useWeather();

  const currentCondition = weatherData ? getWeatherCondition(weatherData.weather[0].main) : 'Default';

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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

  useEffect(() => {
    // Request location access when app loads
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permission => {
          if (permission.state === 'prompt') {
            toast.loading('Please allow location access for weather updates', {
              duration: 4000,
              position: 'bottom-center'
            });
          }
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Toast container with mobile-friendly positioning */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'bg-gray-800 text-white',
          style: {
            background: 'rgba(31, 41, 55, 0.9)',
            color: 'white',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
      
      {/* Dynamic Background */}
      <WeatherBackground condition={currentCondition} />
      
      {/* Main container with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="relative mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Real-Time Weather Updates
          </h1>
          {/* CurrentLocationWeather is positioned absolutely */}
          <CurrentLocationWeather />
        </header>
        
        {/* Main content with responsive grid */}
        <main className="relative">
          <motion.div 
            className="relative z-10"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            {/* Hero Section with Animation */}
            <motion.div 
              className="text-center mb-8"
              variants={fadeIn}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Get instant weather information for any location
              </h1>
              <p className="text-xl text-gray-300">
                Search for a city or use your current location
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div 
              className="search-container backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg"
              variants={fadeIn}
            >
              <div className="flex gap-2">
                <SearchBar onSearch={getWeatherData} disabled={loading} />
                <VoiceSearch onVoiceInput={handleVoiceInput} disabled={loading} />
              </div>
              
              {/* Loading State */}
              {loading && (
                <motion.div 
                  className="mt-8 flex justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </motion.div>
              )}
              
              {/* Error State */}
              {error && (
                <motion.div 
                  className="mt-8 bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg text-center"
                  variants={fadeIn}
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Weather Display */}
            {weatherData && !loading && !error && (
              <motion.div 
                className="mt-8"
                variants={fadeIn}
              >
                <WeatherDisplay 
                  data={weatherData}
                  condition={currentCondition}
                  airQuality={mockAirQuality}
                />
              </motion.div>
            )}

            {/* Weather News Section */}
            <motion.div
              variants={fadeIn}
              className="mt-8"
            >
              <WeatherNews />
            </motion.div>
          </motion.div>
          
          {/* Chat Bot */}
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <ChatBot />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;