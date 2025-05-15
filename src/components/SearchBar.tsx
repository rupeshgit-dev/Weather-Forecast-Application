import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { searchCities, CitySearchResult } from '../utils/api';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, disabled = false }) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim()) {
        try {
          const results = await searchCities(debouncedQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Show suggestions immediately when typing
    if (value.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: CitySearchResult) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-12 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          autoComplete="off"
        />
        <button
          onClick={handleSearch}
          disabled={disabled || !query.trim()}
          className="absolute right-2 p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center px-4 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-blue-500/50' : 'hover:bg-gray-700/50'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-white">{suggestion.name}</span>
              {suggestion.state && (
                <span className="ml-1 text-sm text-gray-400">{suggestion.state}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;