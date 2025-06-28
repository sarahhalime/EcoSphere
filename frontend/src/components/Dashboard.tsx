import React from 'react';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const forestData = [
    { month: 'Jan', coverage: 78.2, restored: 45 },
    { month: 'Feb', coverage: 78.8, restored: 52 },
    { month: 'Mar', coverage: 79.1, restored: 38 },
    { month: 'Apr', coverage: 78.9, restored: 61 },
    { month: 'May', coverage: 79.3, restored: 47 },
    { month: 'Jun', coverage: 79.7, restored: 55 },
  ];

  const carbonData = [
    { name: 'Sequestered', value: 2847, color: '#10b981' },
    { name: 'Target', value: 1153, color: '#374151' },
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Forest Coverage</p>
              <p className="text-2xl font-bold text-white mt-1">79.7%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">+2.3%</span>
                <span className="text-slate-500 text-sm">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <TreePine className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Species Tracked</p>
              <p className="text-2xl font-bold text-white mt-1">1,457</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">+156</span>
                <span className="text-slate-500 text-sm">this week</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Bird className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Carbon Captured</p>
              <p className="text-2xl font-bold text-white mt-1">2,847</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">+12.5%</span>
                <span className="text-slate-500 text-sm">tons CO₂</span>
              </div>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Leaf className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Alerts</p>
              <p className="text-2xl font-bold text-white mt-1">7</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">3 critical</span>
                <span className="text-slate-500 text-sm">require action</span>
              </div>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
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
              <p className="text-slate-400 text-sm">Monthly coverage percentage and restoration progress</p>
            </div>
            <Link to="/forest" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
              View Details
              <Eye className="h-4 w-4" />
            </Link>
          </div>
          <div className="h-64">
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

        {/* Carbon Sequestration */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Carbon Sequestration</h3>
              <p className="text-slate-400 text-sm">Annual target vs actual CO₂ captured (tons)</p>
            </div>
            <Link to="/carbon" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
              Calculate
              <Eye className="h-4 w-4" />
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carbonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {carbonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-300">Sequestered: 2,847t</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <span className="text-sm text-slate-300">Remaining: 1,153t</span>
            </div>
          </div>
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
    </div>
  );
};

export default Dashboard;