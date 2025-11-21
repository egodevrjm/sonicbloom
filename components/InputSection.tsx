import React, { useState, useRef } from 'react';
import { Search, Upload, Music, Link as LinkIcon, Loader2 } from 'lucide-react';
import { InputMode } from '../types';

interface Props {
  onAnalyzeText: (text: string) => void;
  onAnalyzeFile: (file: File) => void;
  loading: boolean;
}

const InputSection: React.FC<Props> = ({ onAnalyzeText, onAnalyzeFile, loading }) => {
  const [mode, setMode] = useState<InputMode>(InputMode.TEXT);
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onAnalyzeText(query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyzeFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative background elements inside panel */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-50"></div>
      
      <div className="flex space-x-6 mb-8 justify-center">
        <button
          onClick={() => setMode(InputMode.TEXT)}
          className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${
            mode === InputMode.TEXT 
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search size={18} />
          <span>Search / Link</span>
        </button>
        <button
          onClick={() => setMode(InputMode.FILE)}
          className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 ${
            mode === InputMode.FILE 
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload size={18} />
          <span>Upload MP3</span>
        </button>
      </div>

      <div className="min-h-[120px] flex items-center justify-center">
        {loading ? (
          <div className="text-center">
             <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
             <p className="text-purple-200 animate-pulse tracking-widest uppercase text-xs">Synthesizing Profile...</p>
          </div>
        ) : mode === InputMode.TEXT ? (
          <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Music className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter song name, artist, or YouTube link..."
              className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white px-4 rounded-lg transition-all"
            >
              Analyze
            </button>
          </form>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all group"
          >
            <input 
              type="file" 
              accept="audio/mp3,audio/wav,audio/mpeg" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
            <Music className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
            <p className="text-gray-400 group-hover:text-white transition-colors">Click to select a song file</p>
            <p className="text-xs text-gray-600 mt-2">MP3, WAV up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;