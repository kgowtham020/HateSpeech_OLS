import React from 'react';
import { Database, Filter, Binary, FileText, BarChart2, CheckCircle, Terminal, Code2 } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Code2 className="h-4 w-4" />
            <span>Technical Architecture</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Inside the <span className="text-blue-600 dark:text-blue-400">Pipeline</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            From raw tweets to accurate predictions. Explore the Python code and mathematical logic that powers our OLS-based Hate Speech Detection model.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200 dark:bg-slate-800"></div>

          {/* STEP 1: Data Ingestion */}
          <TimelineItem 
            step="01"
            title="Data Ingestion"
            icon={<Database className="h-6 w-6 text-white" />}
            color="bg-indigo-500"
            description="We utilize the Davidson et al. (2017) dataset. It is loaded into a Pandas DataFrame, containing ~25k labeled tweets. The classes are heavily imbalanced, requiring careful handling during training."
            codeSnippet={`import pandas as pd

# Load the Davidson Hate Speech Dataset
df = pd.read_csv('labeled_data.csv')

# Class labels: 
# 0: Hate Speech, 1: Offensive, 2: Normal
print(df['class'].value_counts())
# Output: {1: 19190, 2: 4163, 0: 1430}`}
            alignment="left"
          />

          {/* STEP 2: Preprocessing */}
          <TimelineItem 
            step="02"
            title="NLP Preprocessing"
            icon={<Filter className="h-6 w-6 text-white" />}
            color="bg-pink-500"
            description="Raw text is noisy. We implement a rigorous cleaning pipeline using Regex and NLTK to remove handles, URLs, and punctuation. Lemmatization reduces words to their root form (e.g., 'running' -> 'run')."
            codeSnippet={`import re
from nltk.stem import WordNetLemmatizer

def preprocess(text):
    # 1. Lowercase & remove URLs/Handles
    text = text.lower()
    text = re.sub(r"http\S+|@\w+", '', text)
    
    # 2. Remove punctuation & numbers
    text = re.sub(r"[^\w\s]", '', text)
    
    # 3. Lemmatization
    lemmatizer = WordNetLemmatizer()
    return " ".join([lemmatizer.lemmatize(w) for w in text.split()])`}
            alignment="right"
          />

          {/* STEP 3: Vectorization */}
          <TimelineItem 
            step="03"
            title="TF-IDF Vectorization"
            icon={<FileText className="h-6 w-6 text-white" />}
            color="bg-cyan-500"
            description="We convert text into numerical vectors using TF-IDF. This statistical measure evaluates how relevant a word is to a document in a collection. We generate over 10,000 features initially."
            codeSnippet={`from sklearn.feature_extraction.text import TfidfVectorizer

# Convert text to sparse numerical matrix
# N-grams (1,3) captures phrases like "white trash"
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 3),
    stop_words='english'
)

X = vectorizer.fit_transform(cleaned_tweets)
print(X.shape) # (24783, 10000)`}
            alignment="left"
          />

          {/* STEP 4: OLS Selection */}
          <TimelineItem 
            step="04"
            title="OLS Feature Selection"
            icon={<Binary className="h-6 w-6 text-white" />}
            color="bg-blue-600"
            description="This is the core innovation. Instead of using all 10,000 features, we use Orthogonal Least Squares to mathematically select the top 1,500 features that contribute most to minimizing the error variance."
            codeSnippet={`# Custom OLS Implementation Logic
def ols_selection(X, y, n_features=1500):
    selected_indices = []
    
    # Iteratively select features that are 
    # most orthogonal to the error space
    for i in range(n_features):
        best_idx = find_next_best_feature(X, y, selected_indices)
        selected_indices.append(best_idx)
        
    return X[:, selected_indices]

X_optimized = ols_selection(X, y)`}
            alignment="right"
          />

           {/* STEP 5: Model Training */}
           <TimelineItem 
            step="05"
            title="Model Training"
            icon={<BarChart2 className="h-6 w-6 text-white" />}
            color="bg-emerald-500"
            description="The optimized feature set is fed into a Logistic Regression classifier. We use class weighting to handle the dataset imbalance. This lightweight model achieves superior performance due to the high quality of selected features."
            codeSnippet={`from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

# Train on optimized features
model = LogisticRegression(class_weight='balanced')
model.fit(X_train_ols, y_train)

# Inference
y_pred = model.predict(X_test_ols)
print(classification_report(y_test, y_pred))`}
            alignment="left"
          />

        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-900 dark:bg-black py-16 px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to test the architecture?</h3>
        <p className="text-slate-400 mb-8">Experience the speed of OLS-optimized inference in real-time.</p>
        <button 
          onClick={() => document.getElementById('navbar-demo')?.click()} 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
        >
          Launch Live Demo
        </button>
      </div>

    </div>
  );
};

// --- Subcomponents for Layout ---

interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  codeSnippet: string;
  alignment: 'left' | 'right';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, title, description, icon, color, codeSnippet, alignment }) => {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between mb-24 relative ${alignment === 'right' ? 'md:flex-row-reverse' : ''}`}>
      
      {/* Center Dot (Desktop Only) */}
      <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full border-4 border-slate-50 dark:border-slate-950 ${color} z-10 shadow-lg`}>
        {icon}
      </div>

      {/* Content Side */}
      <div className="w-full md:w-5/12 mb-8 md:mb-0">
        <div className={`flex flex-col ${alignment === 'left' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-center`}>
          <div className={`inline-flex items-center justify-center md:hidden h-12 w-12 rounded-full ${color} mb-4 shadow-lg`}>
            {icon}
          </div>
          <span className={`text-6xl font-black text-slate-100 dark:text-slate-800 leading-none mb-2 select-none`}>
            {step}
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>

      {/* Code Side */}
      <div className="w-full md:w-5/12">
        <div className="rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border border-slate-800 transform transition-transform hover:scale-[1.02] duration-300 group">
          
          {/* Mac-style Window Header */}
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between">
             <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
               <Terminal className="h-3 w-3" />
               python
             </div>
          </div>

          {/* Code Content */}
          <div className="p-4 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code className="block">
                {codeSnippet.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                     <span className="table-cell select-none text-slate-600 text-right pr-4 w-8">{i + 1}</span>
                     <span 
                       className="table-cell" 
                       dangerouslySetInnerHTML={{ 
                         __html: highlightSyntax(line) 
                       }} 
                     />
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};

// Simple syntax highlighter for visual effect
const highlightSyntax = (line: string) => {
  let processed = line
    .replace(/#.*/g, '<span class="text-slate-500 italic">$&</span>') // Comments
    .replace(/'[^']*'/g, '<span class="text-green-400">$&</span>') // Strings
    .replace(/"[^"]*"/g, '<span class="text-green-400">$&</span>') // Double Quote Strings
    .replace(/\b(import|from|def|return|for|in|if|else|print)\b/g, '<span class="text-pink-400 font-bold">$&</span>') // Keywords
    .replace(/\b(pd|re|nltk|sklearn|np)\b/g, '<span class="text-blue-400">$&</span>') // Libraries
    .replace(/\b(read_csv|sub|lemmatize|split|join|fit_transform|predict|fit)\b/g, '<span class="text-yellow-300">$&</span>'); // Functions
    
  return processed;
};

export default HowItWorks;