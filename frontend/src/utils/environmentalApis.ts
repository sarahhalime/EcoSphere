// Comprehensive Environmental Data APIs Integration
// This file provides access to real-time environmental data from multiple sources

// API Configuration
const API_KEYS = {
  NASA: import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY',
  GBIF: '', // GBIF doesn't require API key
  OPEN_WEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  WORLD_BANK: '', // World Bank Open Data doesn't require API key
  USGS: '', // USGS doesn't require API key for most endpoints
  ESA: import.meta.env.VITE_ESA_API_KEY,
  NOAA: import.meta.env.VITE_NOAA_API_KEY,
  IUCN: import.meta.env.VITE_IUCN_API_KEY,
};

// Data Interfaces
export interface ForestCoverageData {
  country: string;
  year: number;
  forestArea: number; // in hectares
  forestPercent: number;
  change: number;
  source: string;
}

export interface BiodiversityData {
  speciesCount: number;
  threatenedSpecies: number;
  extinctSpecies: number;
  region: string;
  taxonKey?: number;
  scientificName?: string;
  conservationStatus?: string;
}

export interface ClimateData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  location: string;
  timestamp: string;
}

export interface SatelliteImagery {
  imageUrl: string;
  date: string;
  location: string;
  coordinates: [number, number];
  type: 'deforestation' | 'fire' | 'flood' | 'drought';
  source: string;
}

export interface OceanData {
  seaLevel: number;
  temperature: number;
  salinity: number;
  phLevel: number;
  location: string;
  depth?: number;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
  location: string;
  timestamp: string;
}

// =============================================================================
// 1. FOREST DATA APIS
// =============================================================================

/**
 * Fetch forest coverage data from World Bank API
 */
export const getWorldBankForestData = async (countryCode: string = 'WLD'): Promise<ForestCoverageData[]> => {
  try {
    const response = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/AG.LND.FRST.ZS?format=json&date=2010:2022&per_page=50`
    );
    
    if (!response.ok) throw new Error('World Bank API failed');
    
    const data = await response.json();
    const forestData = data[1] || [];
    
    return forestData
      .filter((item: any) => item.value !== null)
      .map((item: any) => ({
        country: item.country.value,
        year: parseInt(item.date),
        forestArea: 0, // World Bank provides percentage, not area
        forestPercent: item.value,
        change: 0, // Calculate separately
        source: 'World Bank'
      }))
      .sort((a: any, b: any) => b.year - a.year);
  } catch (error) {
    console.error('World Bank forest data error:', error);
    return [];
  }
};

/**
 * Fetch NASA MODIS land cover data
 */
export const getNASALandCoverData = async (lat: number, lon: number): Promise<any> => {
  try {
    const response = await fetch(
      `https://modis.gsfc.nasa.gov/services/json/MODIS/${lat},${lon}`,
      {
        headers: {
          'User-Agent': 'EcoSphere/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error('NASA MODIS API failed');
    
    return await response.json();
  } catch (error) {
    console.error('NASA land cover data error:', error);
    return null;
  }
};

/**
 * Fetch Global Forest Watch data via WRI API
 */
export const getGlobalForestWatchData = async (iso: string = 'BRA'): Promise<any> => {
  try {
    // Global Forest Watch uses various endpoints
    const response = await fetch(
      `https://production-api.globalforestwatch.org/v1/forest-change/loss-by-year/country/${iso}?period=2010,2022`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) throw new Error('Global Forest Watch API failed');
    
    return await response.json();
  } catch (error) {
    console.error('Global Forest Watch data error:', error);
    return null;
  }
};

// =============================================================================
// 2. BIODIVERSITY APIS
// =============================================================================

/**
 * Fetch species data from GBIF (Global Biodiversity Information Facility)
 */
export const getGBIFSpeciesData = async (taxonKey?: number, limit: number = 20): Promise<BiodiversityData[]> => {
  try {
    const baseUrl = 'https://api.gbif.org/v1/species';
    const url = taxonKey 
      ? `${baseUrl}/${taxonKey}/children?limit=${limit}`
      : `${baseUrl}/search?limit=${limit}&status=ACCEPTED`;
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('GBIF API failed');
    
    const data = await response.json();
    const results = data.results || [];
    
    return results.map((species: any) => ({
      speciesCount: 1,
      threatenedSpecies: 0,
      extinctSpecies: 0,
      region: 'Global',
      taxonKey: species.key,
      scientificName: species.scientificName || species.canonicalName,
      conservationStatus: 'Unknown'
    }));
  } catch (error) {
    console.error('GBIF species data error:', error);
    return [];
  }
};

/**
 * Fetch threatened species from IUCN Red List API
 */
export const getIUCNRedListData = async (region?: string): Promise<BiodiversityData[]> => {
  try {
    const apiKey = API_KEYS.IUCN;
    if (!apiKey) {
      console.warn('IUCN API key not configured');
      return [];
    }
    
    const response = await fetch(
      `https://apiv3.iucnredlist.org/api/v3/species/page/0?token=${apiKey}`
    );
    
    if (!response.ok) throw new Error('IUCN Red List API failed');
    
    const data = await response.json();
    const species = data.result || [];
    
    return species.slice(0, 50).map((species: any) => ({
      speciesCount: 1,
      threatenedSpecies: ['VU', 'EN', 'CR'].includes(species.category) ? 1 : 0,
      extinctSpecies: ['EX', 'EW'].includes(species.category) ? 1 : 0,
      region: region || 'Global',
      scientificName: species.scientific_name,
      conservationStatus: species.category
    }));
  } catch (error) {
    console.error('IUCN Red List data error:', error);
    return [];
  }
};

/**
 * Fetch occurrence data from GBIF
 */
export const getGBIFOccurrenceData = async (speciesKey?: number, country?: string): Promise<any[]> => {
  try {
    let url = 'https://api.gbif.org/v1/occurrence/search?limit=50';
    
    if (speciesKey) url += `&taxonKey=${speciesKey}`;
    if (country) url += `&country=${country}`;
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('GBIF Occurrence API failed');
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('GBIF occurrence data error:', error);
    return [];
  }
};

// =============================================================================
// 3. CLIMATE DATA APIS
// =============================================================================

/**
 * Fetch current weather from OpenWeatherMap
 */
export const getOpenWeatherData = async (lat: number, lon: number): Promise<ClimateData | null> => {
  try {
    const apiKey = API_KEYS.OPEN_WEATHER;
    if (!apiKey) {
      console.warn('OpenWeather API key not configured');
      return null;
    }
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) throw new Error('OpenWeather API failed');
    
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      precipitation: data.rain?.['1h'] || 0,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      location: data.name,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenWeather data error:', error);
    return null;
  }
};

/**
 * Fetch climate data from Open-Meteo (free alternative)
 */
export const getOpenMeteoClimateData = async (lat: number, lon: number): Promise<ClimateData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&timezone=auto`
    );
    
    if (!response.ok) throw new Error('Open-Meteo API failed');
    
    const data = await response.json();
    const current = data.current;
    
    return {
      temperature: current.temperature_2m,
      precipitation: 0, // Would need historical data endpoint
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      pressure: current.surface_pressure,
      location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      timestamp: current.time
    };
  } catch (error) {
    console.error('Open-Meteo data error:', error);
    return null;
  }
};

/**
 * Fetch NOAA climate data
 */
export const getNOAAClimateData = async (stationId: string = 'GHCND:USW00014732'): Promise<any> => {
  try {
    const apiKey = API_KEYS.NOAA;
    if (!apiKey) {
      console.warn('NOAA API key not configured');
      return null;
    }
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await fetch(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=${stationId}&startdate=${startDate}&enddate=${endDate}&limit=50`,
      {
        headers: {
          'token': apiKey
        }
      }
    );
    
    if (!response.ok) throw new Error('NOAA API failed');
    
    return await response.json();
  } catch (error) {
    console.error('NOAA climate data error:', error);
    return null;
  }
};

// =============================================================================
// 4. SATELLITE IMAGERY APIS
// =============================================================================

/**
 * Fetch NASA Earth Imagery
 */
export const getNASAEarthImagery = async (lat: number, lon: number, date?: string): Promise<SatelliteImagery | null> => {
  try {
    const apiKey = API_KEYS.NASA;
    const imageDate = date || new Date().toISOString().split('T')[0];
    
    const response = await fetch(
      `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${imageDate}&dim=0.1&api_key=${apiKey}`
    );
    
    if (!response.ok) throw new Error('NASA Earth Imagery API failed');
    
    // NASA returns image directly
    const imageUrl = response.url;
    
    return {
      imageUrl,
      date: imageDate,
      location: `${lat}, ${lon}`,
      coordinates: [lat, lon],
      type: 'deforestation', // Default type
      source: 'NASA Earth Imagery'
    };
  } catch (error) {
    console.error('NASA Earth Imagery error:', error);
    return null;
  }
};

/**
 * Fetch ESA Sentinel satellite data
 */
export const getESASentinelData = async (bbox: string, date: string): Promise<any> => {
  try {
    // ESA Copernicus Open Access Hub
    const response = await fetch(
      `https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$filter=contains(Name,'S2') and ContentDate/Start gt ${date}T00:00:00.000Z and ContentDate/Start lt ${date}T23:59:59.999Z and Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'productType' and att/Value eq 'S2MSI1C')`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) throw new Error('ESA Sentinel API failed');
    
    return await response.json();
  } catch (error) {
    console.error('ESA Sentinel data error:', error);
    return null;
  }
};

// =============================================================================
// 5. OCEAN DATA APIS
// =============================================================================

/**
 * Fetch ocean data from NOAA
 */
export const getNOAAOceanData = async (lat: number, lon: number): Promise<OceanData | null> => {
  try {
    // NOAA ERDDAP server for ocean data
    const response = await fetch(
      `https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json?analysed_sst%5B(last)%5D%5B(${lat})%5D%5B(${lon})%5D`
    );
    
    if (!response.ok) throw new Error('NOAA Ocean API failed');
    
    const data = await response.json();
    const oceanData = data.table?.data?.[0];
    
    if (!oceanData) return null;
    
    return {
      seaLevel: 0, // Would need different endpoint
      temperature: oceanData[3] - 273.15, // Convert from Kelvin to Celsius
      salinity: 0, // Would need different endpoint
      phLevel: 0, // Would need different endpoint
      location: `${lat}, ${lon}`,
      depth: 0
    };
  } catch (error) {
    console.error('NOAA ocean data error:', error);
    return null;
  }
};

// =============================================================================
// 6. AIR QUALITY APIS
// =============================================================================

/**
 * Fetch air quality data from OpenWeatherMap
 */
export const getAirQualityData = async (lat: number, lon: number): Promise<AirQualityData | null> => {
  try {
    const apiKey = API_KEYS.OPEN_WEATHER;
    if (!apiKey) {
      console.warn('OpenWeather API key not configured');
      return null;
    }
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    
    if (!response.ok) throw new Error('Air Quality API failed');
    
    const data = await response.json();
    const current = data.list[0];
    
    return {
      aqi: current.main.aqi,
      pm25: current.components.pm2_5,
      pm10: current.components.pm10,
      ozone: current.components.o3,
      no2: current.components.no2,
      so2: current.components.so2,
      co: current.components.co,
      location: `${lat}, ${lon}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Air quality data error:', error);
    return null;
  }
};

// =============================================================================
// 7. EARTHQUAKE AND GEOLOGICAL DATA
// =============================================================================

/**
 * Fetch earthquake data from USGS
 */
export const getUSGSEarthquakeData = async (minMagnitude: number = 4.5): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=json&minmagnitude=${minMagnitude}&limit=50`
    );
    
    if (!response.ok) throw new Error('USGS Earthquake API failed');
    
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('USGS earthquake data error:', error);
    return [];
  }
};

// =============================================================================
// 8. COMPREHENSIVE DATA AGGREGATOR
// =============================================================================

/**
 * Aggregate all environmental data for a specific location
 */
export const getAllEnvironmentalData = async (lat: number, lon: number, countryCode?: string) => {
  console.log(`Fetching comprehensive environmental data for ${lat}, ${lon}`);
  
  const results = await Promise.allSettled([
    // Climate data
    getOpenWeatherData(lat, lon),
    getOpenMeteoClimateData(lat, lon),
    
    // Air quality
    getAirQualityData(lat, lon),
    
    // Ocean data (if coastal)
    getNOAAOceanData(lat, lon),
    
    // Biodiversity
    getGBIFSpeciesData(),
    
    // Forest data
    getWorldBankForestData(countryCode),
    
    // Satellite imagery
    getNASAEarthImagery(lat, lon),
    
    // Geological
    getUSGSEarthquakeData()
  ]);
  
  const [
    weatherData,
    meteoData,
    airQualityData,
    oceanData,
    speciesData,
    forestData,
    satelliteData,
    earthquakeData
  ] = results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
  
  return {
    climate: {
      weather: weatherData,
      meteo: meteoData
    },
    airQuality: airQualityData,
    ocean: oceanData,
    biodiversity: speciesData,
    forest: forestData,
    satellite: satelliteData,
    geological: earthquakeData,
    timestamp: new Date().toISOString(),
    location: { lat, lon }
  };
};

// =============================================================================
// 9. REAL-TIME DATA STREAMS
// =============================================================================

/**
 * Set up real-time data monitoring
 */
export class RealTimeEnvironmentalMonitor {
  private intervals: NodeJS.Timeout[] = [];
  private callbacks: ((data: any) => void)[] = [];
  
  constructor(private lat: number, private lon: number, private intervalMs: number = 300000) {} // 5 minutes default
  
  subscribe(callback: (data: any) => void) {
    this.callbacks.push(callback);
  }
  
  start() {
    const interval = setInterval(async () => {
      try {
        const data = await getAllEnvironmentalData(this.lat, this.lon);
        this.callbacks.forEach(callback => callback(data));
      } catch (error) {
        console.error('Real-time data fetch error:', error);
      }
    }, this.intervalMs);
    
    this.intervals.push(interval);
  }
  
  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

// =============================================================================
// 10. DATA VALIDATION AND CACHING
// =============================================================================

/**
 * Cache management for API responses
 */
export class EnvironmentalDataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlMs: number = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Global cache instance
export const environmentalCache = new EnvironmentalDataCache();

// Export all functions and classes
export default {
  // Forest APIs
  getWorldBankForestData,
  getNASALandCoverData,
  getGlobalForestWatchData,
  
  // Biodiversity APIs
  getGBIFSpeciesData,
  getIUCNRedListData,
  getGBIFOccurrenceData,
  
  // Climate APIs
  getOpenWeatherData,
  getOpenMeteoClimateData,
  getNOAAClimateData,
  
  // Satellite APIs
  getNASAEarthImagery,
  getESASentinelData,
  
  // Ocean APIs
  getNOAAOceanData,
  
  // Air Quality APIs
  getAirQualityData,
  
  // Geological APIs
  getUSGSEarthquakeData,
  
  // Aggregated data
  getAllEnvironmentalData,
  
  // Real-time monitoring
  RealTimeEnvironmentalMonitor,
  
  // Cache management
  EnvironmentalDataCache,
  environmentalCache
};
