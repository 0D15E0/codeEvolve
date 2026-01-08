"use client";

import React, { useState } from 'react';
import { LayoutGrid, ChevronRight, Code2 } from 'lucide-react';
// Make sure these imports point to where you saved your files
import { SCENARIOS } from '@/data/scenarios'; 
import Simulator from '@/components/Simulator'; 

export default function Page() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId);

  // 1. If a scenario is selected, show the Simulator (PASSING THE PROP)
  if (activeScenario) {
    return <Simulator scenario={activeScenario} onBack={() => setActiveScenarioId(null)} />;
  }

  // 2. Otherwise, show the Dashboard Cards
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-8 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10 border-b border-gray-800 pb-8">
            <div className="p-3 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/40">
                <LayoutGrid size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    CodeEvolve
                </h1>
                <p className="text-gray-400 mt-1">Master Industry-Standard Progressive Coding Assessments</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIOS.map(scenario => (
                <div 
                    key={scenario.id} 
                    onClick={() => setActiveScenarioId(scenario.id)}
                    className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 cursor-pointer relative overflow-hidden"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                            {scenario.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">{scenario.title}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                {scenario.difficulty}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 h-12 overflow-hidden">
                        {scenario.summary}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                        <span className="text-xs text-gray-500">{scenario.levels.length} Levels</span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                            Start <ChevronRight size={14} />
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}