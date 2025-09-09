import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Filter, MapPin, Search, Grid, List } from 'lucide-react';
import ApiService from '../services/api';
import TaskCard from '../components/tasks/TaskCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const TaskList = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllTasks();
      const tasksData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = (tasks || []).filter(task => {
    if (!task) return false;
    const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'All Categories', 'Cleaning', 'Handyman', 'Moving', 'Delivery', 'Gardening', 'Tech Help'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Tasks
          </h1>
          
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search Bar */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" size={20} />
                  <input
                    type="text"
                    placeholder="🔍 Search for tasks, services, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-200 text-lg placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter size={20} className="mr-2" />
                  Filters
                  {showFilters && <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">ON</span>}
                </motion.button>
                
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-md' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-8 shadow-lg border border-primary-100 dark:border-gray-600"
            >
              <div className="flex items-center mb-6">
                <Filter className="text-primary-500 mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Filter Tasks</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="mr-2">🏷️</span>
                    Category
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-white dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white appearance-none cursor-pointer transition-all duration-200"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category === 'All Categories' ? 'all' : category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Location Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="mr-2">📍</span>
                    Location
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" size={20} />
                    <input
                      type="text"
                      placeholder="🌍 Enter city or area..."
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      🎯
                    </div>
                  </div>
                </div>
                
                {/* Budget Range Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="mr-2">💰</span>
                    Budget Range
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-200"
                      />
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="text-lg">—</span>
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-500 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors">
                  Clear All Filters
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Results Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 dark:bg-primary-900 px-4 py-2 rounded-full">
              <p className="text-primary-700 dark:text-primary-300 font-semibold">
                <span className="text-2xl font-bold">{filteredTasks.length}</span> 
                <span className="ml-1">tasks found</span>
              </p>
            </div>
            {searchTerm && (
              <div className="text-gray-600 dark:text-gray-400">
                <span className="text-sm">for "</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">{searchTerm}</span>
                <span className="text-sm">"</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
              <option>✨ Newest First</option>
              <option>💰 Highest Budget</option>
              <option>📍 Nearest Location</option>
              <option>⭐ Most Popular</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard 
                task={task} 
                onClick={() => {
                  // Navigate to task details
                  console.log('Navigate to task:', task.id);
                }}
              />
            </motion.div>
          ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Tasks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
