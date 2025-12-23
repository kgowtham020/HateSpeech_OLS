import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400 py-8 mt-auto border-t border-slate-800 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="text-sm font-medium text-slate-300">© {new Date().getFullYear()} University Capstone Project</p>
          <p className="text-xs mt-1 text-slate-500">Hate Speech Detection using OLS-Based Feature Selection</p>
        </div>
        <div className="text-sm text-center md:text-right">
          <p>Powered by React, Tailwind, & Gemini API (Simulation)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;