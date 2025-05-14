import React from 'react';
import { AirQuality } from '../types/weather';

interface AirQualityIndicatorProps {
  airQuality: AirQuality;
}

const AirQualityIndicator: React.FC<AirQualityIndicatorProps> = ({ airQuality }) => {
  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-rose-900';
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Air Quality</h3>
        <span className="text-white/60">{getAQILabel(airQuality.aqi)}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Pollutant
          label="PM2.5"
          value={airQuality.pm2_5}
          unit="μg/m³"
        />
        <Pollutant
          label="PM10"
          value={airQuality.pm10}
          unit="μg/m³"
        />
        <Pollutant
          label="CO"
          value={airQuality.co}
          unit="ppm"
        />
        <Pollutant
          label="SO2"
          value={airQuality.so2}
          unit="ppb"
        />
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getAQIColor(airQuality.aqi)} transition-all duration-500`}
          style={{ width: `${(airQuality.aqi / 500) * 100}%` }}
        />
      </div>
    </div>
  );
};

const Pollutant: React.FC<{
  label: string;
  value: number;
  unit: string;
}> = ({ label, value, unit }) => (
  <div className="text-center">
    <p className="text-white/60 text-sm">{label}</p>
    <p className="text-white font-medium">{value}</p>
    <p className="text-white/40 text-xs">{unit}</p>
  </div>
);

export default AirQualityIndicator;