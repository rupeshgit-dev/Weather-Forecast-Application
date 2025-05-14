import React from 'react';
import { Droplets, Wind } from 'lucide-react';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ humidity, windSpeed }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full mt-8">
      <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
        <div className="rounded-full bg-white/30 p-2">
          <Droplets size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-white">{humidity}%</span>
          <span className="text-sm text-white/80">Humidity</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4">
        <div className="rounded-full bg-white/30 p-2">
          <Wind size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-white">{windSpeed} km/h</span>
          <span className="text-sm text-white/80">Wind Speed</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;