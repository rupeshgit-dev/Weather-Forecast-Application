import { fetchWeatherData } from './api';

export const generateAIResponse = async (prompt: string): Promise<string> => {
  // Clean and extract location from the prompt
  const cleanPrompt = prompt.replace(/[?!.,]/g, '').toLowerCase();
  const words = cleanPrompt.split(' ');
  
  // Try to find location after prepositions or in the whole prompt
  let location = '';
  const locationPrepositions = ['in', 'at', 'for'];
  
  for (const prep of locationPrepositions) {
    const index = words.indexOf(prep);
    if (index !== -1 && words[index + 1]) {
      location = words[index + 1];
      break;
    }
  }

  // If no location found after prepositions, look for location keywords
  if (!location) {
    const weatherKeywords = ['weather', 'temperature', 'forecast'];
    for (const word of words) {
      if (!weatherKeywords.includes(word)) {
        location = word;
      }
    }
  }

  // If still no location, use the last word as location
  if (!location && words.length > 0) {
    location = words[words.length - 1];
  }

  // Capitalize the first letter of location
  location = location.charAt(0).toUpperCase() + location.slice(1);

  try {
    console.log('Fetching weather for:', location); // Debug log
    const weatherData = await fetchWeatherData(location);
    
    // Format the weather information
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    
    // Convert sunrise and sunset to local time
    const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

    // Create a detailed response
    return `📍 Current weather in ${weatherData.name}, ${weatherData.sys.country}:

🌡️ Temperature: ${temp}°C
🤔 Feels like: ${feelsLike}°C
☁️ Conditions: ${description}
💧 Humidity: ${humidity}%
💨 Wind speed: ${windSpeed} m/s
🌅 Sunrise: ${sunrise}
🌇 Sunset: ${sunset}

Would you like to know anything specific about the weather in ${weatherData.name}?`;

  } catch (error) {
    console.error('Weather fetch error:', error); // Debug log
    if (error instanceof Error && error.message.includes('404')) {
      return `I couldn't find weather data for "${location}". Please check the city name and try again.`;
    }
    return `I'm having trouble getting the weather data right now. Please try again in a moment. (Error: ${error instanceof Error ? error.message : 'Unknown error'})`;
  }
};
