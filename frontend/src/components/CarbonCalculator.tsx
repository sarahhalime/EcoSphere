import React, { useState } from 'react';
import { Calculator, Leaf, TreePine, Plus, Trash2, BarChart3, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const CarbonCalculator: React.FC = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Amazon Reforestation', species: 'Mixed Native', area: 100, treesPerHectare: 150, age: 5 },
    { id: 2, name: 'Urban Forest Initiative', species: 'Oak Trees', area: 25, treesPerHectare: 100, age: 3 },
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    species: '',
    area: 0,
    treesPerHectare: 150,
    age: 0
  });

  const speciesData = {
    'Mixed Native': { carbonPerTree: 0.045, growthRate: 1.2 },
    'Oak Trees': { carbonPerTree: 0.055, growthRate: 1.0 },
    'Pine Trees': { carbonPerTree: 0.035, growthRate: 1.4 },
    'Eucalyptus': { carbonPerTree: 0.065, growthRate: 1.8 },
    'Bamboo': { carbonPerTree: 0.025, growthRate: 2.5 },
    'Mangroves': { carbonPerTree: 0.085, growthRate: 0.8 },
  };

  const calculateCarbon = (project: any) => {
    const speciesInfo = speciesData[project.species as keyof typeof speciesData] || speciesData['Mixed Native'];
    const totalTrees = project.area * project.treesPerHectare;
    const carbonPerYear = totalTrees * speciesInfo.carbonPerTree * speciesInfo.growthRate;
    const totalCarbon = carbonPerYear * project.age;
    return { carbonPerYear, totalCarbon, totalTrees };
  };

  const addProject = () => {
    if (newProject.name && newProject.species && newProject.area > 0) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({ name: '', species: '', area: 0, treesPerHectare: 150, age: 0 });
    }
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const totalStats = projects.reduce((acc, project) => {
    const calc = calculateCarbon(project);
    return {
      totalCarbon: acc.totalCarbon + calc.totalCarbon,
      totalTrees: acc.totalTrees + calc.totalTrees,
      totalArea: acc.totalArea + project.area,
      annualCarbon: acc.annualCarbon + calc.carbonPerYear,
    };
  }, { totalCarbon: 0, totalTrees: 0, totalArea: 0, annualCarbon: 0 });

  const projectChartData = projects.map(project => {
    const calc = calculateCarbon(project);
    return {
      name: project.name,
      carbon: calc.totalCarbon,
      annual: calc.carbonPerYear,
    };
  });

  const carbonBySpecies = Object.entries(
    projects.reduce((acc, project) => {
      const calc = calculateCarbon(project);
      acc[project.species] = (acc[project.species] || 0) + calc.totalCarbon;
      return acc;
    }, {} as Record<string, number>)
  ).map(([species, carbon]) => ({ species, carbon }));

  const projectionData = Array.from({ length: 20 }, (_, year) => ({
    year: new Date().getFullYear() + year,
    carbon: totalStats.annualCarbon * (year + 1),
  }));

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Sequestration Calculator</h1>
          <p className="text-slate-400 mt-1">Calculate CO₂ capture potential of your reforestation projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <BarChart3 className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Leaf className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total CO₂ Captured</p>
              <p className="text-2xl font-bold text-white">{totalStats.totalCarbon.toFixed(1)}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium">tons of CO₂</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <TreePine className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Trees Planted</p>
              <p className="text-2xl font-bold text-white">{totalStats.totalTrees.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-blue-400 text-sm font-medium">across all projects</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Area Restored</p>
              <p className="text-2xl font-bold text-white">{totalStats.totalArea}</p>
            </div>
          </div>
          <p className="text-amber-400 text-sm font-medium">hectares</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Annual Capture</p>
              <p className="text-2xl font-bold text-white">{totalStats.annualCarbon.toFixed(1)}</p>
            </div>
          </div>
          <p className="text-purple-400 text-sm font-medium">tons CO₂/year</p>
        </div>
      </div>

      {/* Add New Project */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Project
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <select
            value={newProject.species}
            onChange={(e) => setNewProject({ ...newProject, species: e.target.value })}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="">Select species</option>
            {Object.keys(speciesData).map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Area (hectares)"
            value={newProject.area || ''}
            onChange={(e) => setNewProject({ ...newProject, area: Number(e.target.value) })}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <input
            type="number"
            placeholder="Trees/hectare"
            value={newProject.treesPerHectare || ''}
            onChange={(e) => setNewProject({ ...newProject, treesPerHectare: Number(e.target.value) })}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <input
            type="number"
            placeholder="Age (years)"
            value={newProject.age || ''}
            onChange={(e) => setNewProject({ ...newProject, age: Number(e.target.value) })}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            onClick={addProject}
            className="px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Active Projects</h3>
        <div className="space-y-4">
          {projects.map((project) => {
            const calc = calculateCarbon(project);
            return (
              <div key={project.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                    <div>
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-slate-400 text-sm">{project.species}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Area</p>
                      <p className="text-white">{project.area} ha</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Trees</p>
                      <p className="text-white">{calc.totalTrees.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Age</p>
                      <p className="text-white">{project.age} years</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">CO₂ Captured</p>
                      <p className="text-emerald-400 font-semibold">{calc.totalCarbon.toFixed(1)} tons</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Annual Rate</p>
                      <p className="text-blue-400 font-semibold">{calc.carbonPerYear.toFixed(1)} t/year</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Comparison */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Carbon Capture by Project</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Bar dataKey="carbon" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Carbon Capture by Species</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={carbonBySpecies}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="carbon"
                  label={({ species, carbon }) => `${species}: ${carbon.toFixed(1)}t`}
                >
                  {carbonBySpecies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Future Projections */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">20-Year Carbon Sequestration Projection</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Line
                type="monotone"
                dataKey="carbon"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-slate-800/30 rounded-xl">
          <p className="text-white font-medium">Key Insights:</p>
          <ul className="text-slate-400 text-sm mt-2 space-y-1">
            <li>• Projected to capture {(totalStats.annualCarbon * 20).toFixed(1)} tons CO₂ over 20 years</li>
            <li>• Equivalent to removing {Math.round((totalStats.annualCarbon * 20) / 4.6)} cars from roads annually</li>
            <li>• Current growth rate: {totalStats.annualCarbon.toFixed(1)} tons CO₂ per year</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator;