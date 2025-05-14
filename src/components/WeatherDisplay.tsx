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
  Moon
} from 'lucide-react';
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
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto space-y-6">
      {/* Main Temperature Display */}
      <div className="text-center">
        <h1 className="text-7xl font-bold text-white mb-2">
          {Math.round(data.main.temp)}°C
        </h1>
        <h2 className="text-2xl text-white/80">{data.name}</h2>
        <p className="text-lg text-white/60 capitalize mt-1">
          {data.weather[0].description}
        </p>
        <p className="text-white/60 mt-1">
          Feels like {Math.round(data.main.feels_like)}°C
        </p>
      </div>

      {/* Weather Chart */}
      <WeatherChart />

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={<Thermometer className="text-blue-400" />}
          value={`${data.main.humidity}%`}
          label="Humidity"
        />
        <MetricCard
          icon={<Wind className="text-green-400" />}
          value={`${Math.round(data.wind.speed)} km/h`}
          label="Wind Speed"
        />
        <MetricCard
          icon={<Eye className="text-purple-400" />}
          value={`${data.visibility / 1000} km`}
          label="Visibility"
        />
        <MetricCard
          icon={<Gauge className="text-red-400" />}
          value={`${data.main.pressure} hPa`}
          label="Pressure"
        />
      </div>

      {/* Air Quality */}
      <AirQualityIndicator airQuality={airQuality} />

      {/* Sunrise/Sunset */}
      <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Sun className="text-yellow-400" />
          <div>
            <p className="text-white/60 text-sm">Sunrise</p>
            <p className="text-white font-medium">
              {format(sunrise, 'HH:mm')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Moon className="text-blue-400" />
          <div>
            <p className="text-white/60 text-sm">Sunset</p>
            <p className="text-white font-medium">
              {format(sunset, 'HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
}> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
    {icon}
    <div>
      <p className="text-white font-medium">{value}</p>
      <p className="text-white/60 text-sm">{label}</p>
    </div>
  </div>
);

export default WeatherDisplay;