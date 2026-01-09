"use client";

import React, { useState } from 'react';
import { LayoutGrid, ChevronRight, Code2, AlertCircle, Mail } from 'lucide-react';
import { SCENARIOS } from '@/data/scenarios';
import Simulator from '@/components/Simulator';
import { Scenario } from '@/types';

// --- COMPONENT: DASHBOARD CARD ---
const AssessmentCard = ({ scenario, onClick }: { scenario: Scenario; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
  >
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        {scenario.icon}
    </div>
    
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 group-hover:border-blue-500/30 transition-colors text-blue-400">
        {scenario.icon}
      </div>
      
      {/* LANGUAGE BADGE */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Language</span>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border 'bg-blue-900/20 text-blue-400 border-blue-700/30'
        }`}>
            <Code2 size={12} />
            {/* FIX: Defaults to Python if language is missing or 'python' */}
            {'Python'}
        </span>
      </div>
    </div>

    <div>
        <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors mb-1">
            {scenario.title}
        </h3>
        
        {/* Difficulty Badge */}
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-3 border ${
            scenario.difficulty === 'Easy' ? 'bg-green-900/20 text-green-400 border-green-900/30' :
            scenario.difficulty === 'Medium' ? 'bg-orange-900/20 text-orange-400 border-orange-900/30' :
            'bg-red-900/20 text-red-400 border-red-900/30'
        }`}>
            {scenario.difficulty}
        </span>
    </div>
    
    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
        {scenario.summary}
    </p>

    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800 group-hover:border-gray-700 transition-colors">
        <span className="text-xs text-gray-500 font-mono">{scenario.levels.length} Levels</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform">
            Start Challenge <ChevronRight size={14} />
        </span>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function Page() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId);

  // VIEW: Simulator (If a card is clicked)
  if (activeScenario) {
    return <Simulator scenario={activeScenario} onBack={() => setActiveScenarioId(null)} />;
  }

  // VIEW: Dashboard (Default)
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-12 animate-in fade-in duration-500 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-gray-800 pb-10">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl shadow-blue-900/20">
                <LayoutGrid size={40} className="text-white" />
            </div>
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                    CodeEvolve
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    Master the "Progressive System Design" interview format used by top tech companies. 
                    <span className="hidden md:inline"> Build solutions that evolve as requirements change.</span>
                </p>
                
                {/* GLOBAL NOTICE */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-900/50 w-fit px-3 py-1.5 rounded-full border border-gray-800">
                    <AlertCircle size={14} className="text-yellow-500" />
                    <span>Currently supporting <strong>Python (Pyodide)</strong> execution engine.</span>
                </div>
            </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIOS.map(scenario => (
                <AssessmentCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onClick={() => setActiveScenarioId(scenario.id)} 
                />
            ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto w-full mt-20 border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <a 
          href="mailto:ulimerlan@gmail.com" 
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <Mail size={16} />
          <span>ulimerlan@gmail.com</span>
        </a>
      </footer>
    </div>
  );
}