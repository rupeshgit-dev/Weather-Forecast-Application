import React from 'react';
import { CloudRain } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8 animate-pulse">
      <CloudRain size={60} className="text-white/80 animate-bounce" />
      <p className="text-white/80 text-lg">Fetching weather data...</p>
    </div>
  );
};

export default LoadingIndicator;