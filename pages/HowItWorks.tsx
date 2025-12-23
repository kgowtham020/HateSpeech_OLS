import React from 'react';
import { Database, Filter, Binary, FileText, CheckCircle, BarChart2, ArrowDown, ArrowRight, Table, Scissors } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Methodology</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A deep dive into the machine learning pipeline. See exactly how raw text is transformed into a prediction using OLS-based feature selection.
        </p>
      </div>

      <div className="space-y-24">
        {/* Step 1: Data Collection */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg transform rotate-3">
                <Database className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Dataset Collection</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                We utilize the <strong>Davidson Hate Speech Dataset</strong>. It contains ~25,000 tweets labeled by humans. This provides the "Ground Truth" our model learns from.
              </p>
              
              {/* Visual Aid */}
              <div className="bg-slate-800 rounded-lg p-4 shadow-md overflow-hidden font-mono text-sm text-slate-300 border border-slate-700">
                <div className="flex border-b border-slate-600 pb-2 mb-2 font-bold text-slate-100">
                  <span className="w-16">Class</span>
                  <span className="flex-1">Tweet Text</span>
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-16 text-red-400">Hate</span>
                    <span className="flex-1">"These people are trash..."</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 text-amber-400">Offen</span>
                    <span className="flex-1">"Stop acting so crazy..."</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 text-green-400">Norm</span>
                    <span className="flex-1">"I love my bird..."</span>
                  </div>
                  <div className="pt-2 text-xs text-slate-500 italic text-center">... 24,000+ more rows</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Preprocessing */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg transform -rotate-2">
                <Filter className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Text Preprocessing</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                Raw social media text is messy. We clean it to reduce noise so the algorithm focuses only on meaningful words. This involves lowercasing, removing handles, URLs, and stemming/lemmatization.
              </p>

              {/* Visual Aid: Transformation */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                <div className="md:col-span-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-2">Input (Raw)</p>
                  <p className="font-mono text-slate-800 dark:text-slate-200 text-sm">
                    "RT @User: I HATE this!! 😡 <br/> Check http://url.com #annoying"
                  </p>
                </div>
                
                <div className="md:col-span-1 flex justify-center">
                  <ArrowRight className="h-8 w-8 text-slate-400 hidden md:block" />
                  <ArrowDown className="h-8 w-8 text-slate-400 md:hidden" />
                </div>

                <div className="md:col-span-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-2">Output (Cleaned)</p>
                  <p className="font-mono text-slate-800 dark:text-slate-200 text-sm">
                    "hate this check annoy"
                  </p>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-center"><Scissors className="h-3 w-3 mr-2" /> Removed @mentions</li>
                <li className="flex items-center"><Scissors className="h-3 w-3 mr-2" /> Removed URLs</li>
                <li className="flex items-center"><Scissors className="h-3 w-3 mr-2" /> Removed Punctuation/Emoji</li>
                <li className="flex items-center"><Scissors className="h-3 w-3 mr-2" /> Lemmatization applied</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3: TF-IDF */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg transform rotate-1">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Feature Extraction (TF-IDF)</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                Computers can't read text, they need numbers. We use <strong>TF-IDF (Term Frequency-Inverse Document Frequency)</strong> to convert tweets into numerical vectors. Rare words get higher weights; common words (like "the") get lower weights.
              </p>

              {/* Visual Aid: Matrix */}
              <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <table className="min-w-full text-sm text-center">
                  <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                    <tr>
                      <th className="p-2 border-r dark:border-slate-600">Tweet ID</th>
                      <th className="p-2 border-r dark:border-slate-600">"hate"</th>
                      <th className="p-2 border-r dark:border-slate-600">"love"</th>
                      <th className="p-2 border-r dark:border-slate-600">"trash"</th>
                      <th className="p-2">... (10k words)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-700 dark:text-slate-300">
                    <tr className="border-t dark:border-slate-700">
                      <td className="p-2 border-r dark:border-slate-600 bg-slate-50 dark:bg-slate-700 font-bold">1</td>
                      <td className="p-2 border-r dark:border-slate-600 bg-indigo-50 dark:bg-indigo-900 font-bold text-indigo-700 dark:text-indigo-300">0.52</td>
                      <td className="p-2 border-r dark:border-slate-600">0.00</td>
                      <td className="p-2 border-r dark:border-slate-600">0.00</td>
                      <td className="p-2 text-slate-400">...</td>
                    </tr>
                    <tr className="border-t dark:border-slate-700">
                      <td className="p-2 border-r dark:border-slate-600 bg-slate-50 dark:bg-slate-700 font-bold">2</td>
                      <td className="p-2 border-r dark:border-slate-600">0.00</td>
                      <td className="p-2 border-r dark:border-slate-600 bg-indigo-50 dark:bg-indigo-900 font-bold text-indigo-700 dark:text-indigo-300">0.48</td>
                      <td className="p-2 border-r dark:border-slate-600">0.00</td>
                      <td className="p-2 text-slate-400">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: OLS Selection */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg transform -rotate-1">
                <Binary className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. OLS Feature Selection</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                <strong>The Core Project Innovation.</strong> TF-IDF creates thousands of features (columns), making the model slow and prone to overfitting. We use <strong>Orthogonal Least Squares (OLS)</strong> to mathematically select only the most distinct and informative columns, discarding the noise.
              </p>

              {/* Visual Aid: Selection */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative transition-colors">
                <div className="flex justify-between items-center mb-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span>Original Features (10,000+)</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-teal-600 dark:text-teal-400 font-bold">Selected Features (~1,500)</span>
                </div>
                <div className="flex gap-1 h-12">
                  {/* Columns visualization */}
                  {[...Array(20)].map((_, i) => {
                    // Highlight specific columns to represent selection
                    const isSelected = [2, 5, 8, 14, 18].includes(i);
                    return (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-sm transition-all duration-500 ${isSelected ? 'bg-teal-500 scale-110 shadow-sm' : 'bg-slate-200 dark:bg-slate-600 opacity-30'}`}
                        title={isSelected ? "Selected Feature" : "Discarded"}
                      ></div>
                    )
                  })}
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">OLS algorithm scans and picks only the columns (blue) that minimize error variance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 5 & 6: Training & Eval */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg transform rotate-2">
                <BarChart2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Training & Evaluation</h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                We feed the optimized OLS features into a <strong>Logistic Regression</strong> model. The model learns a decision boundary to separate the classes. We then test it on unseen data to generate an accuracy report.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center text-center">
                  <h4 className="text-emerald-800 dark:text-emerald-300 font-bold mb-1">Random Forest</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">Complex, Non-linear</p>
                  <div className="w-full bg-white dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-xs font-bold mt-1 text-slate-600 dark:text-slate-300">89% F1-Score</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center text-center">
                  <h4 className="text-indigo-800 dark:text-indigo-300 font-bold mb-1">Logistic Regression</h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Linear, Fast (Winner)</p>
                  <div className="w-full bg-white dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-xs font-bold mt-1 text-slate-600 dark:text-slate-300">91% F1-Score</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HowItWorks;