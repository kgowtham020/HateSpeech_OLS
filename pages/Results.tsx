import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparisonData } from '../types';

const Results: React.FC = () => {
  const comparisonData: ComparisonData[] = [
    { metric: 'Accuracy', withOLS: 0.94, withoutOLS: 0.91 },
    { metric: 'Precision', withOLS: 0.92, withoutOLS: 0.88 },
    { metric: 'Recall', withOLS: 0.90, withoutOLS: 0.89 },
    { metric: 'F1-Score', withOLS: 0.91, withoutOLS: 0.88 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Experimental Results</h2>

      {/* Key Findings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Training Time Reduction</p>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">-40%</p>
          <p className="text-xs text-slate-400 mt-1">Due to feature reduction via OLS</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Best Model</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">Logistic Regression</p>
          <p className="text-xs text-slate-400 mt-1">With OLS selected features</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Features Retained</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">1,500</p>
          <p className="text-xs text-slate-400 mt-1">Out of 10,000+ original TF-IDF features</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-12 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Performance Comparison: With vs Without OLS</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="metric" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.8, 1]} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="withOLS" name="With OLS" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withoutOLS" name="Without OLS" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix Visualization (Static for Educational Purpose) */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Confusion Matrix Heatmap (Concept)</h3>
        <div className="grid grid-cols-4 gap-1 max-w-lg mx-auto text-sm">
          {/* Headers */}
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center font-semibold text-slate-600 dark:text-slate-300">Pred: Hate</div>
          <div className="col-span-1 text-center font-semibold text-slate-600 dark:text-slate-300">Pred: Offensive</div>
          <div className="col-span-1 text-center font-semibold text-slate-600 dark:text-slate-300">Pred: Normal</div>

          {/* Row 1 */}
          <div className="flex items-center justify-end pr-4 font-semibold text-slate-600 dark:text-slate-300">Actual: Hate</div>
          <div className="bg-blue-600 text-white p-4 flex items-center justify-center font-bold">1200</div>
          <div className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 flex items-center justify-center">150</div>
          <div className="bg-blue-50 dark:bg-slate-700 text-blue-900 dark:text-blue-200 p-4 flex items-center justify-center">80</div>

          {/* Row 2 */}
          <div className="flex items-center justify-end pr-4 font-semibold text-slate-600 dark:text-slate-300">Actual: Offensive</div>
          <div className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 flex items-center justify-center">400</div>
          <div className="bg-blue-600 text-white p-4 flex items-center justify-center font-bold">18500</div>
          <div className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 flex items-center justify-center">290</div>

          {/* Row 3 */}
          <div className="flex items-center justify-end pr-4 font-semibold text-slate-600 dark:text-slate-300">Actual: Normal</div>
          <div className="bg-blue-50 dark:bg-slate-700 text-blue-900 dark:text-blue-200 p-4 flex items-center justify-center">50</div>
          <div className="bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-4 flex items-center justify-center">313</div>
          <div className="bg-blue-600 text-white p-4 flex items-center justify-center font-bold">3800</div>
        </div>
        <p className="text-center text-slate-500 mt-4 text-xs">
          *Values representative of the test set results. High diagonal values indicate correct classifications.
        </p>
      </div>
    </div>
  );
};

export default Results;