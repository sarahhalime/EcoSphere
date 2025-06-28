import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TreePine, 
  Bird, 
  AlertTriangle, 
  Leaf, 
  MapPin,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import LeafletMap from './Map/LeafletMap';

const Dashboard: React.FC = () => {
  const forestData = [
    { month: 'Jan', coverage: 78.2, restored: 45 },
    { month: 'Feb', coverage: 78.8, restored: 52 },
    { month: 'Mar', coverage: 79.1, restored: 38 },
    { month: 'Apr', coverage: 78.9, restored: 61 },
    { month: 'May', coverage: 79.3, restored: 47 },
    { month: 'Jun', coverage: 79.7, restored: 55 },
  ];



  const speciesData = [
    { category: 'Birds', count: 234, trend: 'up' },
    { category: 'Mammals', count: 89, trend: 'up' },
    { category: 'Plants', count: 456, trend: 'down' },
    { category: 'Insects', count: 678, trend: 'up' },
  ];

  const alerts = [
    { id: 1, type: 'Fire Risk', location: 'Amazon Basin', severity: 'high', time: '2 hours ago' },
    { id: 2, type: 'Deforestation', location: 'Congo Basin', severity: 'critical', time: '5 hours ago' },
    { id: 3, type: 'Drought Warning', location: 'East Africa', severity: 'medium', time: '1 day ago' },
  ];

  const recentProjects = [
    { id: 1, name: 'Amazon Restoration', progress: 78, location: 'Brazil', trees: 15000 },
    { id: 2, name: 'Sahel Regreening', progress: 45, location: 'Mali', trees: 8500 },
    { id: 3, name: 'Coastal Mangroves', progress: 92, location: 'Philippines', trees: 12000 },
  ];

  // Project location data for the map
  const projectLocations = [
    { id: 1, name: 'Amazon Restoration', location: 'Brazil', coordinates: [-3.4653, -62.2159], trees: 15000, status: 'Active', area: 50000 },
    { id: 2, name: 'Sahel Regreening', location: 'Mali', coordinates: [17.5707, -3.9962], trees: 8500, status: 'Active', area: 35000 },
    { id: 3, name: 'Coastal Mangroves', location: 'Philippines', coordinates: [14.5995, 120.9842], trees: 12000, status: 'Active', area: 28000 },
    { id: 4, name: 'Congo Basin Protection', location: 'DR Congo', coordinates: [-0.2280, 15.8277], trees: 23000, status: 'Planned', area: 75000 },
    { id: 5, name: 'Borneo Rainforest', location: 'Indonesia', coordinates: [0.9619, 114.5548], trees: 18700, status: 'Active', area: 42000 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Environmental Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor global forest health, biodiversity, and climate action</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 text-sm font-medium">
            <Calendar className="inline h-4 w-4 mr-2" />
            Last updated: 15 mins ago
          </div>
        </div>
      </div>

      {/* Key Metrics - Responsive Full Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Forest Coverage */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-emerald-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Forest Coverage</p>
            <p className="text-3xl font-extrabold text-white mt-2">79.7%</p>
            <div className="flex items-center gap-2 mt-3">
              <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-300 text-base font-semibold">+2.3%</span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
          <div className="p-5 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <TreePine className="h-12 w-12 text-emerald-400" />
          </div>
        </div>

        {/* Species Tracked */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Species Tracked</p>
            <p className="text-3xl font-extrabold text-white mt-2">1,457</p>
            <div className="flex items-center gap-2 mt-3">
              <ArrowUpRight className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 text-base font-semibold">+156</span>
              <span className="text-slate-500 text-xs">this week</span>
            </div>
          </div>
          <div className="p-5 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <Bird className="h-12 w-12 text-blue-400" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-red-700/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Active Alerts</p>
            <p className="text-3xl font-extrabold text-white mt-2">7</p>
            <div className="flex items-center gap-2 mt-3">
              <ArrowDownRight className="h-5 w-5 text-red-400" />
              <span className="text-red-300 text-base font-semibold">3 critical</span>
              <span className="text-slate-500 text-xs">require action</span>
            </div>
          </div>
          <div className="p-5 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </div>
      </div>

      {/* Forest Coverage Trend - Full Width */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Forest Coverage Trend</h3>
            <p className="text-slate-400 text-sm">Monthly coverage percentage and restoration progress</p>
          </div>
          <Link to="/forest" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            View Details
            <Eye className="h-4 w-4" />
          </Link>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Area
                type="monotone"
                dataKey="coverage"
                stroke="#10b981"
                fill="url(#forestGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Climate Alerts */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Climate Alerts</h3>
            <Link to="/climate" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className={`p-1.5 rounded-lg ${
                  alert.severity === 'critical' ? 'bg-red-500/20' :
                  alert.severity === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'critical' ? 'text-red-400' :
                    alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{alert.type}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {alert.location} · {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Species Tracking */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Biodiversity Status</h3>
            <Link to="/biodiversity" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Track Species
            </Link>
          </div>
          <div className="space-y-4">
            {speciesData.map((species) => (
              <div key={species.category} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Bird className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{species.category}</p>
                    <p className="text-xs text-slate-400">{species.count} documented</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  species.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {species.trend === 'up' ? 
                    <ArrowUpRight className="h-4 w-4" /> : 
                    <ArrowDownRight className="h-4 w-4" />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Active Projects</h3>
            <Link to="/projects" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
              Manage All
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-white">{project.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {project.location} · {project.trees.toLocaleString()} trees
                    </p>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section - Example Usage of Leaflet Map */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Global Reforestation Projects</h3>
          <p className="text-slate-400 text-sm">Locations of active reforestation projects worldwide</p>
        </div>
        <div className="h-80">
          <LeafletMap
            center={[20, 0]}
            zoom={2}
            projectLocations={projectLocations}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
