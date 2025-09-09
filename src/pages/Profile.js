import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Camera,
  Edit3,
  Award,
  Briefcase,
  Globe,
  Linkedin,
  Github,
  DollarSign,
  Save,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    skills: '',
    website: '',
    linkedin: '',
    github: '',
    hourlyRate: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        description: user.description || '',
        skills: user.skills || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        hourlyRate: user.hourlyRate || '',
        avatar: user.avatar || 'https://via.placeholder.com/150'
      });
    }
  }, [user]);

  const badges = [
    { name: 'Identity Verified', icon: <Shield className="w-4 h-4" />, color: 'bg-green-100 text-green-800', show: user?.verified },
    { name: 'Google Account', icon: <Award className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', show: user?.provider === 'google' },
    { name: 'Profile Complete', icon: <Star className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800', show: isProfileComplete() },
    { name: 'Active Member', icon: <Briefcase className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', show: true }
  ].filter(badge => badge.show);

  function isProfileComplete() {
    return profileData.description && profileData.skills && profileData.location;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Edit Profile' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/users/${user.id}/profile`, profileData);
      
      if (response.data.user) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const skillsArray = profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600">
                <Camera size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center mt-2 space-x-4 text-gray-600 dark:text-gray-300">
                    {profileData.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('settings')}
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.map((badge) => (
                  <span
                    key={badge.name}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                  >
                    {badge.icon}
                    <span className="ml-1">{badge.name}</span>
                  </span>
                ))}
              </div>

              {/* Bio */}
              {profileData.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {profileData.description}
                </p>
              )}

              {/* Skills */}
              {skillsArray.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {profileData.website && (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                    <Globe size={20} />
                  </a>
                )}
                {profileData.linkedin && (
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                    <Linkedin size={20} />
                  </a>
                )}
                {profileData.github && (
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                    <Github size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Completion */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Completion
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Basic Info</span>
                      <span className="text-green-600 font-semibold">✓ Complete</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Description</span>
                      <span className={profileData.description ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                        {profileData.description ? "✓ Complete" : "⚠ Incomplete"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Skills</span>
                      <span className={skillsArray.length > 0 ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                        {skillsArray.length > 0 ? "✓ Complete" : "⚠ Incomplete"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {profileData.email}
                      </span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-400 mr-3" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {profileData.phone}
                        </span>
                      </div>
                    )}
                    {profileData.hourlyRate && (
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-gray-400 mr-3" />
                        <span className="text-gray-600 dark:text-gray-300">
                          ${profileData.hourlyRate}/hour
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Balance</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${user.balance || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Verification Status</span>
                      <span className={`font-semibold ${user.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Type</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.provider ? `${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} Account` : 'Regular Account'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Profile
                </h3>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    <Save size={16} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
                <Input
                  label="Website"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
                <Input
                  label="LinkedIn"
                  value={profileData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                <Input
                  label="GitHub"
                  value={profileData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
                <Input
                  label="Hourly Rate ($)"
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  placeholder="25.00"
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field resize-none"
                    placeholder="Tell others about yourself, your experience, and what services you offer..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="input-field resize-none"
                    placeholder="e.g., Plumbing, Electrical Work, Carpentry, Painting, Web Development"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate skills with commas. This helps clients find you for relevant tasks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
