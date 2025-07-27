import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { analyzeWithGemini } from '../utils/gemini';
import { fetchRecommendations } from '../utils/qloo';

// Create context
const AppContext = createContext();

// Entity types for filtering
const ENTITY_TYPES = {
  movie: { id: 'movie', label: 'Movies', icon: '🎬' },
  book: { id: 'book', label: 'Books', icon: '📚' },
  artist: { id: 'artist', label: 'Artists', icon: '🎤' },
  tv_show: { id: 'tv_show', label: 'TV Shows', icon: '📺' },
  podcast: { id: 'podcast', label: 'Podcasts', icon: '🎧' },
  place: { id: 'place', label: 'Places', icon: '📍' },
  brand: { id: 'brand', label: 'Brands', icon: '🏷️' },
  person: { id: 'person', label: 'People', icon: '👤' },
  destination: { id: 'destination', label: 'Destinations', icon: '✈️' },
};

export const AppProvider = ({ children }) => {
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Chat & Recommendations
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState({});
  const [entities, setEntities] = useState([]);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      // Save preference to localStorage
      if (newDarkMode) {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
      } else {
        localStorage.theme = 'light';
        document.documentElement.classList.remove('dark');
      }
      return newDarkMode;
    });
  }, []);
  
  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  // Add a new message to the chat
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // Clear chat and reset state
  const clearChat = useCallback(() => {
    setMessages([]);
    setRecommendations({});
    setEntities([]);
    setActiveFilter('all');
  }, []);
  
  // Process input with Gemini and fetch recommendations
  const analyzeWithGeminiAndFetchRecs = useCallback(async (text, isRetry = false) => {
    if (isRetry) {
      // Remove the last AI message (error or previous response) when retrying
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === 'assistant') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
    try {
      // Call Gemini to analyze the text and extract entities
      const { entities, analysis, mockData } = await analyzeWithGemini(text);
      
      // If we have mock data from the Gemini mock, use it
      if (mockData && Object.keys(mockData).length > 0) {
        return {
          entities: entities.map(entity => ({
            ...entity,
            mockData: mockData[entity.type] || []
          })),
          analysis
        };
      }
      
      // Otherwise, fetch recommendations from Qloo API
      const entitiesWithRecs = await Promise.all(
        entities.map(async (entity) => {
          const recs = await fetchRecommendations(entity.type, 5);
          return {
            ...entity,
            recs
          };
        })
      );
      
      return {
        entities: entitiesWithRecs,
        analysis
      };
      
    } catch (error) {
      console.error('Error in analyzeWithGeminiAndFetchRecs:', error);
      throw error;
    }
  }, []);
  
  // Process user input and generate recommendations
  const processUserInput = useCallback(async (inputText, isRetry = false) => {
    if (!inputText.trim() || isLoading) return;
    
    // Add user message if this is not a retry
    if (!isRetry) {
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: inputText,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Analyze input with Gemini and fetch recommendations
      const { entities: extractedEntities, analysis } = await analyzeWithGeminiAndFetchRecs(inputText, isRetry);
      
      // Add AI analysis to chat
      addMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: analysis,
        timestamp: new Date().toISOString(),
        isAnalysis: true,
      });
      
      // Process entities and their recommendations
      const newRecommendations = { ...recommendations };
      const processedEntities = [];
      
      for (const entity of extractedEntities) {
        // Use mock data if available, otherwise use fetched recs
        const recs = entity.recs || entity.mockData || [];
        newRecommendations[entity.type] = recs;
        processedEntities.push({
          ...entity,
          count: recs.length
        });
      }
      
      // Update state
      setEntities(processedEntities);
      setRecommendations(newRecommendations);
      
      // Add recommendation summary to chat
      if (processedEntities.length > 0) {
        addMessage({
          id: Date.now() + 2,
          role: 'assistant',
          content: `I found ${processedEntities.length} categories of recommendations for you!`,
          timestamp: new Date().toISOString(),
        });
        
        // Set the first entity type as active filter if none is selected
        if (activeFilter === 'all' && processedEntities[0]?.type) {
          setActiveFilter(processedEntities[0].type);
        }
      }
      
    } catch (error) {
      console.error('Error processing input:', error);
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isError: true,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, analyzeWithGeminiAndFetchRecs, addMessage]);
  
  // Close sidebar
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    // State
    darkMode,
    isSidebarOpen: sidebarOpen,
    messages,
    isLoading,
    recommendations,
    entities,
    activeFilter,
    entityTypes: ENTITY_TYPES,
    
    // Actions
    toggleDarkMode,
    toggleSidebar,
    closeSidebar,
    processUserInput,
    clearChat,
    setActiveFilter,
    setSidebarOpen, // Add this line to expose setSidebarOpen
    addMessage,
  }), [
    darkMode,
    sidebarOpen,
    messages,
    isLoading,
    recommendations,
    entities,
    activeFilter,
    toggleDarkMode,
    toggleSidebar,
    processUserInput,
    clearChat,
    addMessage,
  ]);
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useApp = useAppContext;

export default AppContext;
