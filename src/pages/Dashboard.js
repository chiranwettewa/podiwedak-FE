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
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);
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
      const tasksData = await ApiService.getAllTasks();
      setAllTasks(tasksData || []);
      
      // Try to fetch payments, but handle auth errors gracefully
      try {
        const paymentsData = await ApiService.get(`/payments/user/${user.id}`);
        setPayments(paymentsData.data || []);
      } catch (paymentError) {
        console.warn('Could not fetch payments data:', paymentError);
        setPayments([]); // Set empty array if payments can't be fetched
      }
      
      // Get current user info from localStorage as backup
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = user?.id || storedUser?.id;
      const currentUserEmail = user?.email || storedUser?.email;
      
      // Filter user's tasks using multiple criteria
      const myTasks = (tasksData || []).filter(task => {
        if (!task.user) return false;
        
        // Try multiple comparison methods
        const userIdMatch = task.user.id == currentUserId || 
                           task.user.id === currentUserId ||
                           task.user.id === parseInt(currentUserId) ||
                           task.user.id === String(currentUserId);
        
        const emailMatch = task.user.email === currentUserEmail;
        
        return userIdMatch || emailMatch;
      });
      
      setUserTasks(myTasks);
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
      title: 'Total Tasks Posted',
      value: userTasks.length,
      change: '+12% from last month',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      icon: <Calendar className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Active Tasks',
      value: postedTasks.length,
      change: '+5% from last week',
      color: 'bg-green-50 dark:bg-green-900/20',
      icon: <Clock className="h-6 w-6 text-green-600" />
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length,
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
    { id: 'overview', name: 'Overview', count: null },
    { id: 'posted', name: 'Posted Tasks', count: postedTasks.length },
    { id: 'completed', name: 'Completed', count: completedTasks.length }
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
        <div className="mb-8">
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Posted Tasks */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Posted Tasks
                    </h3>
                    {postedTasks.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No posted tasks yet</p>
                    ) : (
                      <div className="space-y-4">
                        {postedTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <DollarSign size={14} className="mr-1" />
                                    ${task.budget}
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {task.location}
                                  </span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Payments */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Transactions
                    </h3>
                    {payments.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                    ) : (
                      <div className="space-y-4">
                        {payments.slice(0, 5).map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{payment.description}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${payment.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                                {payment.type === 'DEPOSIT' ? '+' : '-'}${payment.amount}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.type)}`}>
                                {payment.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'posted' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postedTasks.length === 0 ? (
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
                    postedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No completed tasks yet</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment History
                  </h3>
                  {payments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {payment.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.type)}`}>
                                  {payment.type}
                                </span>
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                payment.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {payment.type === 'DEPOSIT' ? '+' : '-'}${payment.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
