import React, { useState } from 'react';
import { AlertTriangle, CloudRain, Thermometer, Wind, Eye, MapPin, Calendar, Bell, Filter, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ClimateAlerts: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const alerts = [
    {
      id: 1,
      type: 'Wildfire Risk',
      severity: 'critical',
      location: 'California, USA',
      description: 'Extreme fire weather conditions with low humidity and high winds',
      issued: '2024-08-15T14:30:00Z',
      expires: '2024-08-17T06:00:00Z',
      affectedArea: '2,500 km²',
      icon: '🔥',
      temperature: 42,
      humidity: 15,
      windSpeed: 45
    },
    {
      id: 2,
      type: 'Drought Warning',
      severity: 'high',
      location: 'East Africa',
      description: 'Prolonged dry conditions affecting agricultural regions',
      issued: '2024-08-14T09:15:00Z',
      expires: '2024-09-30T23:59:00Z',
      affectedArea: '45,000 km²',
      icon: '🌵',
      temperature: 35,
      humidity: 25,
      windSpeed: 12
    },
    {
      id: 3,
      type: 'Flood Risk',
      severity: 'medium',
      location: 'Bangladesh',
      description: 'Heavy monsoon rains expected to cause river overflow',
      issued: '2024-08-13T18:45:00Z',
      expires: '2024-08-20T12:00:00Z',
      affectedArea: '8,200 km²',
      icon: '🌊',
      temperature: 28,
      humidity: 85,
      windSpeed: 25
    },
    {
      id: 4,
      type: 'Heat Wave',
      severity: 'high',
      location: 'Southern Europe',
      description: 'Extreme temperatures exceeding 40°C for extended period',
      issued: '2024-08-12T12:00:00Z',
      expires: '2024-08-18T23:59:00Z',
      affectedArea: '15,000 km²',
      icon: '🌡️',
      temperature: 43,
      humidity: 30,
      windSpeed: 8
    },
    {
      id: 5,
      type: 'Deforestation Alert',
      severity: 'critical',
      location: 'Amazon Basin, Brazil',
      description: 'Illegal logging activity detected via satellite monitoring',
      issued: '2024-08-11T08:20:00Z',
      expires: '2024-08-25T23:59:00Z',
      affectedArea: '125 km²',
      icon: '🪓',
      temperature: 32,
      humidity: 70,
      windSpeed: 15
    },
    {
      id: 6,
      type: 'Storm Warning',
      severity: 'medium',
      location: 'Caribbean Sea',
      description: 'Tropical storm formation with potential for hurricane development',
      issued: '2024-08-10T20:30:00Z',
      expires: '2024-08-16T06:00:00Z',
      affectedArea: '18,500 km²',
      icon: '🌀',
      temperature: 29,
      humidity: 75,
      windSpeed: 65
    }
  ];

  const temperatureData = [
    { time: '00:00', temp: 24, avg: 22 },
    { time: '04:00', temp: 21, avg: 20 },
    { time: '08:00', temp: 28, avg: 25 },
    { time: '12:00', temp: 35, avg: 32 },
    { time: '16:00', temp: 38, avg: 35 },
    { time: '20:00', temp: 32, avg: 30 },
  ];

  const riskData = [
    { month: 'Jan', fire: 15, drought: 25, flood: 35, storm: 20 },
    { month: 'Feb', fire: 18, drought: 30, flood: 25, storm: 15 },
    { month: 'Mar', fire: 25, drought: 35, flood: 20, storm: 25 },
    { month: 'Apr', fire: 35, drought: 45, flood: 30, storm: 35 },
    { month: 'May', fire: 45, drought: 55, flood: 40, storm: 45 },
    { month: 'Jun', fire: 55, drought: 65, flood: 25, storm: 35 },
    { month: 'Jul', fire: 65, drought: 75, flood: 15, storm: 25 },
    { month: 'Aug', fire: 75, drought: 80, flood: 35, storm: 55 },
  ];

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
    const typeMatch = selectedType === 'all' || alert.type.toLowerCase().includes(selectedType.toLowerCase());
    return severityMatch && typeMatch;
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
          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-colors">
            <Bell className="h-4 w-4" />
            Subscribe to Alerts
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <MapPin className="h-4 w-4" />
            View Map
          </button>
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
              <span className="text-red-400 font-medium">38°C</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
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
                <YAxis stroke="#64748b" />
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