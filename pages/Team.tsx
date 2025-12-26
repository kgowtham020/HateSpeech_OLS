import React from 'react';
import { User, Users, GraduationCap, MapPin, Award, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Kaditham Gowtham",
      id: "BU22CSEN0400136",
      role: "Team Leader",
      initials: "KG",
      gradient: "from-blue-500 to-indigo-600",
      accent: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    },
    {
      name: "Srishanth",
      id: "BU22CSEN0400071",
      role: "Member",
      initials: "S",
      gradient: "from-violet-500 to-purple-600",
      accent: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
    },
    {
      name: "Gayathri Y N",
      id: "BU22CSEN0400217",
      role: "Member",
      initials: "GY",
      gradient: "from-fuchsia-500 to-pink-600",
      accent: "bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
    },
    {
      name: "Mukesh Reddy",
      id: "BU22CSEN0400175",
      role: "Member",
      initials: "MR",
      gradient: "from-cyan-500 to-teal-600",
      accent: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="relative bg-slate-900 dark:bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10">
            <Users className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium tracking-wider uppercase text-blue-100">CS Batch 14</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Capstone Project <span className="text-blue-400">Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto">
            Hate Speech Detection using Orthogonal Least Squares
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 w-full pb-20">
        
        {/* Faculty Guide Section - Premium Card Design */}
        <div className="relative mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="grid md:grid-cols-12 gap-0">
               {/* Left accent panel */}
               <div className="hidden md:block md:col-span-1 bg-amber-500 flex flex-col items-center justify-center text-white py-4">
                  <span className="vertical-text transform -rotate-90 tracking-[0.2em] font-bold text-xs whitespace-nowrap opacity-80 uppercase">Project Guide</span>
               </div>
               
               {/* Content */}
               <div className="md:col-span-11 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-shrink-0 relative">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border-[6px] border-white dark:border-slate-800 shadow-xl relative z-10">
                      <User className="h-16 w-16 md:h-20 md:w-20 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-amber-500 text-white p-3 rounded-full border-4 border-white dark:border-slate-800 z-20 shadow-sm">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                      Faculty Supervisor
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dr. Kothuru Srinivasulu</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-6">Department of Artificial Intelligence & Data Science</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <GraduationCap className="h-4 w-4 mr-2 text-slate-400" />
                        GITAM School of Technology
                      </div>
                      <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        Bengaluru
                      </div>
                      <button className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
             <div className="h-8 w-1 bg-blue-600 rounded-full mr-4"></div>
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
               Student Developers
             </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Minimal Header */}
                <div className={`h-2 w-full bg-gradient-to-r ${member.gradient}`}></div>

                <div className="p-8 flex flex-col items-center">
                  <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {member.initials}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white text-center">{member.name}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1 mb-4">{member.id}</p>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${member.accent} mb-6`}>
                    {member.role}
                  </span>

                  <div className="flex space-x-4 w-full justify-center pt-6 border-t border-slate-100 dark:border-slate-800">
                     <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                       <Linkedin className="h-5 w-5" />
                     </a>
                     <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                       <Github className="h-5 w-5" />
                     </a>
                     <a href="#" className="text-slate-400 hover:text-red-500 transition-colors">
                       <Mail className="h-5 w-5" />
                     </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Footer Section */}
        <div className="flex justify-center mt-20">
           <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity duration-500">
              <div className="h-14 w-14 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-white dark:text-slate-900 font-bold text-xs tracking-tighter">GITAM</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest text-center">GITAM (Deemed to be University)<br/>Bengaluru Campus</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Department of Artificial Intelligence & Data Science</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Team;