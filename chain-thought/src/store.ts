import { create } from "zustand";
import { Message } from "./types";

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
  generating: boolean;
  setGenerating: (generating: boolean) => void;
}

export const useStatusStore = create<StatusProps>((set) => ({
  apiKeyError: false,
  setApiKeyError: (apiKeyError) => set({ apiKeyError }),
  generating: false,
  setGenerating: (generating) => set({ generating }),
}));


interface HistoryProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  setLastMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useHistoryStore = create<HistoryProps>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLastMessage: (message) => set((state) => ({ messages: [...state.messages.slice(0, -1), message] })),
  clearMessages: () => set({ messages: [] }),
}));
