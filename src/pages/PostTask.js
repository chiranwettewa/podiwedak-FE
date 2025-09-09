import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Calendar, DollarSign, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const PostTask = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    dueDate: '',
    dueTime: '',
    photos: []
  });

  const categories = [
    'Cleaning', 'Handyman', 'Moving', 'Delivery', 'Gardening', 'Tech Help',
    'Tutoring', 'Pet Care', 'Photography', 'Event Help', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to post a task');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    
    try {
      const taskData = {
        ...formData,
        userId: user.id
      };
      
      await ApiService.createTask(taskData);
      toast.success('Task posted successfully!');
      navigate('/dashboard', { state: { fromTaskPost: true } });
    } catch (error) {
      console.error('Error posting task:', error);
      toast.error('Failed to post task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // Mock photo upload
    setFormData(prev => ({ 
      ...prev, 
      photos: [...prev.photos, ...files.map(file => URL.createObjectURL(file))]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Post a New Task
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tell us what you need done and get offers from skilled taskers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Task Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Task Title"
                    placeholder="What do you need done?"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your task in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign size={16} className="inline mr-1" />
                    Budget
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Timing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Location & Timing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => handleInputChange('dueTime', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Photos (Optional)
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Add photos to help taskers understand your task
                      </span>
                      <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button variant="outline" className="mt-4">
                        <Upload size={16} className="mr-2" />
                        Upload Photos
                      </Button>
                    </label>
                  </div>
                </div>

                {formData.photos.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Posting Task...' : 'Post Task'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostTask;
