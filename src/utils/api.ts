import { WeatherData } from '../types/weather';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct";

export interface CitySearchResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch city suggestions');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error('Geocoding API Error:', error);
    return [];
  }
};

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    console.log('Fetching weather data for:', city);
    console.log('API URL:', `${OPENWEATHER_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY.slice(0, 4)}...`);
    
    const response = await fetch(
      `${OPENWEATHER_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    const weatherData: WeatherData = {
      name: data.name,
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity
      },
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg || 0
      },
      weather: data.weather.map((w: any) => ({
        id: w.id,
        main: w.main,
        description: w.description,
        icon: w.icon
      })),
      visibility: data.visibility,
      sys: {
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        country: data.sys.country
      },
      timezone: data.timezone,
      cod: data.cod,
      detailed: {
        current: {
          dt: data.dt,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          weather: data.weather.map((w: any) => ({
            id: w.id,
            main: w.main,
            description: w.description,
            icon: w.icon
          }))
        },
        hourly: [],
        daily: []
      }
    };
    
    console.log('Transformed weather data:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};