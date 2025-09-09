import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Shield, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary-500" />,
      title: 'Find Tasks',
      description: 'Browse thousands of tasks in your area'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-500" />,
      title: 'Connect',
      description: 'Connect with skilled taskers nearby'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-500" />,
      title: 'Secure',
      description: 'Safe and secure payment system'
    },
    {
      icon: <Star className="w-8 h-8 text-primary-500" />,
      title: 'Rated',
      description: 'Review and rating system for quality'
    }
  ];

  const categories = [
    { name: 'Cleaning', count: '1,234', color: 'bg-blue-500' },
    { name: 'Handyman', count: '856', color: 'bg-green-500' },
    { name: 'Moving', count: '642', color: 'bg-purple-500' },
    { name: 'Delivery', count: '1,089', color: 'bg-orange-500' },
    { name: 'Gardening', count: '423', color: 'bg-teal-500' },
    { name: 'Tech Help', count: '789', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Get Things Done with
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                {' '}PodiWedak.com
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-4"
            >
              Connect with skilled people in your community to get tasks done quickly and affordably
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mb-8 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* What field */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="What do you need done?"
                      className="w-full py-4 px-4 border-0 focus:outline-none text-gray-900 placeholder-gray-400 text-base sm:text-lg"
                    />
                  </div>
                  
                  {/* Search button */}
                  <div className="flex items-center border-t sm:border-t-0 sm:border-l border-gray-200">
                    <button className="w-full sm:w-auto h-full px-6 sm:px-8 py-4 sm:py-0 bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center">
                      <Search size={20} className="mr-2" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Popular categories */}
              <div className="mt-6 text-center">
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm">
                  <span className="text-gray-600">Popular:</span>
                  {['Cleaning', 'Handyman', 'Removalists', 'Gardening', 'Assembly'].map((category) => (
                    <button
                      key={category}
                      className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-xs sm:text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/tasks">
                <Button variant="primary" size="lg">
                  Browse Tasks
                </Button>
              </Link>
              <Link to="/post-task">
                <Button variant="outline" size="lg">
                  Post a Task
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find the perfect task category for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card p-6 text-center cursor-pointer"
              >
                <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} tasks
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PodiWedak.com?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              The most trusted platform for getting things done
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              PodiWedak.com
            </h2>
            <p className="text-xl text-white mb-8">
              Your trusted platform for getting things done
            </p>
            <div className="border-t border-white/20 pt-8">
              <p className="text-white text-sm">
                © 2024 PodiWedak.com. All rights reserved. | Privacy Policy | Terms of Service
              </p>
              <p className="text-white text-xs mt-2">
                Connecting communities through trusted task services
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
