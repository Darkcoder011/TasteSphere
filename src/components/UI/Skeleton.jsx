import { motion } from 'framer-motion';

export const SkeletonCard = ({ className = '', count = 1 }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
          className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex space-x-4">
            <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-600 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const SkeletonChip = ({ count = 3, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
          className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
        ></motion.div>
      ))}
    </div>
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 && i !== 0 ? 'w-5/6' : 'w-full'
          }`}
        ></motion.div>
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
      className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-600 ${className}`}
    ></motion.div>
  );
};

export const SkeletonRectangle = ({ width = 'full', height = 'h-4', className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
      className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    ></motion.div>
  );
};

export const SkeletonCircle = ({ size = 'h-8 w-8', className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
      className={`${size} rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
    ></motion.div>
  );
};
