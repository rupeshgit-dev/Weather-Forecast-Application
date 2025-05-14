import React from 'react';
import { WeatherCondition } from '../types/weather';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudFog, CloudLightning, Snowflake, List as Mist, Wind, AlertTriangle } from 'lucide-react';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 120, 
  className = ''
}) => {
  const iconClasses = `weather-icon ${className}`;
  
  const getIcon = () => {
    switch(condition) {
      case 'Clear':
        return <Sun size={size} className={`${iconClasses} text-yellow-400`} />;
      case 'Clouds':
        return <Cloud size={size} className={`${iconClasses} text-gray-200`} />;
      case 'Rain':
        return <CloudRain size={size} className={`${iconClasses} text-blue-300`} />;
      case 'Drizzle':
        return <CloudDrizzle size={size} className={`${iconClasses} text-blue-200`} />;
      case 'Snow':
        return <Snowflake size={size} className={`${iconClasses} text-white`} />;
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <Mist size={size} className={`${iconClasses} text-gray-300`} />;
      case 'Thunderstorm':
        return <CloudLightning size={size} className={`${iconClasses} text-yellow-300`} />;
      case 'Dust':
      case 'Smoke':
        return <Wind size={size} className={`${iconClasses} text-gray-400`} />;
      default:
        return <CloudDrizzle size={size} className={`${iconClasses} text-gray-300`} />;
    }
  };

  return (
    <div className="animate-float">
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;