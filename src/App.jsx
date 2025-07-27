import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ChatInterface from './components/Chat/ChatInterface';
import Sidebar from './components/UI/Sidebar';
import Header from './components/UI/Header';

// Create a router with future flags enabled
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <ChatInterface />
              </div>
            </main>
          </div>
        </div>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Main App component
const App = () => {
  // Apply dark mode class to HTML element when dark mode is enabled
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
