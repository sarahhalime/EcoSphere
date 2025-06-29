interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherAlert {
  id: number;
  type: string;
  severity: string;
  location: string;
  description: string;
  issued: string;
  expires: string;
  affectedArea: string;
  icon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// Location interface and data
export interface Location {
  id: number;
  name: string;
  region: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  riskFactors: string[];
  description: string;
}

export const MONITORED_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'California',
    region: 'Western United States',
    coordinates: {
      lat: 36.7783,
      lon: -119.4179
    },
    riskFactors: ['Wildfires', 'Drought', 'Heat Waves'],
    description: 'Major agricultural region facing severe climate challenges'
  },
  {
    id: 2,
    name: 'Amazon Rainforest',
    region: 'South America',
    coordinates: {
      lat: -3.4653,
      lon: -62.2159
    },
    riskFactors: ['Deforestation', 'Biodiversity Loss', 'Fires'],
    description: 'World\'s largest rainforest, crucial for global climate'
  },
  {
    id: 3,
    name: 'Great Barrier Reef',
    region: 'Australia',
    coordinates: {
      lat: -18.2871,
      lon: 147.6992
    },
    riskFactors: ['Coral Bleaching', 'Ocean Acidification', 'Rising Temperatures'],
    description: 'Largest coral reef system threatened by climate change'
  },
  {
    id: 4,
    name: 'Sahel Region',
    region: 'North Africa',
    coordinates: {
      lat: 14.4974,
      lon: 12.1000
    },
    riskFactors: ['Desertification', 'Drought', 'Food Security'],
    description: 'Transitional zone vulnerable to climate variability'
  },
  {
    id: 5,
    name: 'Arctic Circle',
    region: 'Arctic',
    coordinates: {
      lat: 66.5622,
      lon: -35.2744
    },
    riskFactors: ['Ice Melt', 'Permafrost Thaw', 'Ecosystem Disruption'],
    description: 'Polar region experiencing rapid warming'
  },
  {
    id: 6,
    name: 'Maldives',
    region: 'Indian Ocean',
    coordinates: {
      lat: 3.2028,
      lon: 73.2207
    },
    riskFactors: ['Sea Level Rise', 'Coral Bleaching', 'Extreme Weather'],
    description: 'Low-lying island nation threatened by rising seas'
  },
  {
    id: 7,
    name: 'Bangladesh Delta',
    region: 'South Asia',
    coordinates: {
      lat: 23.6850,
      lon: 90.3563
    },
    riskFactors: ['Flooding', 'Cyclones', 'Sea Level Rise'],
    description: 'Densely populated delta vulnerable to climate impacts'
  },
  {
    id: 8,
    name: 'Mediterranean Basin',
    region: 'Southern Europe',
    coordinates: {
      lat: 41.2020,
      lon: 17.8083
    },
    riskFactors: ['Heat Waves', 'Water Scarcity', 'Wildfires'],
    description: 'Region experiencing increasing climate extremes'
  }
];

// Geocoding using Open-Meteo
export const getCoordinates = async (location: string): Promise<Coordinates> => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
  );
  const data = await response.json();
  if (!data.results?.[0]) {
    throw new Error('Location not found');
  }
  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude
  };
};

// Get NWS grid endpoint for coordinates
const getNWSPoint = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    { headers: { 'User-Agent': 'SolutionsHacks-ClimateMonitoring' } }
  );
  return await response.json();
};

// Get current weather conditions
const getCurrentConditions = async (gridEndpoint: string) => {
  const response = await fetch(
    gridEndpoint,
    { headers: { 'User-Agent': 'SolutionsHacks-ClimateMonitoring' } }
  );
  return await response.json();
};

// Get active alerts for coordinates
const getAlerts = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
    { headers: { 'User-Agent': 'SolutionsHacks-ClimateMonitoring' } }
  );
  return await response.json();
};

// Map NWS severity to our severity levels
const mapSeverity = (nwsSeverity: string): string => {
  switch (nwsSeverity.toLowerCase()) {
    case 'extreme':
    case 'severe':
      return 'critical';
    case 'moderate':
      return 'high';
    case 'minor':
      return 'medium';
    default:
      return 'low';
  }
};

// Updated weather data function to focus on API data
export const getWeatherData = async (location: string): Promise<WeatherAlert[]> => {
  try {
    const alerts: WeatherAlert[] = [];
    const locationData = MONITORED_LOCATIONS.find(l => l.name === location);

    if (!locationData) {
      throw new Error(`Location not found: ${location}`);
    }

    console.log(`Fetching weather data for ${location} at coordinates: ${locationData.coordinates.lat},${locationData.coordinates.lon}`);

    // Try to get data from the NWS API
    try {
      // First get the NWS points data
      const pointsResponse = await fetch(
        `https://api.weather.gov/points/${locationData.coordinates.lat},${locationData.coordinates.lon}`,
        {
          headers: {
            'User-Agent': 'SolutionsHacks-ClimateMonitoring/1.0 (contact@solutionshacks.org)',
            'Accept': 'application/geo+json'
          }
        }
      );

      if (!pointsResponse.ok) {
        console.error(`NWS API error for ${location}: ${pointsResponse.status}`);
        throw new Error(`NWS API error: ${pointsResponse.status}`);
      }

      const pointsData = await pointsResponse.json();
      console.log(`Received points data for ${location}:`, pointsData);

      // Get forecast data for weather conditions
      const forecastUrl = pointsData.properties.forecast;
      const forecastResponse = await fetch(forecastUrl, {
        headers: {
          'User-Agent': 'SolutionsHacks-ClimateMonitoring/1.0 (contact@solutionshacks.org)',
          'Accept': 'application/geo+json'
        }
      });

      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();
      const currentForecast = forecastData.properties.periods[0];

      // Get active alerts
      const alertsResponse = await fetch(
        `https://api.weather.gov/alerts/active?point=${locationData.coordinates.lat},${locationData.coordinates.lon}`,
        {
          headers: {
            'User-Agent': 'SolutionsHacks-ClimateMonitoring/1.0 (contact@solutionshacks.org)',
            'Accept': 'application/geo+json'
          }
        }
      );

      if (!alertsResponse.ok) {
        throw new Error(`Alerts API error: ${alertsResponse.status}`);
      }

      const alertsData = await alertsResponse.json();

      // Process any actual NWS alerts
      if (alertsData.features && alertsData.features.length > 0) {
        alertsData.features.forEach((alert: any, index: number) => {
          const props = alert.properties;
          alerts.push({
            id: Date.now() + index,
            type: props.event || 'Weather Alert',
            severity: mapNWSSeverity(props.severity),
            location: locationData.name,
            description: props.headline || props.description || 'Weather alert for this area',
            issued: props.effective || new Date().toISOString(),
            expires: props.expires || new Date(Date.now() + 24*60*60*1000).toISOString(),
            affectedArea: locationData.region,
            icon: getWeatherIcon(props.event),
            temperature: currentForecast.temperature,
            humidity: Math.round(30 + Math.random() * 50), // NWS doesn't provide humidity directly
            windSpeed: Math.round(currentForecast.windSpeed * 1.60934) // Convert mph to km/h
          });
        });
      }

      // If no alerts from NWS, but we have extreme weather, create an alert based on conditions
      if (alerts.length === 0) {
        const temp = currentForecast.temperature;
        const tempF = temp; // Temperature is already in Fahrenheit
        const tempC = Math.round((tempF - 32) * 5/9); // Convert to Celsius
        const windSpeedKmh = Math.round(currentForecast.windSpeed * 1.60934);

        // Check if the conditions warrant an alert
        if (tempF > 95 || tempF < 32 || windSpeedKmh > 40) {
          const alertType = getAlertTypeFromConditions(tempF, windSpeedKmh);
          alerts.push({
            id: Date.now(),
            type: alertType,
            severity: getSeverityFromConditions(tempF, windSpeedKmh),
            location: locationData.name,
            description: `${alertType} in ${locationData.name}: ${currentForecast.detailedForecast}`,
            issued: new Date().toISOString(),
            expires: new Date(Date.now() + 12*60*60*1000).toISOString(),
            affectedArea: locationData.region,
            icon: getWeatherIcon(alertType),
            temperature: tempC,
            humidity: Math.round(30 + Math.random() * 50),
            windSpeed: windSpeedKmh
          });
        }
      }

    } catch (error) {
      console.error(`Error fetching NWS data for ${location}:`, error);
      throw error;
    }

    return alerts;
  } catch (error) {
    console.error(`Error in getWeatherData for ${location}:`, error);
    return [];
  }
};

// Map NWS severity to our application's severity levels
const mapNWSSeverity = (severity: string): string => {
  if (!severity) return 'medium';
  const severityLower = severity.toLowerCase();
  if (severityLower.includes('extreme')) return 'critical';
  if (severityLower.includes('severe')) return 'critical';
  if (severityLower.includes('moderate')) return 'high';
  if (severityLower.includes('minor')) return 'medium';
  return 'low';
};

// Generate alert type based on weather conditions
const getAlertTypeFromConditions = (tempF: number, windSpeed: number): string => {
  if (tempF > 95) return 'Extreme Heat Warning';
  if (tempF < 32) return 'Freezing Conditions';
  if (windSpeed > 40) return 'High Wind Advisory';
  return 'Weather Advisory';
};

// Determine severity based on conditions
const getSeverityFromConditions = (tempF: number, windSpeed: number): string => {
  if (tempF > 100 || tempF < 10 || windSpeed > 60) return 'critical';
  if (tempF > 95 || tempF < 32 || windSpeed > 40) return 'high';
  return 'medium';
};

// Map weather conditions to appropriate icons
const getWeatherIcon = (event: string): string => {
  if (!event) return '⚠️';
  const eventLower = event.toLowerCase();

  if (eventLower.includes('heat') || eventLower.includes('hot')) return '🔥';
  if (eventLower.includes('flood') || eventLower.includes('rain')) return '🌊';
  if (eventLower.includes('storm') || eventLower.includes('thunder')) return '⛈️';
  if (eventLower.includes('wind') || eventLower.includes('gale')) return '💨';
  if (eventLower.includes('snow') || eventLower.includes('blizzard')) return '❄️';
  if (eventLower.includes('ice') || eventLower.includes('freez')) return '🧊';
  if (eventLower.includes('fog')) return '🌫️';
  if (eventLower.includes('tornado')) return '🌪️';
  if (eventLower.includes('hurricane') || eventLower.includes('cyclone')) return '🌀';
  if (eventLower.includes('fire')) return '🔥';
  if (eventLower.includes('drought')) return '☀️';

  return '⚠️';
};
