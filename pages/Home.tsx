import React from 'react';
import { ShieldCheck, Cpu, MessageSquare, Globe, Server, Lock, Mic } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-24 px-4 text-center transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-full px-3 py-1 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">University Capstone Project 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
            Multimodal Hate Speech Detection <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Voice & Text Analysis
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            An advanced machine learning prototype that detects toxic content in both <strong>written text</strong> and <strong>spoken audio</strong> using OLS feature optimization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200 transform hover:-translate-y-1"
            >
              Try Voice Demo
              <Mic className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => document.getElementById('applications')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 dark:border-slate-700 text-lg font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              See Use Cases
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6">
              <Mic className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Voice Detection</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyzes audio tone and transcribed content simultaneously to detect aggressive speech patterns that text-only models miss.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
              <Cpu className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">OLS Algorithm</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Orthogonal Least Squares mathematically selects the most impactful features, stripping away noise and reducing dimensionality by over 80%.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">High Accuracy</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              By removing irrelevant features, the model achieves higher precision and recall scores compared to standard TF-IDF implementations.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="w-full bg-slate-900 dark:bg-black py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Can This Be Used?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Automated hate speech detection is a critical component of modern digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <Globe className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Social Networks</h3>
              <p className="text-slate-400 text-sm">
                Automatically flag and hide toxic comments on platforms like X (Twitter), Facebook, or Reddit before they reach users.
              </p>
            </div>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <MessageSquare className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Gaming Chat</h3>
              <p className="text-slate-400 text-sm">
                Monitor in-game text voice channels to prevent harassment and create safer gaming environments for younger players.
              </p>
            </div>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <Server className="h-10 w-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">News Portals</h3>
              <p className="text-slate-400 text-sm">
                Reduce the workload of human moderators by pre-filtering comments on controversial news articles.
              </p>
            </div>
            <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
              <Lock className="h-10 w-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Brand Safety</h3>
              <p className="text-slate-400 text-sm">
                Protect brands by ensuring their ads do not appear next to hate speech or offensive content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation / How to Use Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 border border-indigo-100 dark:border-indigo-900">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 dark:text-indigo-300 mb-6">How It Is Deployed</h2>
            <p className="text-indigo-800 dark:text-indigo-200 text-lg mb-8 leading-relaxed">
              This project is designed as a modular <strong>REST API</strong>. In a real-world scenario, this model sits on a server and accepts text data from various client applications.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold">1</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Input Reception</h4>
                  <p className="text-indigo-700 dark:text-indigo-300/80 text-sm">User posts a comment or speaks. The app sends data to our Python/Node API.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold">2</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Real-time Inference</h4>
                  <p className="text-indigo-700 dark:text-indigo-300/80 text-sm">The pre-trained OLS model processes the input in milliseconds.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold">3</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Action Trigger</h4>
                  <p className="text-indigo-700 dark:text-indigo-300/80 text-sm">API returns "Hate Speech". The app automatically hides the content.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-indigo-100 dark:border-slate-800 p-8">
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-amber-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span className="text-xs text-slate-400 font-mono ml-2">api_endpoint.py</span>
            </div>
            <pre className="font-mono text-sm text-slate-600 dark:text-slate-300 overflow-x-auto">
{`@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data['text']
    audio = data.get('audio')
    
    if audio:
        # Process audio to features
        text = speech_to_text(audio)

    # 1. Preprocess
    clean_text = preprocess(text)
    
    # 2. Vectorize (TF-IDF) & OLS
    vector = ols_transform(clean_text)
    
    # 3. Predict
    prediction = model.predict(vector)
    
    return jsonify({
        "class": prediction[0],
        "confidence": 0.94
    })`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;