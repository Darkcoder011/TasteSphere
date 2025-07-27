import { Fragment } from 'react';
import { UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAnalysis = message.isAnalysis;
  const isError = message.isError;

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial="hidden"
      animate="visible"
      variants={messageVariants}
    >
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Message content */}
        <div className={`relative ${isUser ? 'text-right' : 'text-left'}`}>
          <div 
            className={`inline-block px-4 py-2 rounded-lg ${
              isUser 
                ? 'bg-primary-600 text-white rounded-tr-none' 
                : isAnalysis 
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-tl-none border-l-4 border-amber-400 dark:border-amber-500'
                  : isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 rounded-tl-none border-l-4 border-red-400 dark:border-red-500'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600 rounded-tl-none'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.text}
            </div>
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 text-gray-500 dark:text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
