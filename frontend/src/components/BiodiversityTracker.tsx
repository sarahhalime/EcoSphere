import React, { useState, useEffect, useCallback } from 'react';
import { Bird, Camera, MapPin, Search, Filter, TrendingUp, TrendingDown, Star, Eye, Info, ChevronRight, Leaf, AlertTriangle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchINaturalistConservationStatus, ConservationStatusData, speciesCategories } from './BiodiversityAnalytics';
import LeafletMap from './Map/LeafletMap';

// Wikipedia API interfaces
interface WikipediaSearchResult {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

interface WikipediaResponse {
  pages: Record<string, WikipediaSearchResult>;
}

interface SpeciesWikiInfo {
  summary: string;
  imageUrl: string;
  fullUrl: string;
}

const BiodiversityTracker: React.FC = () => {

  //Biodiversity Analytics State
const [threatLevels, setThreatLevels] = useState<ConservationStatusData[]>([]);
useEffect(() => {
  fetchINaturalistConservationStatus().then(setThreatLevels);
}, []);
//Biodiversity Analytics State Ends

  const [selectedTab, setSelectedTab] = useState('search');
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [wikiResults, setWikiResults] = useState<Record<string, SpeciesWikiInfo>>({});
  const [isWikiLoading, setIsWikiLoading] = useState<Record<number, boolean>>({});
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
    // const [identificationResult, setIdentificationResult] = useState<any>(null);
    // const [loading, setLoading] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

  const speciesData = [
    { category: 'Birds', count: 234, trend: 5.2, color: '#3b82f6' },
    { category: 'Mammals', count: 89, trend: 2.1, color: '#10b981' },
    { category: 'Reptiles', count: 67, trend: -1.5, color: '#f59e0b' },
    { category: 'Amphibians', count: 45, trend: -3.2, color: '#ef4444' },
    { category: 'Fish', count: 156, trend: 4.8, color: '#8b5cf6' },
    { category: 'Insects', count: 678, trend: 7.3, color: '#06b6d4' },
  ];

  // const threatLevels = [
  //   { name: 'Least Concern', value: 45, color: '#10b981' },
  //   { name: 'Near Threatened', value: 25, color: '#f59e0b' },
  //   { name: 'Vulnerable', value: 20, color: '#f97316' },
  //   { name: 'Endangered', value: 8, color: '#ef4444' },
  //   { name: 'Critically Endangered', value: 2, color: '#991b1b' },
  // ];

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

    // const handleUpload = async () => {
    //     if (!selectedFile) return;
    //     setLoading(true);
    //     setIdentificationResult(null);
    //
    //     const formData = new FormData();
    //     formData.append('file', selectedFile);
    //
    //     try {
    //         const response = await fetch('http://localhost:8000/api/inaturalist/identify-species', {
    //             method: 'POST',
    //             body: formData,
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error('Failed to identify species');
    //         }
    //
    //         const data = await response.json();
    //         setIdentificationResult(data);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             alert(error.message);
    //         } else {
    //             alert('An unknown error occurred');
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };
  // Sample species database with more comprehensive information
  const speciesDatabase = [
    {
      id: 1,
      name: 'Panthera pardus',
      commonName: 'African Leopard',
      category: 'Mammals',
      status: 'Vulnerable',
      habitat: 'Forests, Grasslands, Mountains',
      region: 'Sub-Saharan Africa',
      population: '~50,000',
      threats: ['Habitat Loss', 'Poaching', 'Human Conflict'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    {
      id: 3,
      name: 'Ailuropoda melanoleuca',
      commonName: 'Giant Panda',
      category: 'Mammals',
      status: 'Vulnerable',
      habitat: 'Temperate Forests',
      region: 'China',
      population: '~1,800',
      threats: ['Habitat Fragmentation', 'Climate Change'],
      image: 'https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      name: 'Chelonia mydas',
      commonName: 'Green Sea Turtle',
      category: 'Reptiles',
      status: 'Endangered',
      habitat: 'Tropical and Subtropical Oceans',
      region: 'Worldwide',
      population: 'Decreasing',
      threats: ['Bycatch', 'Climate Change', 'Pollution', 'Poaching'],
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      name: 'Pongo pygmaeus',
      commonName: 'Bornean Orangutan',
      category: 'Mammals',
      status: 'Critically Endangered',
      habitat: 'Tropical Rainforest',
      region: 'Borneo',
      population: '~104,700',
      threats: ['Deforestation', 'Hunting', 'Palm Oil Industry'],
      image: 'https://images.pexels.com/photos/825596/pexels-photo-825596.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 6,
      name: 'Delphinapterus leucas',
      commonName: 'Beluga Whale',
      category: 'Mammals',
      status: 'Near Threatened',
      habitat: 'Arctic and Sub-Arctic Waters',
      region: 'Arctic Ocean',
      population: '~150,000',
      threats: ['Climate Change', 'Pollution', 'Noise Disturbance'],
      image: 'https://images.pexels.com/photos/1309840/pexels-photo-1309840.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 7,
      name: 'Dendrobates tinctorius',
      commonName: 'Dyeing Poison Dart Frog',
      category: 'Amphibians',
      status: 'Least Concern',
      habitat: 'Tropical Rainforest',
      region: 'South America',
      population: 'Stable',
      threats: ['Habitat Loss', 'Pet Trade'],
      image: 'https://images.pexels.com/photos/674318/pexels-photo-674318.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 8,
      name: 'Danaus plexippus',
      commonName: 'Monarch Butterfly',
      category: 'Insects',
      status: 'Near Threatened',
      habitat: 'Various',
      region: 'North and South America',
      population: 'Decreasing',
      threats: ['Habitat Loss', 'Climate Change', 'Pesticides'],
      image: 'https://images.pexels.com/photos/2114289/pexels-photo-2114289.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
  ];

  // Function to fetch data from Wikipedia API - optimized with useCallback
  const fetchWikipediaData = useCallback(async (species: string, id: number) => {
    try {
      // Format the species name for the API query (scientific name works best)
      const query = encodeURIComponent(species);

      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.type === 'standard') {
        return {
          summary: data.extract,
          imageUrl: data.thumbnail?.source || '',
          fullUrl: data.content_urls?.desktop?.page || ''
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching Wikipedia data for ${species}:`, error);
      return null;
    }
  }, []);

  // Fetch Wikipedia data only when a species is selected
  useEffect(() => {
    const fetchSelectedSpeciesData = async () => {
      if (!selectedSpecies) return;

      // If we already have the data, don't fetch it again
      if (wikiResults[selectedSpecies]) return;

      // Set loading state for just this species
      setIsWikiLoading(prev => ({ ...prev, [selectedSpecies]: true }));

      // Find the selected species in our database
      const species = speciesDatabase.find(s => s.id === selectedSpecies);
      if (!species) {
        setIsWikiLoading(prev => ({ ...prev, [selectedSpecies]: false }));
        return;
      }

      // Fetch the data
      const wikiData = await fetchWikipediaData(species.name, species.id);
      if (wikiData) {
        setWikiResults(prev => ({ ...prev, [selectedSpecies]: wikiData }));
      }

      // Clear loading state
      setIsWikiLoading(prev => ({ ...prev, [selectedSpecies]: false }));
    };

    fetchSelectedSpeciesData();
  }, [selectedSpecies, wikiResults, fetchWikipediaData]);

  const viewSpeciesDetails = (speciesId: number) => {
    setSelectedSpecies(speciesId === selectedSpecies ? null : speciesId);
  };

  // Filter species based on search query and filter type
  const filteredSpecies = speciesDatabase.filter(species => {
    const matchesSearch =
      species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      species.commonName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      species.category.toLowerCase() === filterType.toLowerCase() ||
      species.status.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesFilter;
  });

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

  // const handleDrag = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === 'dragenter' || e.type === 'dragover') {
  //     setDragActive(true);
  //   } else if (e.type === 'dragleave') {
  //     setDragActive(false);
  //   }
  // };
  //
  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     setSelectedFile(e.dataTransfer.files[0]);
  //   }
  // };
  //
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedFile(e.target.files[0]);
  //   }
  // };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Biodiversity Tracker</h1>
          <p className="text-slate-400 mt-1">AI-powered species identification and conservation monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            onClick={() => setSelectedTab('search')}
          >
            <Search className="h-4 w-4" />
            Search Species
          </button>
          {/* <button
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
            onClick={() => setShowMapModal(true)}
          >
            <MapPin className="h-4 w-4" />
            View Map
          </button> */}
        </div>
      </div>

      {/* Stats Overview - Side by Side Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Total Species */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-blue-700/30 rounded-2xl p-4 flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center w-full">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Total Species</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-3xl font-extrabold text-white">8</span>
              <span className="p-2 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Bird className="h-8 w-8 text-blue-400" />
              </span>
            </div>
            {/* <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300 text-base font-semibold">+156</span>
              <span className="text-slate-500 text-xs">this month</span>
            </div> */}
          </div>
        </div>

        {/* Photo Uploads */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-700/30 rounded-2xl p-4 flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center w-full">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Photo Uploads</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-3xl font-extrabold text-white">7</span>
              <span className="p-2 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Camera className="h-8 w-8 text-emerald-400" />
              </span>
            </div>
            {/* <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-300 text-base font-semibold">+156</span>
              <span className="text-slate-500 text-xs">this month</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
        <div className="border-b border-slate-800/50">
          <nav className="flex flex-wrap">
            {/* Upload & Identify tab removed */}
              <button
                  onClick={() => setSelectedTab('search')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === 'search'
                          ? 'border-emerald-500 text-emerald-400'
                          : 'border-transparent text-slate-400 hover:text-white'
                  }`}
              >
                  Species Search
              </button>
            {/* <button
                onClick={() => setSelectedTab('sightings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === 'sightings'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
              Recent Sightings
            </button> */}
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
          {/* Upload & Identify tab content removed */}

          {selectedTab === 'search' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search species by scientific or common name..."
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl py-3 px-4 text-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="mammals">Mammals</option>
                  <option value="birds">Birds</option>
                  <option value="reptiles">Reptiles</option>
                  <option value="amphibians">Amphibians</option>
                  <option value="insects">Insects</option>
                  <option value="critically endangered">Critically Endangered</option>
                  <option value="endangered">Endangered</option>
                  <option value="vulnerable">Vulnerable</option>
                  <option value="near threatened">Near Threatened</option>
                </select>
              </div>

              {/* Search Results */}
              <div className="space-y-1 mt-2">
                <p className="text-slate-400 text-sm">
                  {filteredSpecies.length === 0
                    ? 'No species found. Try a different search term.'
                    : `Found ${filteredSpecies.length} species`}
                </p>
              </div>

              {/* Species Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecies.map((species) => (
                  <div key={species.id} className="group bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={species.image}
                        alt={species.commonName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-white">{species.commonName}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(species.status)}`}>
                            {species.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm italic">{species.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="bg-slate-700/50 px-2 py-1 rounded text-xs text-slate-300">{species.category}</span>
                          <span className="bg-slate-700/50 px-2 py-1 rounded text-xs text-slate-300">{species.region}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                          <span className="text-sm text-slate-400">{species.habitat}</span>
                        </div>

                        {species.threats.length > 0 && (
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                            <span className="text-sm text-slate-400">
                              {species.threats.slice(0, 2).join(', ')}
                              {species.threats.length > 2 && '...'}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => viewSpeciesDetails(species.id)}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                      >
                        <Info className="h-4 w-4" />
                        {selectedSpecies === species.id ? 'Hide Details' : 'View Full Details'}
                        <ChevronRight className={`h-4 w-4 transition-transform ${selectedSpecies === species.id ? 'rotate-90' : ''}`} />
                      </button>

                      {/* Expanded Wikipedia Data Section */}
                      {selectedSpecies === species.id && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                          {isWikiLoading[selectedSpecies] && (
                            <div className="flex justify-center py-8">
                              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                            </div>
                          )}

                          {!isWikiLoading[selectedSpecies] && wikiResults[species.id] && (
                            <div className="space-y-4">
                              <h4 className="text-white font-medium">Wikipedia Information</h4>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                {wikiResults[species.id].summary}
                              </p>

                              {wikiResults[species.id].imageUrl && (
                                <div className="mt-3">
                                  <img
                                    src={wikiResults[species.id].imageUrl}
                                    alt={species.commonName}
                                    className="rounded-lg max-h-48 mx-auto"
                                  />
                                  <p className="text-xs text-slate-500 text-center mt-1">
                                    Additional image from Wikipedia
                                  </p>
                                </div>
                              )}

                              <div className="flex justify-center mt-2">
                                <a
                                  href={wikiResults[species.id].fullUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                                >
                                  <Eye className="h-4 w-4" />
                                  Read full article on Wikipedia
                                </a>
                              </div>

                              <div className="bg-slate-900/30 rounded-lg p-4 mt-4">
                                <h5 className="text-white text-sm font-medium mb-2">Conservation Info</h5>
                                <div className="flex flex-wrap gap-2">
                                  <div className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                                    Status: {species.status}
                                  </div>
                                  <div className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                                    Population: {species.population}
                                  </div>
                                  {species.threats.map((threat, index) => (
                                    <div key={index} className="px-2 py-1 bg-slate-800 rounded text-xs text-red-400">
                                      {threat}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-slate-900/30 rounded-lg p-4">
                                <h5 className="text-white text-sm font-medium mb-2">Taxonomy</h5>
                                <ul className="text-xs space-y-1 text-slate-400">
                                  <li><span className="text-slate-500">Kingdom:</span> Animalia</li>
                                  <li><span className="text-slate-500">Phylum:</span> {species.category === 'Birds' ? 'Chordata' : species.category === 'Insects' ? 'Arthropoda' : 'Chordata'}</li>
                                  <li><span className="text-slate-500">Class:</span> {species.category}</li>
                                  <li><span className="text-slate-500">Scientific Name:</span> <span className="italic">{species.name}</span></li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {!isWikiLoading[selectedSpecies] && !wikiResults[species.id] && (
                            <div className="py-4 text-center">
                              <p className="text-slate-400 text-sm">No Wikipedia data available for this species.</p>
                              <p className="text-slate-500 text-xs mt-1">Try searching for "{species.name}" directly on Wikipedia.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredSpecies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 rounded-full bg-slate-800/50">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-white">No species found</h3>
                  <p className="text-center text-slate-400 mt-2 max-w-md">
                    Try adjusting your search or filter to find the species you're looking for.
                  </p>
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

          {/* {selectedTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          )} */}

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
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {speciesData.map((entry, index) => {
                  const categoryColor = speciesCategories.find(c => c.name === entry.category)?.color || '#3b82f6';
                  return <Cell key={`bar-cell-${index}`} fill={categoryColor} />;
                })}
              </Bar>
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
                label={({ name, value }) => `${name}: ${value}`}
              >
                {threatLevels.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-2xl shadow-xl p-4 w-full max-w-4xl relative">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl"
              onClick={() => setShowMapModal(false)}
              aria-label="Close Map"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Global Reforestation Projects</h2>
            <div className="h-96 w-full">
              <LeafletMap
                center={[20, 0]}
                zoom={2}
                projectLocations={[]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
);
};

export default BiodiversityTracker;

