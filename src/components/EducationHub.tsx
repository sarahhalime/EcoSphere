import React, { useState } from 'react';
import { GraduationCap, BookOpen, Play, Award, Clock, Users, Star, ChevronRight, Download, Search } from 'lucide-react';

const EducationHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'Forest Restoration Fundamentals',
      category: 'restoration',
      level: 'beginner',
      duration: '4 hours',
      modules: 8,
      enrolled: 1247,
      rating: 4.8,
      instructor: 'Dr. Sarah Chen',
      description: 'Learn the basics of forest restoration, from site assessment to species selection and monitoring.',
      image: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 0,
      certificate: true,
      topics: ['Site Assessment', 'Native Species', 'Planting Techniques', 'Monitoring Methods']
    },
    {
      id: 2,
      title: 'Climate Change Adaptation Strategies',
      category: 'climate',
      level: 'intermediate',
      duration: '6 hours',
      modules: 12,
      enrolled: 892,
      rating: 4.9,
      instructor: 'Prof. Michael Torres',
      description: 'Understand climate impacts and develop effective adaptation strategies for ecosystems.',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 35,
      certificate: true,
      topics: ['Climate Science', 'Vulnerability Assessment', 'Adaptation Planning', 'Implementation']
    },
    {
      id: 3,
      title: 'Biodiversity Conservation Methods',
      category: 'biodiversity',
      level: 'advanced',
      duration: '8 hours',
      modules: 15,
      enrolled: 634,
      rating: 4.7,
      instructor: 'Dr. Elena Rodriguez',
      description: 'Advanced techniques for biodiversity monitoring and conservation in various ecosystems.',
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 0,
      certificate: true,
      topics: ['Species Monitoring', 'Habitat Management', 'Conservation Genetics', 'Protected Areas']
    },
    {
      id: 4,
      title: 'Sustainable Agriculture Practices',
      category: 'agriculture',
      level: 'beginner',
      duration: '5 hours',
      modules: 10,
      enrolled: 1456,
      rating: 4.6,
      instructor: 'Dr. James Wilson',
      description: 'Implement sustainable farming practices that protect soil health and biodiversity.',
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 60,
      certificate: true,
      topics: ['Soil Health', 'Crop Rotation', 'Integrated Pest Management', 'Water Conservation']
    },
    {
      id: 5,
      title: 'Carbon Sequestration Science',
      category: 'carbon',
      level: 'intermediate',
      duration: '7 hours',
      modules: 14,
      enrolled: 723,
      rating: 4.8,
      instructor: 'Dr. Lisa Park',
      description: 'Deep dive into carbon cycles, measurement techniques, and sequestration strategies.',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 0,
      certificate: true,
      topics: ['Carbon Cycles', 'Measurement Methods', 'Forest Carbon', 'Soil Carbon']
    },
    {
      id: 6,
      title: 'Community Engagement in Conservation',
      category: 'community',
      level: 'beginner',
      duration: '3 hours',
      modules: 6,
      enrolled: 987,
      rating: 4.5,
      instructor: 'Maria Santos',
      description: 'Learn how to effectively engage local communities in conservation initiatives.',
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
      progress: 100,
      certificate: true,
      topics: ['Stakeholder Mapping', 'Communication Strategies', 'Participatory Methods', 'Conflict Resolution']
    }
  ];

  const achievements = [
    { id: 1, title: 'Forest Guardian', description: 'Completed 3 restoration courses', icon: '🌲', earned: true },
    { id: 2, title: 'Climate Champion', description: 'Mastered climate adaptation', icon: '🌍', earned: true },
    { id: 3, title: 'Biodiversity Expert', description: 'Advanced conservation knowledge', icon: '🦋', earned: false },
    { id: 4, title: 'Carbon Calculator', description: 'Carbon sequestration specialist', icon: '📊', earned: false },
    { id: 5, title: 'Community Leader', description: 'Engagement and outreach master', icon: '👥', earned: true },
    { id: 6, title: 'Sustainability Scholar', description: 'Completed all course categories', icon: '🎓', earned: false }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'restoration', name: 'Forest Restoration', count: courses.filter(c => c.category === 'restoration').length },
    { id: 'climate', name: 'Climate Action', count: courses.filter(c => c.category === 'climate').length },
    { id: 'biodiversity', name: 'Biodiversity', count: courses.filter(c => c.category === 'biodiversity').length },
    { id: 'agriculture', name: 'Sustainable Agriculture', count: courses.filter(c => c.category === 'agriculture').length },
    { id: 'carbon', name: 'Carbon Management', count: courses.filter(c => c.category === 'carbon').length },
    { id: 'community', name: 'Community Engagement', count: courses.filter(c => c.category === 'community').length }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  const completedCourses = courses.filter(c => c.progress === 100).length;
  const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100).length;
  const totalHours = courses.reduce((acc, course) => acc + parseInt(course.duration), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Education Hub</h1>
          <p className="text-slate-400 mt-1">Learn sustainable practices and conservation techniques</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
            <Download className="h-4 w-4" />
            Certificates
          </button>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedCourses}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium">courses finished</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{inProgressCourses}</p>
            </div>
          </div>
          <p className="text-blue-400 text-sm font-medium">active learning</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Learning Hours</p>
              <p className="text-2xl font-bold text-white">{totalHours}</p>
            </div>
          </div>
          <p className="text-amber-400 text-sm font-medium">total available</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Award className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Achievements</p>
              <p className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</p>
            </div>
          </div>
          <p className="text-purple-400 text-sm font-medium">badges earned</p>
        </div>
      </div>

      {/* Course Categories */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Course Categories</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-slate-700/50 transition-all">
            <div className="aspect-video overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">{course.title}</h4>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen className="h-4 w-4" />
                  {course.modules} modules
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="h-4 w-4" />
                  {course.enrolled.toLocaleString()} enrolled
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Star className="h-4 w-4 text-amber-400" />
                  {course.rating} rating
                </div>
              </div>

              {/* Progress Bar */}
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Progress</span>
                    <span className="text-white text-sm font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Instructor */}
              <div className="mb-4">
                <p className="text-slate-400 text-sm">Instructor</p>
                <p className="text-white font-medium">{course.instructor}</p>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Key Topics</p>
                <div className="flex flex-wrap gap-2">
                  {course.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-800/50 text-slate-300 rounded-lg text-xs">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="px-2 py-1 bg-slate-800/50 text-slate-400 rounded-lg text-xs">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full px-4 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-medium flex items-center justify-center gap-2">
                {course.progress === 0 ? (
                  <>
                    <Play className="h-4 w-4" />
                    Start Course
                  </>
                ) : course.progress === 100 ? (
                  <>
                    <Award className="h-4 w-4" />
                    View Certificate
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Continue Learning
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Achievements & Badges</h3>
          <span className="text-slate-400 text-sm">
            {achievements.filter(a => a.earned).length} of {achievements.length} earned
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`p-4 rounded-xl border transition-all ${
              achievement.earned 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-slate-800/30 border-slate-700/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${achievement.earned ? 'text-white' : 'text-slate-400'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-slate-400 text-sm">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="p-1 bg-emerald-500/20 rounded-lg">
                    <Award className="h-4 w-4 text-emerald-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationHub;