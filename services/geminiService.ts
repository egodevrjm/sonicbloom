import { GoogleGenAI, Type } from "@google/genai";
import { SongProfile } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to convert Blob to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Define the response schema for the analysis
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    songTitle: { type: Type.STRING, description: "The name of the song identified or analyzed." },
    artist: { type: Type.STRING, description: "The artist name." },
    mood: { type: Type.STRING, description: "A single word describing the primary mood." },
    vibes: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3-5 short keywords describing the atmosphere or vibe." 
    },
    colors: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "A palette of 5 hex color codes that represent the song's feeling." 
    },
    attributes: {
      type: Type.OBJECT,
      properties: {
        energy: { type: Type.INTEGER, description: "0-100 score for energy." },
        danceability: { type: Type.INTEGER, description: "0-100 score for danceability." },
        valence: { type: Type.INTEGER, description: "0-100 score for musical positivity/happiness." },
        acousticness: { type: Type.INTEGER, description: "0-100 score for acoustic elements." },
        futurism: { type: Type.INTEGER, description: "0-100 score for modern/electronic/sci-fi feel." },
      },
      required: ["energy", "danceability", "valence", "acousticness", "futurism"]
    },
    poeticDescription: { type: Type.STRING, description: "A short, 2-sentence poetic interpretation of the track." },
    imagePrompt: { type: Type.STRING, description: "A detailed prompt to generate abstract album art representing the song's synesthesia. Include colors, shapes, and lighting." },
  },
  required: ["songTitle", "artist", "mood", "vibes", "colors", "attributes", "poeticDescription", "imagePrompt"]
};

export const analyzeSongText = async (query: string): Promise<SongProfile> => {
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  // Using Gemini 3 Pro for deep textual reasoning and knowledge
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the song "${query}". Provide a deep aesthetic and emotional profile.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      systemInstruction: "You are a synesthetic music critic. You analyze songs to extract their color palette, emotional spectrum, and visual imagery.",
    },
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as SongProfile;
};

export const analyzeAudioFile = async (file: File): Promise<SongProfile> => {
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const audioPart = await fileToGenerativePart(file);

  // Using Gemini 2.5 Flash for reliable multimodal (audio) processing
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        audioPart,
        { text: "Listen to this audio track. Identify the genre, mood, and atmosphere. Create a visual profile for it." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      systemInstruction: "You are a synesthetic music critic. Analyze the audio provided. If you recognize the song, use its metadata. If not, analyze the raw audio features.",
    },
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text) as SongProfile;
};

export const generateAlbumArt = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  // Using Gemini 2.5 Flash Image for generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt + " High quality, abstract, 3d render, cinematic lighting, 4k, artistic composition." }
      ]
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  
  if (!part || !part.inlineData) {
    throw new Error("No image generated");
  }

  return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
};
