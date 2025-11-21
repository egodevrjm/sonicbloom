export interface MusicalAttributes {
  energy: number;
  danceability: number;
  valence: number; // Happiness/Positivity
  acousticness: number;
  futurism: number;
}

export interface SongProfile {
  songTitle: string;
  artist: string;
  mood: string;
  vibes: string[];
  colors: string[]; // Hex codes
  attributes: MusicalAttributes;
  poeticDescription: string;
  imagePrompt: string;
}

export interface AnalysisState {
  status: 'idle' | 'processing_audio' | 'analyzing_text' | 'generating_image' | 'complete' | 'error';
  error?: string;
  result?: SongProfile;
  generatedImageUrl?: string;
}

export enum InputMode {
  TEXT = 'TEXT',
  FILE = 'FILE'
}