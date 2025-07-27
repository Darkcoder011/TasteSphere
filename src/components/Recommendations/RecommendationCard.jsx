import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/20/solid';

const RecommendationCard = ({ recommendation, entityType }) => {
  // Determine icon and styling based on entity type
  const getEntityTypeInfo = () => {
    const typeMap = {
      movie: { icon: '🎬', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-200' },
      book: { icon: '📚', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-200' },
      artist: { icon: '🎤', bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-800 dark:text-pink-200' },
      tv_show: { icon: '📺', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-200' },
      podcast: { icon: '🎧', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200' },
      place: { icon: '📍', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-200' },
      brand: { icon: '🏷️', bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-200' },
      person: { icon: '👤', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
      destination: { icon: '✈️', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-200' },
    };
    
    return typeMap[entityType] || { icon: '✨', bg: 'bg-gray-100', text: 'text-gray-800' };
  };
  
  const { icon, bg, text } = getEntityTypeInfo();
  
  // Generate a gradient based on the entity name for fallback
  const generateGradient = (name) => {
    // Simple hash function to generate consistent colors from name
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 80%), hsl(${(hue + 30) % 360}, 70%, 60%))`;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -4,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={recommendation.image_url || ''}
          alt={recommendation.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Hide the broken image and show the fallback content
            e.target.style.display = 'none';
            const fallback = e.target.parentElement.querySelector('.image-fallback');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className="image-fallback w-full h-full flex items-center justify-center"
          style={{
            display: recommendation.image_url ? 'none' : 'flex',
            background: generateGradient(recommendation.name),
          }}
        >
          <div className="text-center p-4">
            <span className="text-6xl block mb-2">{icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
              {recommendation.name}
            </span>
          </div>
        </div>
        
        {/* Rating badge */}
        {recommendation.rating && (
          <div className="absolute top-2 right-2 flex items-center px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
            <StarIcon className="w-3 h-3 text-yellow-400 mr-1" />
            {recommendation.rating.toFixed(1)}
          </div>
        )}
        
        {/* Year badge */}
        {recommendation.year && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
            {recommendation.year}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {recommendation.name}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {entityType.replace('_', ' ')}
          </span>
        </div>
        
        {/* Author for books */}
        {recommendation.author && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            by {recommendation.author}
          </p>
        )}
        
        {/* Genre for music/artists */}
        {recommendation.genre && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {recommendation.genre}
          </p>
        )}
        
        {/* Location for places */}
        {recommendation.location && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {recommendation.location}
          </p>
        )}
        
        {/* Description */}
        {recommendation.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {recommendation.description}
          </p>
        )}
        
        {/* Action buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            onClick={() => console.log('Learn more:', recommendation.name)}
          >
            Learn more
          </button>
          
          <div className="flex space-x-2">
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Save:', recommendation.name);
              }}
              aria-label="Save"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Share:', recommendation.name);
              }}
              aria-label="Share"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
