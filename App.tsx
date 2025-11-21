import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import ResultsView from './components/ResultsView';
import { AnalysisState, SongProfile } from './types';
import { analyzeSongText, analyzeAudioFile, generateAlbumArt } from './services/geminiService';
import { Sparkles, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  // Background gradient state based on analysis
  const [bgGradient, setBgGradient] = useState('from-slate-900 to-black');

  useEffect(() => {
    if (state.result) {
      const c = state.result.colors;
      // Create a complex gradient from the returned palette
      if (c && c.length >= 2) {
         // We use inline styles on the main div for this dynamic background
      }
    }
  }, [state.result]);

  const handleAnalysis = async (method: 'text' | 'file', input: string | File) => {
    setState({ status: method === 'text' ? 'analyzing_text' : 'processing_audio' });
    
    try {
      let profile: SongProfile;
      
      if (method === 'text') {
        profile = await analyzeSongText(input as string);
      } else {
        profile = await analyzeAudioFile(input as File);
      }

      setState({ status: 'generating_image', result: profile });

      // Generate Image in parallel or sequential? Sequential for better UX flow
      const imageUrl = await generateAlbumArt(profile.imagePrompt);
      
      setState({ status: 'complete', result: profile, generatedImageUrl: imageUrl });

    } catch (error) {
      console.error(error);
      setState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    }
  };

  const getDynamicBackground = () => {
    if (state.result?.colors) {
        const c = state.result.colors;
        return {
            background: `radial-gradient(circle at 50% 0%, ${c[0]}33 0%, transparent 70%),
                         radial-gradient(circle at 0% 50%, ${c[1]}33 0%, transparent 60%),
                         radial-gradient(circle at 100% 50%, ${c[2]}33 0%, transparent 60%),
                         #0f0f13`
        };
    }
    return {};
  };

  const resetApp = () => {
      setState({ status: 'idle' });
  }

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-1000 ease-in-out relative"
      style={getDynamicBackground()}
    >
      {/* Global Noise Overlay for texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Navbar */}
      <nav className="relative z-10 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div 
            onClick={resetApp}
            className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">SONIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">BLOOM</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer transition-colors">About</span>
          <span className="hover:text-white cursor-pointer transition-colors">Gallery</span>
          <span className="flex items-center gap-1 text-indigo-400"><Sparkles size={12} /> Powered by Gemini</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-[80vh] justify-center">
        
        {state.status === 'idle' && (
          <div className="w-full max-w-3xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              See the colors of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-pulse">your sound.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Upload a track or paste a link. Sonic Bloom uses Gemini 3 to analyze audio frequencies, lyrics, and cultural context to generate a unique visual and emotional profile.
            </p>
            <InputSection 
              loading={false} 
              onAnalyzeText={(t) => handleAnalysis('text', t)} 
              onAnalyzeFile={(f) => handleAnalysis('file', f)} 
            />
          </div>
        )}

        {(state.status === 'analyzing_text' || state.status === 'processing_audio' || state.status === 'generating_image') && (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 animate-in fade-in">
             <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-4 border-indigo-500/50 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <MusicVisualizer />
                </div>
             </div>
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">
                    {state.status === 'analyzing_text' && "Deconstructing Lyrics & Context..."}
                    {state.status === 'processing_audio' && "Listening to Frequencies..."}
                    {state.status === 'generating_image' && "Dreaming up Visuals..."}
                </h2>
                <p className="text-gray-400">Gemini is analyzing the deep structure of the song.</p>
             </div>
          </div>
        )}

        {state.status === 'complete' && state.result && (
           <ResultsView profile={state.result} imageUrl={state.generatedImageUrl} />
        )}

        {state.status === 'error' && (
            <div className="glass-panel p-8 rounded-2xl text-center max-w-lg">
                <div className="text-red-400 text-5xl mb-4">:/</div>
                <h2 className="text-xl font-bold text-white mb-2">Something went off-key</h2>
                <p className="text-gray-400 mb-6">{state.error}</p>
                <button 
                    onClick={resetApp}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                    Try Again
                </button>
            </div>
        )}

      </main>

      <footer className="relative z-10 w-full py-6 text-center text-gray-600 text-xs">
        &copy; {new Date().getFullYear()} Sonic Bloom. Built with Gemini 2.5 & 3 Pro.
      </footer>
    </div>
  );
};

// Simple visualizer component for loading state
const MusicVisualizer: React.FC = () => (
    <div className="flex items-end gap-1 h-12">
        {[...Array(5)].map((_, i) => (
            <div 
                key={i} 
                className="w-2 bg-gradient-to-t from-pink-500 to-indigo-500 rounded-full animate-[bounce_1s_infinite]" 
                style={{ animationDelay: `${i * 0.1}s`, height: '100%' }}
            ></div>
        ))}
    </div>
);

export default App;