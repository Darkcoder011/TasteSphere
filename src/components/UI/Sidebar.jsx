import { Fragment, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, SparklesIcon, AdjustmentsHorizontalIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

const ENTITY_ICONS = {
  movie: '🎬',
  book: '📚',
  artist: '🎤',
  tv_show: '📺',
  podcast: '🎧',
  place: '📍',
  brand: '🏷️',
  person: '👤',
  destination: '✈️',
};

const Sidebar = () => {
  const { 
    isSidebarOpen, 
    closeSidebar, 
    entities, 
    activeFilter, 
    setActiveFilter,
    messages
  } = useApp();
  
  // Close sidebar when a filter is selected on mobile
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  // Get the latest analysis message
  const analysisMessage = useMemo(() => {
    return messages.findLast(msg => msg.isAnalysis)?.text || 'No analysis available';
  }, [messages]);

  // Group entities by type for better display
  const entityGroups = useMemo(() => {
    const groups = {};
    entities.forEach(entity => {
      if (!groups[entity.type]) {
        groups[entity.type] = [];
      }
      groups[entity.type].push(entity);
    });
    return groups;
  }, [entities]);

  const renderEntityChip = (entity) => (
    <motion.button
      key={`${entity.type}-${entity.name}`}
      onClick={() => handleFilterSelect(entity.type)}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        activeFilter === entity.type
          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      }`}
      title={`${entity.name} (${entity.type})`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="mr-1.5">{ENTITY_ICONS[entity.type] || '•'}</span>
      <span className="truncate max-w-[120px] sm:max-w-[200px]">{entity.name}</span>
    </motion.button>
  );

  // Render mobile sidebar
  const renderMobileSidebar = () => (
    <Transition.Root show={isSidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={closeSidebar}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis & Filters</h2>
                  <button
                    type="button"
                    className="rounded-md p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={closeSidebar}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col">
                  <div className="space-y-6">
                    {renderFilterSection()}
                    {renderEntitiesSection()}
                    {renderAnalysisSection()}
                  </div>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );

  // Render desktop sidebar
  const renderDesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex h-16 shrink-0 items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis & Filters</h2>
        </div>
        <nav className="flex flex-1 flex-col">
          <div className="space-y-6">
            {renderFilterSection()}
            {renderEntitiesSection()}
            {renderAnalysisSection()}
          </div>
        </nav>
      </div>
    </div>
  );

  // Render filter section
  const renderFilterSection = () => (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Filter by Type</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterSelect('all')}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All Types
        </button>
        {Object.entries(ENTITY_ICONS).map(([type, icon]) => (
          <button
            key={type}
            onClick={() => handleFilterSelect(type)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === type
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            title={type.replace('_', ' ')}
          >
            <span className="mr-1.5">{icon}</span>
            <span className="hidden sm:inline">{type.replace('_', ' ')}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Render entities section
  const renderEntitiesSection = () => (
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Extracted Entities</h3>
      <div className="space-y-2">
        {Object.entries(entityGroups).map(([type, entities]) => (
          <div key={type} className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center">
              <span className="mr-1.5">{ENTITY_ICONS[type] || '•'}</span>
              {type.replace('_', ' ')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {entities.map(entity => renderEntityChip(entity))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render analysis section
  const renderAnalysisSection = () => (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2">
        <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-1.5" />
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Analysis</h3>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
        {analysisMessage}
      </div>
    </div>
  );

  return (
    <>
      {renderMobileSidebar()}
      {renderDesktopSidebar()}
    </>
  );
};

export default Sidebar;
