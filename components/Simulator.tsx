"use client";

import React, { useState, useEffect } from 'react';
import Editor, { OnChange } from '@monaco-editor/react';
import { Play, ChevronRight, Terminal, Loader2, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Scenario, Status } from '@/types';

interface SimulatorProps {
  scenario: Scenario;
  onBack: () => void;
}

// Declare Pyodide on window to avoid TS errors
declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

// --- HELPER: FORMAT TIME (MM:SS) ---
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function Simulator({ scenario, onBack }: SimulatorProps) {
  // --- STATE ---
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // 1. CODE STATE (Auto-load from localStorage)
  const [userCode, setUserCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`codeevolve-${scenario.id}-code`);
      if (saved) return saved;
    }
    return scenario.levels[0].starterCode;
  });

  // 2. TIMER STATE (70 Minutes standard)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem(`codeevolve-${scenario.id}-timer`);
      if (savedTime) return parseInt(savedTime, 10);
    }
    return 70 * 60; // 70 minutes in seconds
  });

  const [output, setOutput] = useState("Initializing Python environment...");
  const [status, setStatus] = useState<Status>("idle");
  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  const activeLevel = scenario.levels[currentLevelIdx];

  // --- EFFECT: COUNTDOWN TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = prev > 0 ? prev - 1 : 0;
        localStorage.setItem(`codeevolve-${scenario.id}-timer`, newVal.toString());
        return newVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [scenario.id]);

  // --- EFFECT: LOAD PYODIDE (v0.26.1 FIX) ---
  useEffect(() => {
    const loadPyodideEngine = async () => {
      // Prevent double loading
      if (window.pyodide) {
        setPyodide(window.pyodide);
        setIsPyodideLoading(false);
        setOutput("Ready to run tests.");
        return;
      }

      // Check if script exists
      if (!document.getElementById('pyodide-script')) {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        // USE VERSION 0.26.1 to fix the "G.default.parse" error
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        script.async = true;
        
        script.onload = async () => {
          try {
            // Explicitly set indexURL to find the .wasm files
            const py = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
            });
            window.pyodide = py; 
            setPyodide(py);
            setIsPyodideLoading(false);
            setOutput("Ready to run tests.");
          } catch (err) {
            console.error("Failed to load Pyodide:", err);
            setOutput("Error loading Python engine. Please refresh.");
          }
        };
        document.body.appendChild(script);
      }
    };

    loadPyodideEngine();
  }, []);

  // --- EFFECT: AUTO-SAVE CODE ---
  useEffect(() => {
    const key = `codeevolve-${scenario.id}-code`;
    localStorage.setItem(key, userCode);
  }, [userCode, scenario.id]);


  // --- ACTION: RUN CODE ---
  const runCode = async () => {
    if (!pyodide) return;
    
    setStatus("running");
    setOutput("Running tests...");

    // 1. Prepare Source
    const fullSource = `${userCode}\n\n${activeLevel.testCode}`;
    
    // 2. Capture Stdout
    const stdoutBuffer: string[] = [];
    pyodide.setStdout({
      batched: (msg: string) => stdoutBuffer.push(msg)
    });

    try {
      // 3. Execute
      await pyodide.runPythonAsync(fullSource);
      
      const combinedOutput = stdoutBuffer.join("\n");

      // 4. Validate
      if (combinedOutput.includes("ALL_TESTS_PASSED")) {
        setStatus("success");
        setOutput(`✅ Tests Passed!\n\n${combinedOutput}`);
      } else {
        setStatus("error");
        setOutput(`❌ Tests Failed.\n\n${combinedOutput}`);
      }
    } catch (err: any) {
      setStatus("error");
      const cleanError = err.toString().replace("PythonError: ", "");
      setOutput(`RUNTIME ERROR:\n${cleanError}`);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < scenario.levels.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      setStatus("idle");
      setOutput("Level up! New requirements loaded.");
    }
  };

  const handleEditorChange: OnChange = (value) => {
    setUserCode(value || "");
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will reset your code to the starter template.")) {
      setUserCode(scenario.levels[0].starterCode);
      setStatus("idle");
      setOutput("Code reset.");
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden animate-in fade-in duration-300">
      
      {/* LEFT PANEL: Description */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center gap-3 shadow-sm">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors group"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white leading-tight">{scenario.title}</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">
                    Level {currentLevelIdx + 1}/{scenario.levels.length}
                </span>
            </div>
          </div>
          
          {/* TIMER */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-sm border ${
             timeLeft < 300 ? "bg-red-900/20 border-red-500/50 text-red-400 animate-pulse" : "bg-gray-900 border-gray-600 text-gray-300"
          }`}>
             <Clock size={14} />
             {formatTime(timeLeft)}
          </div>
        </div>

        {/* Instructions Area */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold mb-4 text-white">{activeLevel.title}</h2>
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-lg font-bold my-3 text-white">{children}</h1>,
              h2: ({children}) => <h2 className="text-base font-bold mt-4 mb-2 text-white border-b border-gray-700 pb-1">{children}</h2>,
              p: ({children}) => <p className="mb-4 text-gray-300 leading-relaxed text-sm">{children}</p>,
              ul: ({children}) => <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-1">{children}</ul>,
              li: ({children}) => <li className="text-sm text-gray-300">{children}</li>,
              strong: ({children}) => <strong className="text-blue-300 font-semibold">{children}</strong>,
              code: ({node, inline, className, children, ...props}: any) => {
                return !inline ? (
                  <div className="bg-black/40 rounded-md p-3 my-3 border border-gray-700 font-mono text-xs overflow-x-auto shadow-inner">
                    <code className="text-green-300" {...props}>{children}</code>
                  </div>
                ) : (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-200 font-mono text-xs border border-gray-700" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {activeLevel.description}
          </ReactMarkdown>
        </div>

        {/* Next Level Action */}
        {status === "success" && (
          <div className="p-4 bg-green-900/10 border-t border-green-800/30 backdrop-blur-sm">
             {currentLevelIdx < scenario.levels.length - 1 ? (
                <button 
                  onClick={nextLevel}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 px-4 rounded-md transition-all font-semibold shadow-lg shadow-green-900/20 hover:scale-[1.02]"
                >
                  Next Level <ChevronRight size={18} />
                </button>
             ) : (
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-center">
                    <div className="text-green-400 font-bold flex items-center justify-center gap-2">
                         🎉 Assessment Complete!
                    </div>
                </div>
             )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Editor */}
      <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
        
        {/* Editor Toolbar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-3 py-1.5 rounded-full">
                 <Terminal size={14} />
                 <span>solution.py</span>
             </div>
             {isPyodideLoading && (
                 <span className="flex items-center gap-2 text-xs text-yellow-500 animate-pulse">
                     <Loader2 size={12} className="animate-spin"/> Engine Loading...
                 </span>
             )}
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={handleReset}
                className="text-gray-500 hover:text-white p-2 rounded-md transition-colors"
                title="Reset Code"
            >
                <RefreshCw size={16} />
            </button>
            <button 
                onClick={runCode}
                disabled={status === "running" || isPyodideLoading}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                status === "running" || isPyodideLoading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:scale-105"
                }`}
            >
                {status === "running" ? <><Loader2 className="animate-spin" size={16}/> Running</> : <><Play size={16} /> Run Code</>}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={userCode}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              lineNumbers: "on",
            }}
          />
        </div>

        {/* Console Output */}
        <div className="h-[35%] min-h-[150px] bg-black border-t border-gray-700 flex flex-col shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={12} /> Console Output
            </span>
            <div className="flex items-center gap-3">
                {status === "success" && <span className="text-xs font-bold text-green-500 bg-green-900/20 px-2 py-0.5 rounded border border-green-900">PASSED</span>}
                {status === "error" && <span className="text-xs font-bold text-red-500 bg-red-900/20 px-2 py-0.5 rounded border border-red-900">FAILED</span>}
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm custom-scrollbar">
            <pre className={`whitespace-pre-wrap ${
              status === "error" ? "text-red-300" : 
              status === "success" ? "text-green-300" : "text-gray-400"
            }`}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}