import React, { useState } from 'react';
import { Bird, Camera, Upload, MapPin, Search, Filter, TrendingUp, TrendingDown, Star, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BiodiversityTracker: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const speciesData = [
    { category: 'Birds', count: 234, trend: 5.2, color: '#3b82f6' },
    { category: 'Mammals', count: 89, trend: 2.1, color: '#10b981' },
    { category: 'Reptiles', count: 67, trend: -1.5, color: '#f59e0b' },
    { category: 'Amphibians', count: 45, trend: -3.2, color: '#ef4444' },
    { category: 'Fish', count: 156, trend: 4.8, color: '#8b5cf6' },
    { category: 'Insects', count: 678, trend: 7.3, color: '#06b6d4' },
  ];

  const threatLevels = [
    { name: 'Least Concern', value: 45, color: '#10b981' },
    { name: 'Near Threatened', value: 25, color: '#f59e0b' },
    { name: 'Vulnerable', value: 20, color: '#f97316' },
    { name: 'Endangered', value: 8, color: '#ef4444' },
    { name: 'Critically Endangered', value: 2, color: '#991b1b' },
  ];

  const recentSightings = [
    {
      id: 1,
      species: 'Panthera pardus',
      commonName: 'African Leopard',
      location: 'Kruger National Park, SA',
      date: '2024-08-15',
      confidence: 95,
      status: 'Vulnerable',
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      species: 'Ara macao',
      commonName: 'Scarlet Macaw',
      location: 'Costa Rica',
      date: '2024-08-14',
      confidence: 88,
      status: 'Least Concern',
      image: 'https://images.pexels.com/photos/1564471/pexels-photo-1564471.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      species: 'Ailuropoda melanoleuca',
      commonName: 'Giant Panda',
      location: 'Sichuan, China',
      date: '2024-08-13',
      confidence: 97,
      status: 'Vulnerable',
      image: 'https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      species: 'Cecropia obtusifolia',
      commonName: 'Trumpet Tree',
      location: 'Amazon Basin, Brazil',
      date: '2024-08-12',
      confidence: 92,
      status: 'Least Concern',
      image: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Least Concern': return 'text-emerald-400 bg-emerald-500/20';
      case 'Near Threatened': return 'text-yellow-400 bg-yellow-500/20';
      case 'Vulnerable': return 'text-orange-400 bg-orange-500/20';
      case 'Endangered': return 'text-red-400 bg-red-500/20';
      case 'Critically Endangered': return 'text-red-600 bg-red-600/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Biodiversity Tracker</h1>
          <p className="text-slate-400 mt-1">AI-powered species identification and conservation monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <Search className="h-4 w-4" />
            Species Database
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <MapPin className="h-4 w-4" />
            View Map
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Bird className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Species</p>
              <p className="text-2xl font-bold text-white">1,269</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">+156 this month</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Camera className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Photo Uploads</p>
              <p className="text-2xl font-bold text-white">3,847</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">+23% this week</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Avg Confidence</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">AI accuracy</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Threatened</p>
              <p className="text-2xl font-bold text-white">127</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm font-medium">species at risk</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
        <div className="border-b border-slate-800/50">
          <nav className="flex">
            <button
              onClick={() => setSelectedTab('upload')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'upload'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Upload & Identify
            </button>
            <button
              onClick={() => setSelectedTab('sightings')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'sightings'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Recent Sightings
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'analytics'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'upload' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                    <Camera className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload Species Photo</h3>
                    <p className="text-slate-400 mb-4">Drag and drop your image here, or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-white">Selected: {selectedFile.name}</p>
                      <p className="text-slate-400 text-sm">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Processing */}
              {selectedFile && (
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-white mb-4">AI Species Identification</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
                      <span className="text-slate-300">Analyzing image with AI model...</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <p className="text-white font-medium">Expected Results:</p>
                      <ul className="text-slate-400 text-sm mt-2 space-y-1">
                        <li>• Species identification with confidence score</li>
                        <li>• Conservation status (IUCN Red List)</li>
                        <li>• Habitat information and distribution</li>
                        <li>• Similar species comparison</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'sightings' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Filter by:</span>
                </div>
                <select className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm">
                  <option>All Species</option>
                  <option>Birds</option>
                  <option>Mammals</option>
                  <option>Reptiles</option>
                </select>
                <select className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm">
                  <option>All Locations</option>
                  <option>Protected Areas</option>
                  <option>Urban Areas</option>
                  <option>Remote Locations</option>
                </select>
                <select className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm">
                  <option>All Status</option>
                  <option>Threatened</option>
                  <option>Stable</option>
                  <option>Recovering</option>
                </select>
              </div>

              {/* Sightings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentSightings.map((sighting) => (
                  <div key={sighting.id} className="bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={sighting.image} 
                        alt={sighting.commonName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{sighting.commonName}</h4>
                          <p className="text-slate-400 text-sm italic">{sighting.species}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(sighting.status)}`}>
                          {sighting.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {sighting.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Confidence: {sighting.confidence}%</span>
                          <span className="text-slate-400">{sighting.date}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Species by Category */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-white mb-6">Species by Category</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={speciesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="category" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Conservation Status */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                  <h4 className="text-lg font-semibold text-white mb-6">Conservation Status</h4>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatLevels}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {threatLevels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Species Trends */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-6">Population Trends</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {speciesData.map((species) => (
                    <div key={species.category} className="p-4 bg-slate-900/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white">{species.category}</h5>
                        <div className={`flex items-center gap-1 ${
                          species.trend > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {species.trend > 0 ? 
                            <TrendingUp className="h-4 w-4" /> : 
                            <TrendingDown className="h-4 w-4" />
                          }
                          <span className="text-sm font-medium">
                            {species.trend > 0 ? '+' : ''}{species.trend}%
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm">{species.count} species documented</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiodiversityTracker;