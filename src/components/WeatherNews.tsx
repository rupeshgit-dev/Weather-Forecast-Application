import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronLeft, ChevronRight, RefreshCw, Thermometer, CloudRain } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface WeatherNews {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface CityWeather {
  name: string;
  temp: number;
  weather: string;
  rain?: boolean;
  previousWeather?: string;
}

const MAJOR_INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const WeatherNews: React.FC = () => {
  const [news, setNews] = useState<WeatherNews[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cityWeather, setCityWeather] = useState<CityWeather[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [apiLimitResetTime, setApiLimitResetTime] = useState<number | null>(null);

  const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  const shouldRefreshData = useCallback(() => {
    const now = Date.now();
    return now - lastFetchTime >= REFRESH_INTERVAL;
  }, [lastFetchTime]);

  const checkAndUpdateApiLimit = useCallback((error: any) => {
    // Check if error is due to rate limiting
    if (error?.response?.status === 429) {
      const now = Date.now();
      // Set reset time to 12 hours from now
      const resetTime = now + (12 * 60 * 60 * 1000);
      localStorage.setItem('newsApiResetTime', resetTime.toString());
      setApiLimitResetTime(resetTime);
      return true;
    }
    return false;
  }, []);

  const fetchCityWeather = useCallback(async (force = false) => {
    if (!force && !shouldRefreshData()) return;

    try {
      const cachedData = localStorage.getItem('cityWeatherData');
      const cachedTime = localStorage.getItem('cityWeatherTime');
      
      if (!force && cachedData && cachedTime) {
        const parsedTime = parseInt(cachedTime);
        if (Date.now() - parsedTime < REFRESH_INTERVAL) {
          setCityWeather(JSON.parse(cachedData));
          return;
        }
      }

      const weatherPromises = MAJOR_INDIAN_CITIES.map(city =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},in&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        )
      );

      const responses = await Promise.all(weatherPromises);
      const weatherData = responses.map(response => ({
        name: response.data.name,
        temp: Math.round(response.data.main.temp),
        weather: response.data.weather[0].main,
        rain: response.data.weather[0].main.toLowerCase().includes('rain'),
        previousWeather: cityWeather.find(c => c.name === response.data.name)?.weather
      }));

      // Check for weather changes and show notifications
      weatherData.forEach(city => {
        if (city.previousWeather && city.weather !== city.previousWeather) {
          if (city.rain) {
            toast.custom(
              <div className="bg-blue-500 shadow-lg rounded-lg overflow-hidden max-w-md w-full">
                <div className="p-4 flex items-start space-x-4">
                  <CloudRain className="h-6 w-6 text-white flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Rain Alert: {city.name}</h3>
                    <p className="text-blue-100 text-sm mt-1">
                      Weather changed from {city.previousWeather} to {city.weather}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else if (city.temp > 35) {
            toast.custom(
              <div className="bg-orange-500 shadow-lg rounded-lg overflow-hidden max-w-md w-full">
                <div className="p-4 flex items-start space-x-4">
                  <Thermometer className="h-6 w-6 text-white flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">High Temperature: {city.name}</h3>
                    <p className="text-orange-100 text-sm mt-1">
                      {city.temp}°C with {city.weather}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        }
      });

      // Update weather data if different
      if (JSON.stringify(weatherData) !== JSON.stringify(cityWeather)) {
        setCityWeather(weatherData);
      }
      setLastFetchTime(Date.now());
      
      // Cache the weather data
      localStorage.setItem('cityWeatherData', JSON.stringify(weatherData));
      localStorage.setItem('cityWeatherTime', Date.now().toString());

    } catch (error) {
      console.error('Error fetching city weather:', error);
      const isRateLimit = checkAndUpdateApiLimit(error);
      if (!isRateLimit) {
        toast.error('Failed to fetch weather updates');
      }
    }
  }, [cityWeather, checkAndUpdateApiLimit, shouldRefreshData]);

  const fetchNews = useCallback(async (force = false) => {
    if (!force && !shouldRefreshData()) return;

    try {
      const cachedNews = localStorage.getItem('weatherNews');
      const cachedTime = localStorage.getItem('weatherNewsTime');
      
      if (!force && cachedNews && cachedTime) {
        const parsedTime = parseInt(cachedTime);
        if (Date.now() - parsedTime < REFRESH_INTERVAL) {
          setNews(JSON.parse(cachedNews));
          setIsLoading(false);
          return;
        }
      }

      setIsRefreshing(true);
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=weather+climate+forecast&language=en&sortBy=publishedAt&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
      );

      const newsData = response.data.articles;
      setNews(newsData);
      setLastFetchTime(Date.now());
      
      // Cache the news data
      localStorage.setItem('weatherNews', JSON.stringify(newsData));
      localStorage.setItem('weatherNewsTime', Date.now().toString());

    } catch (error) {
      console.error('Error fetching news:', error);
      const isRateLimit = checkAndUpdateApiLimit(error);
      if (!isRateLimit) {
        toast.error('Failed to fetch news updates');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [checkAndUpdateApiLimit, shouldRefreshData]);

  // Initial fetch on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchCityWeather(true),
        fetchNews(true)
      ]);
    };

    initializeData();
  }, []);

  // Set up refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldRefreshData()) {
        fetchCityWeather();
        fetchNews();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCityWeather, fetchNews, shouldRefreshData]);

  // Effect to check API limit reset
  useEffect(() => {
    const checkApiReset = () => {
      const resetTime = localStorage.getItem('newsApiResetTime');
      if (resetTime && parseInt(resetTime) <= Date.now()) {
        // API limit has reset, fetch new news
        localStorage.removeItem('newsApiResetTime');
        setApiLimitResetTime(null);
        fetchNews();
      }
    };

    // Check every minute if API limit has reset
    const resetCheckInterval = setInterval(checkApiReset, 60 * 1000);
    return () => clearInterval(resetCheckInterval);
  }, [fetchNews]);

  // Auto-slide effect - keep slides moving every 5 seconds
  useEffect(() => {
    if (news.length === 0) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === news.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [news.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="weather-news-container backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-lg border border-white/20">
      <Toaster 
        position="bottom-left"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      <h2 className="text-sm text-white/90 font-medium mb-6">
        Weather News India
      </h2>

      <div className="relative overflow-hidden rounded-2xl mb-8">
        {isRefreshing && (
          <div className="absolute top-2 right-2 z-20">
            <RefreshCw className="w-4 h-4 text-white refresh-icon" />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video"
          >
            {news[currentSlide]?.urlToImage && (
              <img
                src={news[currentSlide].urlToImage}
                alt={news[currentSlide].title}
                className="w-full h-full object-cover rounded-xl"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl">
              <div className="absolute bottom-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {news[currentSlide]?.title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {news[currentSlide]?.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Real-time Weather Updates */}
      <div className="mb-8">
        <h3 className="text-sm text-white/90 font-medium mb-4">
          Real-time Weather Updates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* High Temperature Cities */}
          <div className="p-4 rounded-xl backdrop-blur-sm bg-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h4 className="text-white font-medium">Highest Temperatures</h4>
            </div>
            <div className="space-y-2">
              {cityWeather
                .sort((a, b) => b.temp - a.temp)
                .slice(0, 3)
                .map((city) => (
                  <div key={city.name} className="flex justify-between text-sm">
                    <span className="text-white/80">{city.name}</span>
                    <span className="text-orange-400 font-medium">{city.temp}°C</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Currently Raining */}
          <div className="p-4 rounded-xl backdrop-blur-sm bg-white/5">
            <div className="flex items-center gap-2 mb-3">
              <CloudRain className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-medium">Currently Raining</h4>
            </div>
            <div className="space-y-2">
              {cityWeather
                .filter(city => city.rain)
                .map((city) => (
                  <div key={city.name} className="flex justify-between text-sm">
                    <span className="text-white/80">{city.name}</span>
                    <span className="text-blue-400">{city.weather}</span>
                  </div>
                ))}
              {!cityWeather.some(city => city.rain) && (
                <p className="text-white/60 text-sm">No rain reported</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trending News List */}
      <div className="space-y-4">
        <h3 className="text-sm text-white/90 font-medium mb-4">
          Latest Weather News
        </h3>
        <div className="grid gap-4">
          {news.slice(0, 5).map((item, index) => (
            <motion.a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex gap-4">
                {item.urlToImage && (
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="text-white font-medium mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>{item.source.name}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherNews;
