import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const TaskCard = ({ task, onClick }) => {
  const { t } = useTranslation();

  // Use task.user instead of task.poster and add null checks
  const user = task.user || {};
  const avatar = user.avatar || 'https://via.placeholder.com/32';
  const name = user.name || 'Unknown User';
  const rating = user.rating || 0;
  const reviews = user.reviews || 0;

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="card p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {task.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {task.description}
          </p>
        </div>
        {task.image && (
          <img 
            src={task.image} 
            alt={task.title}
            className="w-16 h-16 rounded-lg object-cover ml-4"
          />
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center">
          <MapPin size={16} className="mr-1" />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-1" />
          <span>{task.timeAgo || 'Recently'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-primary-600 font-semibold">
            <DollarSign size={18} className="mr-1" />
            <span>${task.budget}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <User size={16} className="mr-1" />
            <span>{task.offers || 0} offers</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle make offer
            }}
          >
            {t('tasks.makeOffer')}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <img 
          src={avatar} 
          alt={name}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </p>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(rating))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({reviews})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
