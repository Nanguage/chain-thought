import { create } from "zustand";
import { Message, HistoryLine } from "./types";

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
  root: HistoryLine;
  last: HistoryLine;
  addNewLine: (message: Message) => void;
  setLastMessage: (message: Message) => void;
}


export const useHistoryStore = create<HistoryProps>((set) => {
  const root = {
    nodes: [],
    currentIndex: -1,
  }
  return {
    root: root,
    last: root,

    addNewLine: (message) => set(state => {
      if (state.root.currentIndex < 0) {
        const newRoot = {
          nodes: [{ message, next: null }],
          currentIndex: 0,
        }
        return {
          root: newRoot,
          last: newRoot,
        }
      } else {
        const newRoot = Object.assign({}, state.root);
        const lastNode = state.last.nodes[state.last.currentIndex];
        const newLine = { nodes: [{ message, next: null }], currentIndex: 0 };
        lastNode.next = newLine;
        return {
          root: newRoot,
          last: newLine,
        }
      }
    }),

    setLastMessage: (message) => set(state => {
      if (state.root.currentIndex < 0) {
        const newRoot = {
          nodes: [{ message, next: null }],
          currentIndex: 0,
        }
        return {
          root: newRoot,
          last: newRoot,
        }
      } else {
        const newRoot = Object.assign({}, state.root);
        const lastNode = state.last.nodes[state.last.currentIndex];
        lastNode.message = message;
        return {
          root: newRoot,
          last: state.last,
        }
      }
    }),
}});
