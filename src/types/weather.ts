export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  cod: string | number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  weather: {
    main: string;
    icon: string;
  }[];
}

export interface AirQuality {
  pm2_5: number;
  pm10: number;
  co: number;
  so2: number;
  aqi: number;
}

export type WeatherCondition = 
  | 'Clear' 
  | 'Clouds' 
  | 'Rain' 
  | 'Drizzle' 
  | 'Mist' 
  | 'Snow' 
  | 'Thunderstorm' 
  | 'Haze' 
  | 'Fog' 
  | 'Dust' 
  | 'Smoke' 
  | 'Default';