import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Home, 
  BookOpen, 
  Database, 
  BarChart2, 
  Play, 
  Users,
  ChevronRight,
  Github
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, description: 'Project Overview' },
    { id: 'how-it-works', label: 'Methodology', icon: <BookOpen className="w-5 h-5" />, description: 'OLS Pipeline' },
    { id: 'dataset', label: 'Dataset', icon: <Database className="w-5 h-5" />, description: 'Data Analysis' },
    { id: 'results', label: 'Results', icon: <BarChart2 className="w-5 h-5" />, description: 'Metrics & Charts' },
    { id: 'demo', label: 'Live Demo', icon: <Play className="w-5 h-5" />, description: 'Test Model' },
    { id: 'team', label: 'The Team', icon: <Users className="w-5 h-5" />, description: 'Faculty & Students' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 
        TOP BAR 
        Designed to be clean. Only Logo (Home) and Menu Trigger are visible.
      */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo / Home */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => handleNavClick('home')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <div className="relative bg-slate-900 dark:bg-white rounded-xl p-2 mr-3 border border-slate-800 dark:border-slate-200 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <BrainCircuit className="h-5 w-5 text-white dark:text-slate-900" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                  HateSpeech<span className="text-blue-600 dark:text-blue-400">OLS</span>
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle (Subtle) */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* The "Pill" Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="group flex items-center space-x-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 active:scale-95 border border-transparent dark:border-slate-200"
              >
                <span className="text-sm font-semibold tracking-wide">MENU</span>
                <div className="bg-white dark:bg-slate-900 rounded-full p-1.5 group-hover:rotate-180 transition-transform duration-500">
                  <Menu className="h-4 w-4 text-slate-900 dark:text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        SLIDE-OUT DRAWER 
        Uses absolute positioning and transforms for a smooth native-app feel.
      */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none ${isMenuOpen ? 'pointer-events-auto' : ''}`}
      >
        {/* Backdrop (Darkens the site) */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => setIsMenuOpen(false)}
        />

        {/* The Panel */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800/50">
             <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Navigation</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Select a destination</p>
             </div>
             <button 
              onClick={() => setIsMenuOpen(false)}
              className="group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <X className="h-6 w-6 text-slate-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-8 px-6 space-y-3">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full group flex items-center p-4 rounded-2xl transition-all duration-300 border ${
                  currentPage === item.id
                    ? 'bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
                style={{ 
                  // Staggered animation delay based on index
                  transitionDelay: isMenuOpen ? `${idx * 50}ms` : '0ms',
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)'
                }}
              >
                <div className={`
                  p-3 rounded-xl transition-colors duration-300 
                  ${currentPage === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }
                `}>
                  {item.icon}
                </div>
                
                <div className="ml-5 text-left flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`text-base font-bold ${
                      currentPage === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {item.label}
                    </p>
                    {currentPage === item.id && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{item.description}</p>
                </div>

                <ChevronRight className={`h-4 w-4 text-slate-300 dark:text-slate-600 transition-transform duration-300 ${
                  currentPage === item.id ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
               <span className="text-sm font-semibold text-slate-900 dark:text-white">Theme</span>
               <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                  <button 
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400'}`}
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-slate-600 shadow-sm text-blue-400' : 'text-slate-400'}`}
                  >
                    <Moon className="h-4 w-4" />
                  </button>
               </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <Github className="h-3.5 w-3.5" />
                View Source
              </a>
              <span>© 2026 CS Batch 14</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;