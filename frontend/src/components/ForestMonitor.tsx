import React, { useState, useEffect } from 'react';
import { TreePine, TrendingUp, TrendingDown, MapPin, Calendar, Filter, Eye, Download, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getForestCoverageData, getRegionalForestData } from '../utils/forestData';
import type { ForestCoverageData, RegionForestData } from '../utils/forestData';

const ForestMonitor: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedRegion, setSelectedRegion] = useState('global');

  // State for data from APIs
  const [forestData, setForestData] = useState<ForestCoverageData[]>([]);
  const [regionData, setRegionData] = useState<RegionForestData[]>([]);

  // Loading states
  const [isLoadingForest, setIsLoadingForest] = useState(true);
  const [isLoadingRegions, setIsLoadingRegions] = useState(true);

  // Key metrics
  const [globalCoverage, setGlobalCoverage] = useState<number | null>(null);
  const [coverageChange, setCoverageChange] = useState<string | null>(null);
  const [forestLoss, setForestLoss] = useState<string | null>(null);
  const [forestGain, setForestGain] = useState<string | null>(null);

  // Fetch forest coverage data when time range or region changes
  useEffect(() => {
    const fetchForestData = async () => {
      setIsLoadingForest(true);
      try {
        const data = await getForestCoverageData(selectedTimeRange, selectedRegion);
        setForestData(data);

        // Calculate key metrics
        if (data.length > 0) {
          // Latest forest coverage
          const latestCoverage = data[data.length - 1].coverage;
          setGlobalCoverage(latestCoverage);

          // Compare with previous month
          if (data.length > 1) {
            const previousCoverage = data[data.length - 2].coverage;
            const change = latestCoverage - previousCoverage;
            const changePercent = ((change / previousCoverage) * 100).toFixed(1);
            setCoverageChange(`${change >= 0 ? '+' : ''}${changePercent}%`);
          }

          // Calculate monthly loss and gain in hectares (millions)
          if (data.length > 0) {
            const latestData = data[data.length - 1];
            setForestLoss(`${latestData.loss.toFixed(1)}M`);
            setForestGain(`${latestData.gain.toFixed(1)}M`);
          }
        }
      } catch (error) {
        console.error('Error fetching forest data:', error);
      } finally {
        setIsLoadingForest(false);
      }
    };

    fetchForestData();
  }, [selectedTimeRange, selectedRegion]);

  // Fetch regional data
  useEffect(() => {
    const fetchRegionData = async () => {
      setIsLoadingRegions(true);
      try {
        const data = await getRegionalForestData();
        setRegionData(data);
      } catch (error) {
        console.error('Error fetching region data:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };

    fetchRegionData();
  }, []);

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

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex items-center justify-center w-full h-40">
      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
    </div>
  );

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
            disabled={isLoadingForest}
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
            disabled={isLoadingForest}
          >
            <option value="global">Global View</option>
            <option value="amazon">Amazon Basin</option>
            <option value="congo">Congo Basin</option>
            <option value="boreal">Boreal Forest</option>
            <option value="southeast">Southeast Asia</option>
            <option value="atlantic">Atlantic Forest</option>
          </select>
          {/* Export Data button removed */}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <TreePine className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Global Coverage</p>
              {isLoadingForest ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{globalCoverage?.toFixed(1)}%</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingForest ? (
              <div className="animate-pulse h-4 w-24 bg-slate-700 rounded"></div>
            ) : coverageChange && parseFloat(coverageChange) >= 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">{coverageChange} vs last month</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">{coverageChange} vs last month</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Forest Loss</p>
              {isLoadingForest ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{forestLoss}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">hectares this month</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Forest Gain</p>
              {isLoadingForest ? (
                <div className="animate-pulse h-8 w-16 bg-slate-700 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-white">{forestGain}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">hectares restored</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forest Coverage Trend */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Forest Coverage Trend</h3>
              <p className="text-slate-400 text-sm">Monthly forest coverage percentage over time</p>
            </div>
          </div>
          {isLoadingForest ? (
            <LoadingIndicator />
          ) : (
            <div className="h-80">
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
          )}
        </div>

        {/* Forest Loss vs Gain */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Forest Loss vs Gain</h3>
              <p className="text-slate-400 text-sm">Comparison of deforestation and restoration</p>
            </div>
          </div>
          {isLoadingForest ? (
            <LoadingIndicator />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Line
                    type="monotone"
                    dataKey="loss"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gain"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Forest Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Forest Gain</span>
            </div>
          </div>
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
        {isLoadingRegions ? (
          <LoadingIndicator />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ForestMonitor;
