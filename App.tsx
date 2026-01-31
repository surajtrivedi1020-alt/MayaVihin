
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnalysisRecord, SystemLog, MediaType, Verdict } from './types';
import { COLORS, LOGOS } from './constants';
import { EyeBackground } from './components/EyeBackground';
import { AnalysisResults } from './components/AnalysisResults';
import { performDeepfakeAnalysis } from './geminiService';

// --- Local Storage Helpers ---
const STORAGE_KEY_HISTORY = 'mayavihin_history';
const STORAGE_KEY_LOGS = 'mayavihin_logs';

const loadHistory = (): AnalysisRecord[] => {
  const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
  return saved ? JSON.parse(saved) : [];
};

const loadLogs = (): SystemLog[] => {
  const saved = localStorage.getItem(STORAGE_KEY_LOGS);
  return saved ? JSON.parse(saved) : [];
};

// --- Components ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-indigo-950/80 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <LOGOS.Mayavihin />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
            { name: 'About', path: '/about' },
            { name: 'History', path: '/history' },
            { name: 'System Logs', path: '/logs' }
          ].map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                location.pathname === link.path ? 'text-cyan-400' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <LOGOS.CodeBlooded />
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/10 bg-black/40 relative z-10">
    <div className="container mx-auto px-6 text-center">
      <div className="text-gold font-orbitron font-black text-2xl tracking-[0.3em] mb-4" style={{ color: COLORS.gold }}>
        CODEX LETHALIS
      </div>
      <p className="text-white/40 text-sm font-medium">
        Developed by <span className="text-red-500 font-bold">CODE BLOODED</span> | Built with <span className="text-red-500">❤️</span>
      </p>
      <div className="mt-8 flex justify-center gap-6">
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Home = ({ onUploadStart }: { onUploadStart: () => void }) => {
  const [rotatedText, setRotatedText] = useState('Detect');
  const words = ['Detect', 'Verify', 'Explain', 'Protect'];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % words.length;
      setRotatedText(words[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center z-10">
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
          Version 23.0 Stable
        </div>
        
        <h1 className="text-6xl md:text-8xl font-orbitron font-black text-white mb-6 leading-tight">
          {rotatedText}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500">
            Deepfake Media
          </span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Advanced multi-agent verification system for digital media authenticity. 
          Analyze patterns that the human eye misses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onUploadStart}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full font-orbitron font-black text-white text-lg hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20 border border-white/10"
          >
            UPLOAD MEDIA
          </button>
          <Link 
            to="/history"
            className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md rounded-full font-orbitron font-black text-white text-lg hover:bg-white/10 transition-colors border border-white/10"
          >
            VIEW HISTORY
          </Link>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const agents = [
    { name: 'Visual Forensics', desc: 'Analyzes frame-by-frame for facial manipulation, warping, and light mismatches.', icon: '👁️' },
    { name: 'Audio Analysis', desc: 'Detects synthetic voice patterns, cloning artifacts, and unnatural frequency shifts.', icon: '🎙️' },
    { name: 'Metadata Agent', desc: 'Examines file headers, EXIF data, and compression signatures for signs of editing.', icon: '📁' },
    { name: 'Consistency Agent', desc: 'Checks cross-modality synchronization and logical content flow across timelines.', icon: '🔄' },
    { name: 'Explainability Agent', desc: 'Synthesizes complex AI analysis into human-readable summaries and verdicts.', icon: '📝' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
      <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-16 text-center">AI Analysis Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map(agent => (
          <div key={agent.name} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group">
            <div className="text-4xl mb-6">{agent.icon}</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
            <p className="text-white/60 leading-relaxed">{agent.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const About = () => (
  <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-4xl">
    <div className="text-center mb-16">
      <div className="inline-block p-4 bg-white/5 rounded-2xl mb-8">
        <LOGOS.Mayavihin className="h-12" />
      </div>
      <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-6">About MAYAVIHIN</h2>
      <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">Digital Illusion Shatterer</p>
    </div>
    
    <div className="space-y-8 text-white/70 text-lg leading-relaxed">
      <p>
        MAYAVIHIN (Sanskrit for "Free from Illusion") is a cutting-edge forensic suite designed to combat the rising tide of sophisticated deepfakes. 
        In an era where generative AI can mimic reality with terrifying precision, we provide the tools to verify the truth.
      </p>
      <div className="p-8 bg-indigo-950/40 rounded-3xl border border-white/10">
        <h3 className="text-white font-orbitron font-bold text-xl mb-4">The Multi-Agent Architecture</h3>
        <p>
          Unlike simple models that look for specific artifacts, MAYAVIHIN uses five distinct specialized AI agents. 
          By cross-referencing visual metadata with audio fingerprints and physical consistency, 
          the system provides a confidence score backed by explainable reasoning.
        </p>
      </div>
      <p>
        Developed by <span className="text-red-500 font-bold">CODE BLOODED</span>, this system leverages Gemini's latest multimodal capabilities 
        to ensure that verification is fast, accessible, and accurate.
      </p>
    </div>
  </div>
);

const History = ({ history, onDelete }: { history: AnalysisRecord[], onDelete: (id: string) => void }) => {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    return history.filter(r => 
      r.fileName.toLowerCase().includes(filter.toLowerCase()) || 
      r.verdict.toLowerCase().includes(filter.toLowerCase())
    ).sort((a, b) => b.timestamp - a.timestamp);
  }, [history, filter]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white">Analysis History</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search files..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-40 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="text-6xl mb-4 opacity-20">📂</div>
          <p className="text-white/40 font-bold uppercase tracking-widest">No matching records found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(record => (
            <div key={record.id} className="bg-indigo-950/40 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group relative">
              <div className="h-40 bg-black/40 relative overflow-hidden">
                {record.thumbnail ? (
                  <img src={record.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Analysis target" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl">
                     {record.fileType === 'video' ? '🎬' : record.fileType === 'audio' ? '🎵' : '📄'}
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ${
                  record.verdict === 'Real' ? 'bg-emerald-500 text-white' : record.verdict === 'Fake' ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                }`}>
                  {record.verdict}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold truncate mb-1">{record.fileName}</h3>
                <div className="text-white/40 text-xs mb-4">
                  {new Date(record.timestamp).toLocaleDateString()} • {(record.fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-cyan-400 font-orbitron font-bold text-sm">
                    {record.overallConfidence}% Match
                  </div>
                  <button 
                    onClick={() => onDelete(record.id)}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SystemLogsPage = ({ logs }: { logs: SystemLog[] }) => {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    return logs.filter(l => 
      l.actionType.toLowerCase().includes(filter.toLowerCase()) || 
      l.message.toLowerCase().includes(filter.toLowerCase())
    ).sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, filter]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white">System Activity Logs</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-[0.2em]">Action</th>
                <th className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-[0.2em]">File</th>
                <th className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-xs font-black text-white/40 uppercase tracking-[0.2em]">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-white/60 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      log.actionType === 'Error' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/90 truncate max-w-[150px]">
                    {log.fileName || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      log.status === 'Success' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {log.message}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-white/20 font-bold uppercase tracking-widest">
                    No logs recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ isOpen, onClose, onAnalysisComplete, addLog }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAnalysisComplete: (record: AnalysisRecord) => void;
  addLog: (action: SystemLog['actionType'], status: SystemLog['status'], msg: string, file?: string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError(null);
    }
  };

  const runAnalysis = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setProgress(10);
    setError(null);
    
    addLog('Upload', 'Success', `Started upload of ${file.name}`, file.name);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      setProgress(40);
      
      const mediaType: MediaType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio';
      
      addLog('Analysis', 'Success', `Initializing multi-agent analysis for ${file.name}`, file.name);
      
      // Simulate step-wise progress for UX
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 800);

      const record = await performDeepfakeAnalysis(file, mediaType, base64Data);
      
      clearInterval(timer);
      setProgress(100);
      
      setTimeout(() => {
        onAnalysisComplete(record);
        addLog('Analysis', 'Success', `Completed analysis for ${file.name}. Verdict: ${record.verdict}`, file.name);
        setIsAnalyzing(false);
        setFile(null);
        setProgress(0);
        onClose();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      addLog('Error', 'Error', `Analysis failed: ${err.message}`, file.name);
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-black/80 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-10">
          <h2 className="text-3xl font-orbitron font-black text-white mb-8">SECURE UPLOAD</h2>
          
          {!isAnalyzing ? (
            <div className="space-y-8">
              <div 
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                  file ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/40 hover:bg-white/5'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input 
                  id="file-input" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*"
                />
                
                <div className="text-6xl mb-6">{file ? (file.type.startsWith('image') ? '🖼️' : '🎬') : '📁'}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {file ? file.name : 'Drop your file here or click to browse'}
                </h3>
                <p className="text-white/40 text-sm">Supports MP4, MOV, JPG, PNG, MP3, WAV (Max 50MB)</p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button 
                disabled={!file}
                onClick={runAnalysis}
                className={`w-full py-5 rounded-2xl font-orbitron font-black text-white text-lg transition-all ${
                  file 
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:scale-[1.02] shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                START ANALYSIS
              </button>
            </div>
          ) : (
            <div className="py-12 text-center space-y-12">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin" />
                   <span className="text-2xl font-orbitron font-black text-white">{progress}%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-orbitron font-bold text-white animate-pulse">Running Multi-Agent Scans...</h3>
                <div className="max-w-xs mx-auto space-y-2">
                  <div className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-500 ${progress > 20 ? 'text-cyan-400' : 'text-white/20'}`}>• Visual Forensics Active</div>
                  <div className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-500 ${progress > 40 ? 'text-cyan-400' : 'text-white/20'}`}>• Audio Signature Matcher</div>
                  <div className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-500 ${progress > 60 ? 'text-cyan-400' : 'text-white/20'}`}>• Metadata Verification</div>
                  <div className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-500 ${progress > 80 ? 'text-cyan-400' : 'text-white/20'}`}>• Explainability Sync</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const AppContent = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>(loadHistory());
  const [logs, setLogs] = useState<SystemLog[]>(loadLogs());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisRecord | null>(null);
  
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((actionType: SystemLog['actionType'], status: SystemLog['status'], message: string, fileName?: string) => {
    const newLog: SystemLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      actionType,
      status,
      message,
      fileName
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  const handleAnalysisComplete = (record: AnalysisRecord) => {
    setHistory(prev => [record, ...prev]);
    setActiveAnalysis(record);
  };

  const handleDeleteHistory = (id: string) => {
    const record = history.find(r => r.id === id);
    setHistory(prev => prev.filter(r => r.id !== id));
    addLog('Delete', 'Success', `Deleted analysis record ${id}`, record?.fileName);
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d15] selection:bg-cyan-500/30">
      <EyeBackground isActive={isUploadOpen || !!activeAnalysis} />
      <Header />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={
            activeAnalysis ? (
              <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
                <AnalysisResults record={activeAnalysis} onClose={() => setActiveAnalysis(null)} />
              </div>
            ) : (
              <Home onUploadStart={() => setIsUploadOpen(true)} />
            )
          } />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History history={history} onDelete={handleDeleteHistory} />} />
          <Route path="/logs" element={<SystemLogsPage logs={logs} />} />
        </Routes>
      </main>

      <Footer />

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onAnalysisComplete={handleAnalysisComplete}
        addLog={addLog}
      />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
