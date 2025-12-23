import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Demo from './pages/Demo';
import Dataset from './pages/Dataset';
import Results from './pages/Results';
import Team from './pages/Team';
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={() => setCurrentPage('demo')} />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'dataset':
        return <Dataset />;
      case 'results':
        return <Results />;
      case 'demo':
        return <Demo />;
      case 'team':
        return <Team />;
      default:
        return <Home onStart={() => setCurrentPage('demo')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;