import { WeatherData } from '../types/weather';

const API_KEY = "dfb22403d8525c33047dc605a24dc1f5";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(`${API_URL}&appid=${API_KEY}&q=${city}`);
    const data = await response.json();
    
    if (data.cod === "404") {
      throw new Error("City not found");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};