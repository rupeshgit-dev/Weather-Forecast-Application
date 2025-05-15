import React from 'react';
import { WeatherData, WeatherCondition, AirQuality } from '../types/weather';
import { format } from 'date-fns';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sun,
  Moon,
  MapPin,
  Globe,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherChart from './WeatherChart';
import AirQualityIndicator from './AirQualityIndicator';

interface WeatherDisplayProps {
  data: WeatherData;
  condition: WeatherCondition;
  airQuality: AirQuality;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  data, 
  condition,
  airQuality 
}) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'Clear':
        return <Sun className="w-20 h-20 text-yellow-400" />;
      case 'Clouds':
        return <Cloud className="w-20 h-20 text-gray-400" />;
      case 'Rain':
      case 'Drizzle':
        return <CloudRain className="w-20 h-20 text-blue-400" />;
      case 'Snow':
        return <CloudSnow className="w-20 h-20 text-white" />;
      case 'Thunderstorm':
        return <CloudLightning className="w-20 h-20 text-yellow-400" />;
      default:
        return <Cloud className="w-20 h-20 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Main Weather Card */}
      <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-lg border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Current Weather */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-white/80" />
              <h2 className="text-2xl font-semibold text-white">{data.name}</h2>
              {data.sys.country && (
                <span className="text-white/60 text-sm">{data.sys.country}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon()}
                <div>
                  <div className="text-6xl font-bold text-white">
                    {Math.round(data.main.temp)}°C
                  </div>
                  <div className="text-white/80 capitalize">{data.weather[0].description}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <Thermometer className="w-5 h-5" />
                <span>Feels like {Math.round(data.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Droplets className="w-5 h-5" />
                <span>Humidity {data.main.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Wind className="w-5 h-5" />
                <span>Wind {Math.round(data.wind.speed)} m/s</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Eye className="w-5 h-5" />
                <span>Visibility {(data.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                <span>Rise {format(new Date(data.sys.sunrise * 1000), 'HH:mm')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                <span>Set {format(new Date(data.sys.sunset * 1000), 'HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Air Quality */}
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Air Quality</h3>
              <AirQualityIndicator airQuality={airQuality} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Gauge className="w-5 h-5" />
                  <span>AQI: {airQuality.aqi}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Globe className="w-5 h-5" />
                  <span>PM2.5: {airQuality.pm2_5}</span>
                </div>
              </div>
            </div>

            {/* Weather Chart */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Temperature Trend</h3>
              <WeatherChart data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Weather Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {condition === 'Clouds' && (
          <div className="clouds-overlay">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="cloud-element"
                initial={{ x: -100, opacity: 0 }}
                animate={{ 
                  x: [null, 1000],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  delay: i * 3
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WeatherDisplay;