import React, { useState, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled = false }) => {
  const [city, setCity] = useState<string>('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (city.trim() && !disabled) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter city name"
        className="flex-1 py-2 px-4 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 
                  border-2 border-transparent focus:border-white/50 outline-none 
                  transition-all duration-300 shadow-lg"
        disabled={disabled}
      />
      <button
        onClick={handleSearch}
        disabled={disabled}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm
                  text-gray-800 shadow-lg hover:bg-white/100 transition-all duration-300
                  disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Search for city"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;