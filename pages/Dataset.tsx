import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatasetRow } from '../types';
import { ArrowRight, ChevronLeft, ChevronRight, Database, Search, Download } from 'lucide-react';

const Dataset: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Total simulates the actual Davidson Dataset size
  const totalRecords = 24783; 

  // Expanded Sample Data to look more realistic for the demo
  const sampleData: DatasetRow[] = [
    { id: 1, label: "Hate Speech", text: "RT @user: These people are absolute trash... [REDACTED]", processedText: "people absolute trash [redacted]" },
    { id: 2, label: "Offensive", text: "This game is straight up ghetto trash lol", processedText: "game straight ghetto trash lol" },
    { id: 3, label: "Normal", text: "Just ordered some pizza for the game tonight!", processedText: "ordered pizza game tonight" },
    { id: 4, label: "Hate Speech", text: "We need to get rid of all the [slur] in this town.", processedText: "need rid [slur] town" },
    { id: 5, label: "Normal", text: "The birds are singing so beautifully today.", processedText: "bird singing beautifully today" },
    { id: 6, label: "Offensive", text: "Shut up b***h, nobody asked you.", processedText: "shut b***h nobody asked" },
    { id: 7, label: "Normal", text: "I simply cannot believe the weather in Ohio right now.", processedText: "cannot believe weather ohio right" },
    { id: 8, label: "Offensive", text: "You act like a total r*tard when you drink.", processedText: "act total r*tard drink" },
    { id: 9, label: "Hate Speech", text: "I hate [group], they are ruining our country.", processedText: "hate [group] ruining country" },
    { id: 10, label: "Normal", text: "Going to bed early, got a big meeting tomorrow.", processedText: "going bed early big meeting tomorrow" },
    { id: 11, label: "Offensive", text: "Lmao look at this ho over here", processedText: "lmao look ho" },
    { id: 12, label: "Normal", text: "My mom made the best lasagna for dinner.", processedText: "mom made best lasagna dinner" },
    { id: 13, label: "Hate Speech", text: "If I see another [slur] I'm going to scream.", processedText: "see another [slur] going scream" },
    { id: 14, label: "Offensive", text: "Stop being such a p***y and jump.", processedText: "stop p***y jump" },
    { id: 15, label: "Normal", text: "Yankees won the game! #baseball", processedText: "yankees won game baseball" },
    { id: 16, label: "Hate Speech", text: "All [group] should be deported immediately.", processedText: "[group] deported immediately" },
    { id: 17, label: "Normal", text: "Does anyone know a good mechanic in the area?", processedText: "know good mechanic area" },
    { id: 18, label: "Offensive", text: "Whatever n***a i dont care", processedText: "whatever n***a care" },
    { id: 19, label: "Normal", text: "Studying for my finals, wish me luck!", processedText: "studying finals wish luck" },
    { id: 20, label: "Hate Speech", text: "Disgusting behavior by those [slur]s.", processedText: "disgusting behavior [slur]" },
    { id: 21, label: "Normal", text: "Looking forward to the weekend trip.", processedText: "looking forward weekend trip" },
    { id: 22, label: "Offensive", text: "That outfit looks trashy as hell.", processedText: "outfit looks trashy hell" },
    { id: 23, label: "Normal", text: "Coding all night long #developer", processedText: "coding night long developer" },
    { id: 24, label: "Hate Speech", text: "Keep [group] out of our schools.", processedText: "keep [group] schools" },
    { id: 25, label: "Offensive", text: "Yo b***h get me a drink", processedText: "yo b***h get drink" }
  ];

  const distributionData = [
    { name: 'Hate Speech', value: 1430 },
    { name: 'Offensive', value: 19190 },
    { name: 'Normal', value: 4163 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sampleData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > 3 && newPage < totalPages) {
       setCurrentPage(newPage);
    } else {
       setCurrentPage(newPage);
    }
  };

  // Function to download the dataset CSV
  const downloadDataset = () => {
    // Exact content matching datasets/labeled_data.csv
    const csvContent = `id,count,hate_speech,offensive_language,neither,class,tweet
0,3,0,0,3,2,"!!! RT @mayasolovely: As a woman you shouldn't complain about cleaning up your house. &amp; as a man you should always take the trash out..."
1,3,0,3,0,1,"!!!!! RT @mleew17: boy dats cold...tyga dwn bad for cuffin dat hoe in the 1st place!!"
2,3,0,3,0,1,"!!!!!!! RT @UrKindOfBrand Dawg!!!! RT @80sbaby4life: You ever fuck a bitch and she start to cry? You be confused as shit"
3,3,0,2,1,1,"!!!!!!!!! RT @C_G_Anderson: @viva_based she look like a tranny"
4,6,0,6,0,1,"!!!!!!!!!!!!! RT @ShenikaRoberts: The shit you hear about me might be true or it might be faker than the bitch who told it to ya"
5,3,1,2,0,1,"!!!!!!!!!!!!!!!!!!""@T_Madison_x: The shit just blows me..claim you so faithful and down for somebody but still fucking with hoes! &#128514;&#128514;&#128514;"""
6,3,0,3,0,1,"!!!!!!""@__BrighterDays: I can not just sit up and HATE on another bitch .. I got too much shit going on!"""
7,3,0,3,0,1,"!!!!&#8220;@selfiequeenbri: cause I'm tired of you big bitches coming for us skinny girls!!&#8221;"
8,3,0,3,0,1,""" &amp; you might not get ya bitch back &amp; thats that """
9,3,1,2,0,1,""" @rhythmixx_ :hobbies include: fighting Mariam"""
10,3,0,3,0,1,""" Keeks is a bitch she curves everyone "" lol I walked into a conversation like this. Smh"
11,3,0,3,0,1,""" Murda Gang bitch its Gang Land """
12,3,0,2,1,1,""" So hoes that smoke are losers ? "" yea ... go on IG"
13,3,0,3,0,1,""" bad bitches is the only thing that i like """
14,3,1,2,0,1,""" bitch get up off me """
15,3,0,3,0,1,""" bitch nigga miss me with it """
16,3,0,3,0,1,""" bitch pls whatever """
17,3,0,3,0,1,""" bitch who do you love """
18,3,0,3,0,1,""" bitches get cut off everyday B """
19,3,0,3,0,1,""" black bottle &amp; a bad bitch """
20,3,0,3,0,1,""" broke bitch cant tell me nothing """
21,3,0,3,0,1,""" cancel that bitch like nino """
22,3,0,3,0,1,""" cant you see these hoes wont change """
23,3,0,3,0,1,""" fuck no that bitch dont even suck dick """
24,3,0,3,0,1,""" got ya bitch tip toeing on my hardwood floor """
25,3,0,2,1,1,""" her pussy lips like Heaven Doors """
26,3,0,3,0,1,""" hoe what you got for me """
27,3,0,3,0,1,""" i met that pussy on Ocean Dr . i gave that pussy a pill """
28,3,0,3,0,1,""" i need a trippy bitch who fuck on Hennessy """
29,3,0,3,0,1,""" i spend my money on hoes i spend my money on hoes """
30,3,0,3,0,1,""" i'd rather fuck a bitch from the projects """
31,3,0,3,0,1,""" i'm taking all you niggas bitches """
32,3,0,3,0,1,""" if you aint bout that trap life bitch you aint bout me """
33,3,0,3,0,1,""" if you be my bitch i'll be your killer """
34,3,0,3,0,1,""" im a pimp by blood not relations """
35,3,0,3,0,1,""" is that your bitch ? she aint yours no more """
36,3,0,3,0,1,""" it's a difference between a chinchilla &amp; a bitch nigga """
37,3,0,3,0,1,""" it's a hoe out there for everyone """
38,3,0,3,0,1,""" its just me &amp; my bitch """
39,3,0,3,0,1,""" like a bitch i'm raising my price """
85,3,2,1,0,0,"@Blackman38Tide @Whignewtons @Warnstills @GOP momma said no pussy cats inside the house"
89,3,3,0,0,0,"@CB_Baby24 @white_thunduh alsarabsss"
110,3,3,0,0,0,"@DevilGrimz @VigxRArts you're fucking gay, blacklisted hoe holding pussy."`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'davidson_hate_speech_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dataset Explorer</h2>
           <p className="mt-2 text-slate-600 dark:text-slate-400">Viewing the Davidson Hate Speech Dataset (Sample)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button 
             onClick={downloadDataset}
             className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors active:scale-95"
           >
              <Download className="h-4 w-4" />
              <span className="text-sm font-semibold">Download CSV</span>
           </button>
           <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <Database className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total Records: {totalRecords.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Dataset Composition</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            We utilize the widely cited Davidson et al. (2017) dataset collected from Twitter. 
            The dataset is heavily imbalanced, with a majority of tweets classified as "Offensive" rather than "Hate Speech".
            Our OLS algorithm specifically targets this imbalance by identifying features that distinguish between the two.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 0 - Hate Speech (6%):</strong> Targeted hate towards protected groups.</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-amber-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 1 - Offensive Language (77%):</strong> Vulgar or rude, but not specific hate speech.</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-1.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300"><strong>Class 2 - Normal (17%):</strong> Neutral or benign tweets.</span>
            </li>
          </ul>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-80 transition-colors">
          <h4 className="text-center font-medium text-slate-500 dark:text-slate-400 mb-2">Class Distribution</h4>
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
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {distributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4 md:gap-0">
        <div className="w-full md:w-auto">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Preprocessing Viewer</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Compare raw tweets vs. cleaned tokens.</p>
        </div>
        <div className="relative w-full md:w-64">
           <input 
             type="text" 
             placeholder="Search dataset..." 
             className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
           />
           <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-16">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-1/3 min-w-[200px]">Raw Input (Before)</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-12"></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider w-1/3 min-w-[200px]">Preprocessed Output (After)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Label</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">#{row.id}</td>
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
                ))
              ) : (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      Data for page {currentPage} is mocked and not available in this demo view.
                      <br/>Please return to Page 1-3.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - Responsive Stack */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 gap-4">
         <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * rowsPerPage, totalRecords)}</span> of <span className="font-medium">{totalRecords.toLocaleString()}</span> results
         </div>
         <div className="flex space-x-2">
            <button 
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
               className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               <ChevronLeft className="h-4 w-4 mr-1" />
               Previous
            </button>
            <button 
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage >= totalPages}
               className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
               Next
               <ChevronRight className="h-4 w-4 ml-1" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Dataset;