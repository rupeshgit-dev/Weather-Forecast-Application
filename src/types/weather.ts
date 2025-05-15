export type WeatherCondition = 
  | 'Clear' 
  | 'Clouds' 
  | 'Rain' 
  | 'Drizzle' 
  | 'Snow' 
  | 'Thunderstorm' 
  | 'Mist' 
  | 'Fog'
  | 'Haze'
  | 'Dust'
  | 'Smoke'
  | 'Default';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  timezone: number;
  cod: number | string;
  detailed: {
    current: {
      dt: number;
      sunrise: number;
      sunset: number;
      temp: number;
      feels_like: number;
      humidity: number;
      wind_speed: number;
      weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
      }[];
    };
    hourly: any[];
    daily: any[];
  };
}

export interface AirQuality {
  pm2_5: number;
  pm10: number;
  co: number;
  so2: number;
  aqi: number;
}