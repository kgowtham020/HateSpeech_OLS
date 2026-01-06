import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { analyzeText } from '../services/geminiService';
import { PredictionResult, ClassLabel } from '../types';

const Demo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await analyzeText(inputText);
      setResult(prediction);
    } catch (err) {
      setError("An error occurred during classification. Please check your API Key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (label: ClassLabel) => {
    switch (label) {
      case ClassLabel.HATE_SPEECH: return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200';
      case ClassLabel.OFFENSIVE_LANGUAGE: return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      case ClassLabel.NORMAL: return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getResultIcon = (label: ClassLabel) => {
    switch (label) {
      case ClassLabel.HATE_SPEECH: return <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />;
      case ClassLabel.OFFENSIVE_LANGUAGE: return <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
      case ClassLabel.NORMAL: return <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Live Model Demo</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter text below to test the classifier. The model will preprocess the text (TF-IDF) 
          and classify it using the trained logic.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6">
          <label htmlFor="tweet-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Text Input
          </label>
          <textarea
            id="tweet-input"
            rows={5}
            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="Type a sentence here to analyze... (e.g., 'You are an absolute idiot' or 'I love this sunny day')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePredict}
              disabled={loading || !inputText.trim()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-5 w-5" />
                  Analyze Text
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 m-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Analysis Result</h3>
            
            <div className={`rounded-lg border p-4 flex items-start ${getResultColor(result.label)}`}>
              <div className="flex-shrink-0 mt-0.5">
                {getResultIcon(result.label)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-lg font-bold">{result.label}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white dark:bg-black/30 bg-opacity-50">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm opacity-90">{result.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;