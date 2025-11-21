import React from 'react';
import { SongProfile } from '../types';
import AttributeChart from './RadarChart';
import { Share2, Download, Disc, Sparkles } from 'lucide-react';

interface Props {
  profile: SongProfile;
  imageUrl?: string;
}

const ResultsView: React.FC<Props> = ({ profile, imageUrl }) => {
  // Determine text color based on brightness of background isn't feasible dynamically without canvas analysis,
  // so we stick to white text on dark glass.

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Left Column: Visuals */}
      <div className="space-y-6">
        {/* Album Art Card */}
        <div className="glass-panel p-2 rounded-3xl shadow-2xl overflow-hidden relative group">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/40 relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="AI Generated visualization of the song" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
              </div>
            )}
            
            {/* Overlay Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-bold tracking-wider text-white">GEMINI GENERATED</span>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="text-xs uppercase tracking-widest text-gray-400">Sonic Palette</h3>
          <div className="flex h-16 w-full rounded-xl overflow-hidden">
            {profile.colors.map((color, i) => (
              <div 
                key={i} 
                className="flex-1 transition-all hover:flex-[2] group relative"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <span className="text-xs font-mono font-bold text-white drop-shadow-md">{color}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Data & Vibes */}
      <div className="space-y-6">
        
        {/* Header Info */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: profile.colors[0] }}></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{profile.songTitle}</h1>
          <h2 className="text-xl text-gray-300 flex items-center gap-2">
            <Disc size={20} className="text-white/50" />
            {profile.artist}
          </h2>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-white font-medium">
              {profile.mood}
            </span>
            {profile.vibes.map((vibe, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-black/20 border border-white/5 text-sm text-gray-300">
                #{vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center">
               <h3 className="text-xs uppercase tracking-widest text-gray-400 w-full mb-4">Audio Fingerprint</h3>
               <AttributeChart data={profile.attributes} colors={profile.colors} />
            </div>

            {/* Poetic Desc */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-9xl text-white/5 font-serif">"</div>
                <p className="text-lg text-gray-200 leading-relaxed font-light italic relative z-10">
                  {profile.poeticDescription}
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                    <Download size={18} />
                  </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsView;