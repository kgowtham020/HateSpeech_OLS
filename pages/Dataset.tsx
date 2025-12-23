import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatasetRow } from '../types';
import { ArrowRight } from 'lucide-react';

const Dataset: React.FC = () => {
  // Mock sample data resembling Davidson dataset with preprocessed versions
  const sampleData: DatasetRow[] = [
    { 
      id: 1, 
      label: "Hate Speech", 
      text: "RT @user: These people are absolute trash... [REDACTED]", 
      processedText: "people absolute trash [redacted]"
    },
    { 
      id: 2, 
      label: "Offensive", 
      text: "This game is straight up ghetto trash lol", 
      processedText: "game straight ghetto trash lol" 
    },
    { 
      id: 3, 
      label: "Normal", 
      text: "Just ordered some pizza for the game tonight!", 
      processedText: "ordered pizza game tonight" 
    },
    { 
      id: 4, 
      label: "Hate Speech", 
      text: "We need to get rid of all the [slur] in this town.", 
      processedText: "need rid [slur] town" 
    },
    { 
      id: 5, 
      label: "Normal", 
      text: "The birds are singing so beautifully today.", 
      processedText: "bird singing beautifully today" 
    },
    { 
      id: 6, 
      label: "Offensive", 
      text: "Shut up b***h, nobody asked you.", 
      processedText: "shut b***h nobody asked" 
    },
  ];

  const distributionData = [
    { name: 'Hate Speech', value: 1430 }, // Approx from Davidson
    { name: 'Offensive', value: 19190 },
    { name: 'Normal', value: 4163 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Dataset & Preprocessing</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Davidson et al. (2017)</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            We use the widely cited Davidson dataset collected from Twitter. The dataset separates "Hate Speech" 
            from "Offensive Language", a crucial distinction as many automated systems conflate the two.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 0 - Hate Speech:</strong> Language that is used to express hatred towards a targeted group or is intended to be derogatory on the basis of some group characteristic.</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-amber-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 1 - Offensive Language:</strong> Language that is vulgar, rude, or insulting, but lacks specific hate intent towards a protected group.</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 2 - Normal:</strong> Neutral or positive tweets.</span>
            </li>
          </ul>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-80 transition-colors">
          <h4 className="text-center font-medium text-slate-500 dark:text-slate-400 mb-2">Class Distribution (Imbalanced)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Preprocessing in Action</h3>
        <p className="text-slate-600 dark:text-slate-300">
          The table below demonstrates how raw tweets are transformed before feature extraction. 
          Notice the removal of stopwords ("are", "the", "for"), handles ("@user"), and punctuation.
        </p>
      </div>

      <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-12">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-1/3">Raw Input (Before)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-8"></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-1/3">Preprocessed Output (After)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Label</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {sampleData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 italic border-r border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                    "{row.text}"
                  </td>
                  <td className="px-2 py-4 text-center">
                    <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-sm text-indigo-700 dark:text-indigo-400 font-mono font-medium bg-indigo-50/30 dark:bg-indigo-900/20">
                    {row.processedText}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                      ${row.label === 'Hate Speech' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' : 
                        row.label === 'Offensive' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'}`}>
                      {row.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dataset;