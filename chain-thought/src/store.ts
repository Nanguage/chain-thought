import { create } from "zustand";

// Please set your API key in .env file, e.g.: VITE_OPENAI_API_KEY=your-api-key
const defaultApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const defaultModel = "gpt-4-1106-preview";

interface SettingProps {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  model: string;
  setModel: (model: string) => void;
  mathJax: boolean;
  setMathJax: (useMathJax: boolean) => void;
}

export const useSettingStore = create<SettingProps>((set) => ({
  apiKey: defaultApiKey,
  setApiKey: (apiKey) => set({ apiKey }),
  model: defaultModel,
  setModel: (model) => set({ model }),
  mathJax: false,
  setMathJax: (mathJax) => set({ mathJax }),
}));


interface StatusProps {
  apiKeyError: boolean;
  setApiKeyError: (apiKeyError: boolean) => void;
}

export const useStatusStore = create<StatusProps>((set) => ({
  apiKeyError: false,
  setApiKeyError: (apiKeyError: boolean) => set({ apiKeyError }),
}));
