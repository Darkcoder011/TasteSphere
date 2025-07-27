import { motion, AnimatePresence } from 'framer-motion';
import RecommendationCard from './RecommendationCard';
import { SkeletonCard } from '../UI/Skeleton';

const RecommendationsGrid = ({ recommendations, activeFilter, isLoading }) => {
  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === 'all' 
    ? Object.values(recommendations).flat() 
    : recommendations[activeFilter] || [];

  // Animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    }
  };

  // Animation variants for each grid item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results state
  if (filteredRecommendations.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No recommendations found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {activeFilter === 'all' 
            ? "We couldn't find any recommendations. Try adjusting your search or filters."
            : `No ${activeFilter} recommendations found. Try a different category or search term.`}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`grid-${activeFilter}`}
    >
      <AnimatePresence mode="popLayout">
        {filteredRecommendations.map((rec, index) => (
          <motion.div
            key={`${rec.id || rec.name}-${index}`}
            variants={itemVariants}
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <RecommendationCard 
              recommendation={rec} 
              entityType={activeFilter === 'all' ? rec.type : activeFilter} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecommendationsGrid;
