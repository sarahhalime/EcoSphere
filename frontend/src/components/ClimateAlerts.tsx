import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Thermometer, Wind, Eye, MapPin, Calendar, Bell, Filter, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getWeatherData, MONITORED_LOCATIONS, Location } from '../utils/weather';
import { getClimateRiskData, getTemperatureData, RiskData } from '../utils/climateData';

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

interface TemperatureDataPoint {
  time: string;
  temp: number;
  avg: number;
}

const ClimateAlerts: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [temperatureData, setTemperatureData] = useState<TemperatureDataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch weather alerts from real APIs
        const allAlerts = await Promise.all(
          MONITORED_LOCATIONS.map(location => getWeatherData(location.name))
        );
        setAlerts(allAlerts.flat());

        // Fetch climate risk data from real APIs
        const riskData = await getClimateRiskData();
        setRiskData(riskData);

        // Get real temperature data from API
        const tempData = await getTemperatureData();
        setTemperatureData(tempData);
      } catch (err) {
        setError('Failed to fetch weather data from APIs');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 5 minutes for real-time updates
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      default: return 'border-slate-500/50 bg-slate-500/10 text-slate-400';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const typeMatch = selectedType === 'all' ||
      alert.type.toLowerCase().includes(selectedType.toLowerCase()) ||
      alert.description.toLowerCase().includes(selectedType.toLowerCase());
    const locationMatch = selectedLocation === 'all' || alert.location === selectedLocation;
    return severityMatch && typeMatch && locationMatch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const activeCount = alerts.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Climate Alerts & Monitoring</h1>
          <p className="text-slate-400 mt-1">Real-time climate hazard warnings and environmental risk assessment</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Subscribe to Alerts button removed */}
          {/* View Map button removed */}
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Critical Alerts</p>
              <p className="text-2xl font-bold text-white">{criticalCount}</p>
            </div>
          </div>
          <p className="text-red-400 text-sm font-medium">Immediate action required</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-white">{highCount}</p>
            </div>
          </div>
          <p className="text-orange-400 text-sm font-medium">Monitor closely</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
            </div>
          </div>
          <p className="text-blue-400 text-sm font-medium">Total monitoring</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Eye className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Areas Monitored</p>
              <p className="text-2xl font-bold text-white">24/7</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium">Global coverage</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Monitoring */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Temperature Monitoring</h3>
              <p className="text-slate-400 text-sm">24-hour temperature vs historical average</p>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">
                {temperatureData.length > 0 ? `${temperatureData[temperatureData.length - 1].temp}°C` : '38°C'}
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={['auto', 'auto']} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Trends */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Climate Risk Trends</h3>
              <p className="text-slate-400 text-sm">Monthly risk index by hazard type</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Area
                  type="monotone"
                  dataKey="fire"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="drought"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="flood"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="storm"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-slate-300">Fire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-slate-300">Drought</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-slate-300">Flood</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-slate-300">Storm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400 text-sm font-medium">Filter alerts:</span>
          </div>

          {/* Add location filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Locations</option>
            {MONITORED_LOCATIONS.map((location: Location) => (
              <option key={location.id} value={location.name}>
                {location.name} ({location.region})
              </option>
            ))}
          </select>

          {/* Existing severity and type filters */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Types</option>
            <option value="fire">Wildfire</option>
            <option value="drought">Drought</option>
            <option value="flood">Flood</option>
            <option value="heat">Heat Wave</option>
            <option value="storm">Storm</option>
            <option value="deforestation">Deforestation</option>
          </select>
          <div className="ml-auto text-sm text-slate-400">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
          <p className="text-slate-400">Loading alerts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`rounded-2xl border p-6 ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{alert.icon}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{alert.type}</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{alert.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Issued: {formatDate(alert.issued)}
                    </span>
                    <span>Area: {alert.affectedArea}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                View Details
              </button>
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-slate-400 text-xs">Temperature</p>
                  <p className="text-white font-semibold">{alert.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CloudRain className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-slate-400 text-xs">Humidity</p>
                  <p className="text-white font-semibold">{alert.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-slate-400 text-xs">Wind Speed</p>
                  <p className="text-white font-semibold">{alert.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            {/* Expiry Information */}
            <div className="mt-4 p-3 bg-slate-800/20 rounded-lg">
              <p className="text-slate-400 text-sm">
                <Calendar className="inline h-3 w-3 mr-1" />
                Expires: {formatDate(alert.expires)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClimateAlerts;
