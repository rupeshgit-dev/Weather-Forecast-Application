import React from 'react';
import { Cloud, Sun } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="animate-spin-slow">
          <Sun className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="absolute top-0 left-0 animate-bounce-slow">
          <Cloud className="w-6 h-6 text-white/80" />
        </div>
      </div>
      <p className="text-white/80 text-sm animate-pulse">
        Fetching weather data...
      </p>
    </div>
  );
};

export default LoadingIndicator;