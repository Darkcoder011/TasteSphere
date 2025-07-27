import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Message from './Message';
import RecommendationsGrid from '../Recommendations/RecommendationsGrid';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { PaperAirplaneIcon, ArrowPathIcon, XMarkIcon, TrashIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: {
      duration: 0.2,
    },
  },
};

const inputContainerVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
};

const buttonHover = {
  scale: 1.05,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

const buttonTap = {
  scale: 0.95,
};

const ChatInterface = () => {
  const { 
    messages, 
    isLoading, 
    processUserInput, 
    clearChat,
    recommendations,
    activeFilter,
    setActiveFilter,
    entities,
    isSidebarOpen,
    toggleSidebar
  } = useApp();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, recommendations]);
  
  // Focus input on load and after sending a message
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    processUserInput(input);
    setInput('');
  };
  
  const handleTryAgain = () => {
    if (messages.length < 2 || isLoading) return;
    
    // Get the last user message that wasn't a retry
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      processUserInput(lastUserMessage.content, true);
    }
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
      clearChat();
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+Enter or Ctrl+Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        formRef.current?.requestSubmit();
      }
      
      // Escape to clear input
      if (e.key === 'Escape' && input) {
        e.preventDefault();
        setInput('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);
  
  // Check if there are recommendations to show
  const hasRecommendations = Object.values(recommendations).some(recs => recs.length > 0);
  
  return (
    <div className="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      {hasRecommendations && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed bottom-20 right-4 z-20 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={isSidebarOpen ? 'Hide filters' : 'Show filters'}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          )}
        </button>
      )}
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* Action Buttons */}
        <motion.div 
          className="flex justify-end gap-2 mb-4 sticky top-0 z-10 bg-white dark:bg-gray-900 pb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: messages.length > 0 ? 1 : 0,
            y: messages.length > 0 ? 0 : -10,
            transition: { duration: 0.3 }
          }}
        >
          {messages.length > 1 && (
            <motion.button
              onClick={handleTryAgain}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Try again with the last message"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <ArrowPathRoundedSquareIcon className="h-4 w-4" />
              <span>Try Again</span>
            </motion.button>
          )}
          {messages.length > 0 && (
            <motion.button
              onClick={handleClearChat}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear chat history"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <TrashIcon className="h-4 w-4" />
              <span>Clear Chat</span>
            </motion.button>
          )}
        </motion.div>
        
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              <Message message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Recommendations */}
        {Object.keys(recommendations).length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <RecommendationsGrid 
              recommendations={recommendations} 
              activeFilter={activeFilter}
              isLoading={isLoading}
            />
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <motion.div 
        className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900"
        variants={inputContainerVariants}
        initial="initial"
        animate="animate"
      >
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          <div className="relative flex-1">
            <motion.textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              placeholder="Tell me what you like (e.g., 'I love sci-fi movies and indie music')"
              rows={1}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none max-h-32 transition-all duration-200"
              disabled={isLoading}
              whileFocus={{ 
                boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.2)',
                transition: { duration: 0.2 }
              }}
            />
            <AnimatePresence>
              {input && (
                <motion.button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={!isLoading && input.trim() ? { 
              scale: 1.05,
              backgroundColor: '#06b6d4',
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            } : {}}
            whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Send message</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
