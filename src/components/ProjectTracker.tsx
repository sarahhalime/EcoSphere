import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Users, TreePine, Target, TrendingUp, Edit3, Trash2, Eye, Download } from 'lucide-react';
import { ProgressBar } from 'recharts';

const ProjectTracker: React.FC = () => {
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddProject, setShowAddProject] = useState(false);

  const projects = [
    {
      id: 1,
      name: 'Amazon Rainforest Restoration',
      location: 'Acre, Brazil',
      status: 'active',
      progress: 78,
      startDate: '2023-03-15',
      endDate: '2025-12-31',
      budget: 250000,
      spent: 195000,
      treesPlanted: 15000,
      treesTarget: 20000,
      area: 120,
      species: ['Cecropia', 'Mahogany', 'Brazil Nut'],
      team: 8,
      coordinator: 'Dr. Maria Santos',
      description: 'Large-scale reforestation initiative focusing on native species restoration and community engagement.',
      impact: { carbonSequestered: 234, biodiversityIndex: 8.2, communityJobs: 25 }
    },
    {
      id: 2,
      name: 'Sahel Regreening Initiative',
      location: 'Niger, West Africa',
      status: 'active',
      progress: 45,
      startDate: '2024-01-10',
      endDate: '2026-06-30',
      budget: 180000,
      spent: 81000,
      treesPlanted: 8500,
      treesTarget: 15000,
      area: 85,
      species: ['Acacia', 'Baobab', 'Moringa'],
      team: 12,
      coordinator: 'Ibrahim Kone',
      description: 'Anti-desertification project using farmer-managed natural regeneration techniques.',
      impact: { carbonSequestered: 156, biodiversityIndex: 6.8, communityJobs: 40 }
    },
    {
      id: 3,
      name: 'Coastal Mangrove Conservation',
      location: 'Palawan, Philippines',
      status: 'completed',
      progress: 100,
      startDate: '2022-08-01',
      endDate: '2024-03-31',
      budget: 120000,
      spent: 118500,
      treesPlanted: 12000,
      treesTarget: 12000,
      area: 45,
      species: ['Red Mangrove', 'Black Mangrove', 'White Mangrove'],
      team: 6,
      coordinator: 'Elena Rodriguez',
      description: 'Mangrove restoration for coastal protection and marine biodiversity enhancement.',
      impact: { carbonSequestered: 189, biodiversityIndex: 9.1, communityJobs: 18 }
    },
    {
      id: 4,
      name: 'Urban Forest Initiative',
      location: 'Mexico City, Mexico',
      status: 'planning',
      progress: 15,
      startDate: '2024-09-01',
      endDate: '2025-08-31',
      budget: 95000,
      spent: 14250,
      treesPlanted: 450,
      treesTarget: 3000,
      area: 25,
      species: ['Pine', 'Oak', 'Jacaranda'],
      team: 4,
      coordinator: 'Carlos Mendez',
      description: 'Urban reforestation to improve air quality and create green spaces in the metropolitan area.',
      impact: { carbonSequestered: 23, biodiversityIndex: 4.5, communityJobs: 8 }
    },
    {
      id: 5,
      name: 'Highland Forest Recovery',
      location: 'Kenya',
      status: 'active',
      progress: 62,
      startDate: '2023-11-20',
      endDate: '2025-11-20',
      budget: 165000,
      spent: 102300,
      treesPlanted: 9300,
      treesTarget: 15000,
      area: 78,
      species: ['Cedar', 'Olive', 'Camphor'],
      team: 10,
      coordinator: 'Grace Wanjiku',
      description: 'Watershed restoration project in the Aberdare Mountains for water conservation.',
      impact: { carbonSequestered: 167, biodiversityIndex: 7.8, communityJobs: 32 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'paused': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const filteredProjects = projects.filter(project => 
    selectedStatus === 'all' || project.status === selectedStatus
  );

  const totalStats = projects.reduce((acc, project) => ({
    totalBudget: acc.totalBudget + project.budget,
    totalSpent: acc.totalSpent + project.spent,
    totalTrees: acc.totalTrees + project.treesPlanted,
    totalArea: acc.totalArea + project.area,
    totalCarbon: acc.totalCarbon + project.impact.carbonSequestered,
    totalJobs: acc.totalJobs + project.impact.communityJobs
  }), { totalBudget: 0, totalSpent: 0, totalTrees: 0, totalArea: 0, totalCarbon: 0, totalJobs: 0 });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Tracker</h1>
          <p className="text-slate-400 mt-1">Manage and monitor your restoration and conservation projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TreePine className="h-5 w-5 text-emerald-400" />
            <span className="text-slate-400 text-sm">Trees Planted</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStats.totalTrees.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <span className="text-slate-400 text-sm">Area Restored</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStats.totalArea}</p>
          <p className="text-blue-400 text-xs">hectares</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-amber-400" />
            <span className="text-slate-400 text-sm">Budget Used</span>
          </div>
          <p className="text-2xl font-bold text-white">${(totalStats.totalSpent / 1000).toFixed(0)}k</p>
          <p className="text-amber-400 text-xs">of ${(totalStats.totalBudget / 1000).toFixed(0)}k</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <span className="text-slate-400 text-sm">CO₂ Captured</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStats.totalCarbon}</p>
          <p className="text-purple-400 text-xs">tons</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-pink-400" />
            <span className="text-slate-400 text-sm">Jobs Created</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalStats.totalJobs}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-cyan-400" />
            <span className="text-slate-400 text-sm">Active Projects</span>
          </div>
          <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</p>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
            <option value="paused">Paused</option>
          </select>
          <span className="text-slate-400 text-sm">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedView('grid')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'grid' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setSelectedView('list')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'list' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">{project.location}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-slate-300 text-sm mb-4 line-clamp-2">{project.description}</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Progress</span>
                  <span className="text-white font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Trees Planted</p>
                  <p className="text-white font-semibold">{project.treesPlanted.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs">of {project.treesTarget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Area</p>
                  <p className="text-white font-semibold">{project.area} ha</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Budget Used</p>
                  <p className="text-white font-semibold">${(project.spent / 1000).toFixed(0)}k</p>
                  <p className="text-slate-500 text-xs">of ${(project.budget / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Team Size</p>
                  <p className="text-white font-semibold">{project.team}</p>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="bg-slate-800/30 rounded-xl p-3 mb-4">
                <p className="text-slate-400 text-xs mb-2">Environmental Impact</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-emerald-400 font-semibold text-sm">{project.impact.carbonSequestered}t</p>
                    <p className="text-slate-500 text-xs">CO₂</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-semibold text-sm">{project.impact.biodiversityIndex}</p>
                    <p className="text-slate-500 text-xs">Bio Index</p>
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold text-sm">{project.impact.communityJobs}</p>
                    <p className="text-slate-500 text-xs">Jobs</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Project</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Progress</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Trees</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Budget</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Coordinator</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{project.name}</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{project.treesPlanted.toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">of {project.treesTarget.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">${(project.spent / 1000).toFixed(0)}k</p>
                      <p className="text-slate-400 text-sm">of ${(project.budget / 1000).toFixed(0)}k</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{project.coordinator}</p>
                      <p className="text-slate-400 text-sm">{project.team} team members</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setShowAddProject(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project name"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <textarea
                placeholder="Project description"
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Budget ($)"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <input
                  type="number"
                  placeholder="Area (hectares)"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <input
                  type="number"
                  placeholder="Target trees"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <input
                  type="text"
                  placeholder="Project coordinator"
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTracker;