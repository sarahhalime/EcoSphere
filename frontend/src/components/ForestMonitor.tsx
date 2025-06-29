import React, { useState } from 'react';
import { TreePine, Satellite, TrendingUp, TrendingDown, MapPin, Calendar, Filter, Eye, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ForestMonitor: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('global');

  const forestData = [
    { month: 'Jan 2024', coverage: 76.2, loss: 2.1, gain: 1.8 },
    { month: 'Feb 2024', coverage: 76.8, loss: 1.9, gain: 2.5 },
    { month: 'Mar 2024', coverage: 77.1, loss: 2.3, gain: 2.6 },
    { month: 'Apr 2024', coverage: 76.9, loss: 2.8, gain: 2.6 },
    { month: 'May 2024', coverage: 77.3, loss: 2.2, gain: 2.6 },
    { month: 'Jun 2024', coverage: 77.7, loss: 1.8, gain: 2.2 },
    { month: 'Jul 2024', coverage: 78.2, loss: 1.5, gain: 2.0 },
    { month: 'Aug 2024', coverage: 78.9, loss: 1.3, gain: 2.0 },
  ];

  const regionData = [
    { region: 'Amazon Basin', coverage: 82.4, change: '+1.2%', status: 'improving' },
    { region: 'Congo Basin', coverage: 75.8, change: '-0.8%', status: 'declining' },
    { region: 'Boreal Forest', coverage: 91.2, change: '+0.3%', status: 'stable' },
    { region: 'Southeast Asia', coverage: 68.5, change: '-2.1%', status: 'critical' },
    { region: 'Atlantic Forest', coverage: 45.2, change: '+3.4%', status: 'recovering' },
  ];

  const satelliteData = [
    { date: '2024-08-15', location: 'Amazon Basin, Brazil', type: 'Deforestation Alert', severity: 'high', area: '45.2 hectares' },
    { date: '2024-08-14', location: 'Congo Basin, DRC', type: 'Illegal Logging', severity: 'critical', area: '12.8 hectares' },
    { date: '2024-08-13', location: 'Borneo, Indonesia', type: 'Fire Detection', severity: 'medium', area: '28.5 hectares' },
    { date: '2024-08-12', location: 'Atlantic Forest, Brazil', type: 'Restoration Progress', severity: 'positive', area: '67.3 hectares' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-emerald-400 bg-emerald-500/20';
      case 'recovering': return 'text-blue-400 bg-blue-500/20';
      case 'stable': return 'text-slate-400 bg-slate-500/20';
      case 'declining': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'positive': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Forest Cover Monitoring</h1>
          <p className="text-slate-400 mt-1">Real-time satellite monitoring of global forest coverage and health</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="global">Global View</option>
            <option value="amazon">Amazon Basin</option>
            <option value="congo">Congo Basin</option>
            <option value="boreal">Boreal Forest</option>
            <option value="southeast">Southeast Asia</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Global Coverage */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Global Coverage</p>
            <p className="text-3xl font-extrabold text-white mt-2">78.9%</p>
            <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-300 text-base font-semibold">+0.7%</span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
          <div className="p-5 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <TreePine className="h-12 w-12 text-emerald-400" />
          </div>
        </div>

        {/* Forest Loss */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-red-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Forest Loss</p>
            <p className="text-3xl font-extrabold text-white mt-2">1.3M</p>
            <div className="flex items-center gap-2 mt-3">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <span className="text-red-300 text-base font-semibold">hectares this month</span>
            </div>
          </div>
          <div className="p-5 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <TrendingDown className="h-12 w-12 text-red-400" />
          </div>
        </div>
      </div>

      {/* Forest Coverage Trend - Full Width */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Forest Coverage Trend</h3>
            <p className="text-slate-400 text-sm">Monthly forest coverage percentage over time</p>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} />
              <Area
                type="monotone"
                dataKey="coverage"
                stroke="#10b981"
                fill="url(#forestGradient)"
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Overview */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Regional Forest Status</h3>
            <p className="text-slate-400 text-sm">Coverage and trend analysis by major forest regions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {regionData.map((region) => (
            <div key={region.region} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white text-sm">{region.region}</h4>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(region.status)}`}>
                  {region.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Coverage</span>
                  <span className="text-white font-semibold">{region.coverage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Change</span>
                  <span className={`font-semibold ${
                    region.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {region.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ForestMonitor;