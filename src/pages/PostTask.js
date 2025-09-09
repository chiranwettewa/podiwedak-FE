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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('postTask.title')}
            </h1>
            <p className="text-orange-100">
              {t('postTask.subtitle')}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  {t('postTask.taskDetails')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      {t('postTask.taskTitle')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('postTask.taskTitlePlaceholder')}
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      {t('postTask.description')}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={t('postTask.descriptionPlaceholder')}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      {t('postTask.category')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                      required
                    >
                      <option value="">{t('postTask.selectCategory')}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      <DollarSign size={16} className="inline mr-1 text-orange-500" />
                      {t('postTask.budget')}
                    </label>
                    <input
                      type="number"
                      placeholder={t('postTask.budgetPlaceholder')}
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location & Timing */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  {t('postTask.locationTiming')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      <MapPin size={16} className="inline mr-1 text-orange-500" />
                      {t('postTask.location')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('postTask.locationPlaceholder')}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      <Calendar size={16} className="inline mr-1 text-orange-500" />
                      {t('postTask.dueDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      {t('postTask.dueTime')}
                    </label>
                    <input
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => handleInputChange('dueTime', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  {t('postTask.photos')}
                </h2>
                
                <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 bg-white">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <span className="block text-sm font-medium text-orange-700 mb-4">
                          {t('postTask.photosHelp')}
                        </span>
                        <input
                          id="photo-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          className="inline-flex items-center px-6 py-3 border-2 border-orange-300 rounded-lg text-orange-700 bg-white hover:bg-orange-50 transition-colors font-medium"
                        >
                          <Upload size={16} className="mr-2" />
                          {t('postTask.uploadPhotos')}
                        </button>
                      </label>
                    </div>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-orange-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index)
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
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
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  className="px-6 py-3 border-2 border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  {t('postTask.saveAsDraft')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all font-medium shadow-lg disabled:opacity-50"
                >
                  {isLoading ? t('postTask.postingTask') : t('postTask.postTask')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostTask;
