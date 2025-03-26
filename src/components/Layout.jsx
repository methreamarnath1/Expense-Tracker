
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home, PieChart, Plus, Settings } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle responsive sidebar
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 icon" /> },
    { name: 'Add Expense', path: '/add', icon: <Plus className="w-5 h-5 icon" /> },
    { name: 'Statistics', path: '/statistics', icon: <PieChart className="w-5 h-5 icon" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 icon" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-30 h-full ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 md:w-72 bg-sidebar border-r border-border`}
      >
        <div className="flex flex-col h-full py-4 md:py-6">
          <div className="px-4 md:px-6 mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Expense Tracker</h1>
          </div>
          
          <nav className="flex-1 px-2 md:px-3">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 md:py-2.5 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-4 md:px-6 mt-auto">
            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50 text-xs md:text-sm">
              <p className="text-muted-foreground">All data is stored locally on your device.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 md:h-16 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md lg:hidden hover:bg-muted transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5 icon" /> : <ChevronRight className="w-5 h-5 icon" />}
            </button>
            <div className="ml-auto"></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-4 py-4 md:px-6 lg:px-8 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
