import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MapPin,
  User
} from 'lucide-react';
import Button from '../components/ui/Button';
import TaskCard from '../components/tasks/TaskCard';
import { AuthContext } from '../contexts/AuthContext';
import ApiService from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('assigned');
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, location.pathname]); // Refresh when location changes

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Refresh data when switching to posted tasks tab
    if (tabId === 'posted') {
      fetchDashboardData();
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks first
      const tasksResponse = await ApiService.getAllTasks();
      const tasksData = Array.isArray(tasksResponse) ? tasksResponse : (tasksResponse?.data || []);
      setAllTasks(tasksData);
      
      // Get current user info
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = user?.id || storedUser?.id;
      const currentUserEmail = user?.email || storedUser?.email;
      
      // Filter user's posted tasks
      const myPostedTasks = tasksData.filter(task => {
        if (!task.user) return false;
        const userIdMatch = task.user.id == currentUserId || task.user.id === currentUserId;
        const emailMatch = task.user.email === currentUserEmail;
        return userIdMatch || emailMatch;
      });
      
      // Filter assigned tasks (tasks where current user is assigned)
      const myAssignedTasks = tasksData.filter(task => {
        return task.assignedTo && (
          task.assignedTo.id == currentUserId || 
          task.assignedTo.id === currentUserId ||
          task.assignedTo.email === currentUserEmail
        );
      });
      
      setUserTasks(myPostedTasks);
      setAssignedTasks(myAssignedTasks);
      
      // Try to fetch payments, but handle auth errors gracefully
      try {
        const paymentsData = await ApiService.get(`/payments/user/${user.id}`);
        setPayments(paymentsData.data || []);
      } catch (paymentError) {
        console.warn('Could not fetch payments data:', paymentError);
        setPayments([]); // Set empty array if payments can't be fetched
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Set active tab to 'posted' if coming from task posting
  useEffect(() => {
    if (location.state?.fromTaskPost) {
      setActiveTab('posted');
    }
  }, [location.state]);

  // Utility functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'fixed': return 'text-green-600 bg-green-100';
      case 'hourly': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Derived data
  const postedTasks = userTasks.filter(task => task.status !== 'completed');
  const completedTasks = userTasks.filter(task => task.status === 'completed');

  const stats = [
    {
      title: 'Posted Tasks',
      value: userTasks.length,
      change: '+12% from last month',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      icon: <Calendar className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Assigned Tasks',
      value: assignedTasks.length,
      change: '+5% from last week',
      color: 'bg-green-50 dark:bg-green-900/20',
      icon: <Clock className="h-6 w-6 text-green-600" />
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length + assignedTasks.filter(t => t.status === 'completed').length,
      change: '+8% from last month',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      icon: <CheckCircle className="h-6 w-6 text-purple-600" />
    },
    {
      title: 'Total Earnings',
      value: `$${payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)}`,
      change: '+15% from last month',
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: <DollarSign className="h-6 w-6 text-yellow-600" />
    }
  ];

  const tabs = [
    { id: 'assigned', name: 'Assigned Tasks', count: assignedTasks.length },
    { id: 'posted', name: 'Posted Tasks', count: userTasks.length }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please log in to view your dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {user.name}! Here's your activity overview.
            </p>
          </div>
          <Button 
            variant="primary" 
            className="mt-4 sm:mt-0"
            onClick={() => navigate('/post-task')}
          >
            <Plus size={20} className="mr-2" />
            Post New Task
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'assigned' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignedTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No assigned tasks yet</p>
                      <p className="text-sm text-gray-400 mt-2">Tasks assigned to you will appear here</p>
                    </div>
                  ) : (
                    assignedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'posted' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No posted tasks yet</p>
                      <Button 
                        variant="primary" 
                        className="mt-4"
                        onClick={() => navigate('/post-task')}
                      >
                        Post Your First Task
                      </Button>
                    </div>
                  ) : (
                    userTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
