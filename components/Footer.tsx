import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Branding Left */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform">
               <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
               <p className="font-bold text-slate-900 dark:text-white text-sm leading-none">HateSpeech<span className="text-blue-600 dark:text-blue-400">OLS</span></p>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-medium">Capstone Project 2026</p>
            </div>
          </div>

          {/* Credits Right */}
          <div className="flex flex-col md:items-end text-center md:text-right space-y-1">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Designed & Developed by <span className="font-bold text-slate-900 dark:text-white">CS Batch 14</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Department of Artificial Intelligence & Data Science
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-wider">
              GITAM (Deemed to be University) Bengaluru Campus
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;