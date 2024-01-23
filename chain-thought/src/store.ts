import { create } from "zustand";

// Please set your API key in .env file, e.g.: VITE_OPENAI_API_KEY=your-api-key
const defaultApiKey = import.meta.env.VITE_OPENAI_API_KEY;

export interface SettingProps {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}

export const useSettingStore = create<SettingProps>((set) => ({
  apiKey: defaultApiKey,
  setApiKey: (apiKey) => set({ apiKey }),
}));
