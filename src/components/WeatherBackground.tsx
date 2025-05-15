import React from 'react';
import { WeatherCondition } from '../types/weather';

interface WeatherBackgroundProps {
  condition: WeatherCondition;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition }) => {
  const renderWeatherElements = () => {
    switch (condition) {
      case 'Clear':
        return (
          <>
            <div className="sun-container">
              <div className="sun"></div>
              <div className="sun-rays"></div>
            </div>
            <div className="stars"></div>
          </>
        );
      case 'Clouds':
        return (
          <div className="clouds-container">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
            <div className="cloud cloud-4"></div>
            <div className="cloud cloud-5"></div>
          </div>
        );
      case 'Rain':
      case 'Drizzle':
        return (
          <>
            <div className="clouds-container">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
            </div>
            <div className="rain-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="raindrop" style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}></div>
              ))}
            </div>
          </>
        );
      case 'Snow':
        return (
          <>
            <div className="clouds-container">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
            </div>
            <div className="snow-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="snowflake" style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}></div>
              ))}
            </div>
          </>
        );
      case 'Thunderstorm':
        return (
          <>
            <div className="clouds-container dark">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
            </div>
            <div className="lightning-container">
              <div className="lightning"></div>
              <div className="lightning" style={{ animationDelay: '1.5s' }}></div>
            </div>
            <div className="rain-container heavy">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="raindrop" style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}></div>
              ))}
            </div>
          </>
        );
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return (
          <div className="mist-container">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mist-layer" style={{ 
                animationDelay: `${i * 2}s`
              }}></div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`weather-background ${condition.toLowerCase()}`}>
      <div className="gradient-overlay"></div>
      {renderWeatherElements()}
    </div>
  );
};

export default WeatherBackground;
