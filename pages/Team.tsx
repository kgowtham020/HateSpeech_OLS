import React from 'react';
import { User, Users, GraduationCap, MapPin, Award, Mail, Linkedin, Github } from 'lucide-react';

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
      <div className="relative bg-slate-900 dark:bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 dark:to-slate-950/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/20">
            <Users className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium tracking-wider uppercase text-blue-100">Batch No: 14</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Capstone Project <span className="text-blue-400">Review I</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto">
            Hate Speech Detection using Orthogonal Least Squares
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 w-full pb-20">
        
        {/* Faculty Guide Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden mb-16 transform transition-all hover:shadow-2xl">
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 px-8 py-4 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between">
            <h3 className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-sm flex items-center">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              Project Guidance
            </h3>
            <div className="h-2 w-20 bg-amber-400 rounded-full"></div>
          </div>
          
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
             <div className="flex-shrink-0">
               <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-600 shadow-lg relative">
                 <User className="h-16 w-16 text-slate-400 dark:text-slate-300" />
                 <div className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full border-4 border-white dark:border-slate-600">
                   <Award className="h-4 w-4 text-white" />
                 </div>
               </div>
             </div>
             
             <div className="flex-1 text-center md:text-left space-y-2">
               <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Assistant Professor</h4>
               <p className="text-slate-600 dark:text-slate-300 text-lg">Department of Artificial Intelligence & Data Science</p>
               <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <GraduationCap className="h-5 w-5 mr-2 text-slate-700 dark:text-slate-300" />
                    GITAM School of CSE
                  </div>
                  <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <MapPin className="h-5 w-5 mr-2 text-slate-700 dark:text-slate-300" />
                    Bengaluru, Karnataka
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">
            Meet the Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Card Header Gradient */}
                <div className={`h-24 bg-gradient-to-r ${member.gradient} relative`}>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                       <div className={`h-full w-full rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold`}>
                         {member.initials}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-12 pb-6 px-6 text-center">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{member.name}</h4>
                  <p className="text-xs font-mono text-slate-400 mb-4">{member.id}</p>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${member.accent}`}>
                    {member.role}
                  </span>

                  {/* Divider */}
                  <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-6"></div>

                  {/* Social Links (Mock) */}
                  <div className="flex justify-center space-x-4">
                     <button className="text-slate-400 hover:text-blue-600 transition-colors">
                       <Linkedin className="h-5 w-5" />
                     </button>
                     <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                       <Github className="h-5 w-5" />
                     </button>
                     <button className="text-slate-400 hover:text-red-500 transition-colors">
                       <Mail className="h-5 w-5" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Logo / Footer Section */}
        <div className="flex justify-center mt-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">GITAM</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest">GITAM University</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Department of Computer Science & Engineering</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Team;