import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
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
  generateDecision: (lastMessage: Message) => boolean;
  setGenerateDecision: (generateDecision: (lastMessage: Message) => boolean) => void;
}


export const useSettingStore = create(
  persist<SettingProps>(
    (set) => ({
      apiKey: defaultApiKey,
      setApiKey: (apiKey) => set({ apiKey }),
      model: defaultModel,
      setModel: (model) => set({ model }),
      mathJax: false,
      setMathJax: (mathJax) => set({ mathJax }),
      generateDecision: (lastMessage) => {
        if (lastMessage.sender === "user") {
          return true;
        }
        return false;
      },
      setGenerateDecision: (generateDecision) => set({ generateDecision }),
    }),
    {
      name: 'chain-thought-setting',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


interface StatusProps {
  apiKeyError: boolean;
  setApiKeyError: (apiKeyError: boolean) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
  reGenerating: boolean;
  setReGenerating: (reGenerating: boolean) => void;
}


export const useStatusStore = create<StatusProps>((set) => ({
  apiKeyError: false,
  setApiKeyError: (apiKeyError) => set({ apiKeyError }),
  generating: false,
  setGenerating: (generating) => set({ generating }),
  reGenerating: false,
  setReGenerating: (r) => set({ reGenerating: r}),
}));


interface HistoryProps {
  root: HistoryLine;
  last: HistoryLine;
  setLastLine: (line: HistoryLine) => void;
  refresh: () => void;
  addNewLine: (message: Message) => void;
  setLastMessage: (message: Message) => void;
  setLastContent: (content: string) => void;
  appendLastMessage: (token: string) => void;
}


export const useHistoryStore = create<HistoryProps>((set, get) => {
  const root = {
    nodes: [],
    currentIndex: -1,
  }
  return {
    root: root,
    last: root,

    refresh: () => set(state => {
      const newRoot = Object.assign({}, state.root);
      return {
        root: newRoot,
      }
    }),

    setLastLine: (line) => {
      set({
        last: line,
      })
    },

    addNewLine: (message) => {
      const state = get();
      if (state.root.currentIndex < 0) {
        const newRoot = {
          nodes: [{ message, next: null }],
          currentIndex: 0,
        }
        set({
          root: newRoot,
          last: newRoot,
        })
      } else {
        const newRoot = Object.assign({}, state.root);
        const lastNode = state.last.nodes[state.last.currentIndex];
        const newLine = { nodes: [{ message, next: null }], currentIndex: 0 };
        lastNode.next = newLine;
        set({
          root: newRoot,
          last: newLine,
        })
      }
    },

    setLastMessage: (message) => {
      const state = get();
      if (state.root.currentIndex < 0) {
        const newRoot = {
          nodes: [{ message, next: null }],
          currentIndex: 0,
        }
        set({
          root: newRoot,
          last: newRoot,
        })
      } else {
        const lastNode = state.last.nodes[state.last.currentIndex];
        lastNode.message = message;
        state.refresh();
      }
    },

    setLastContent: (content) => {
      const state = get();
      const lastNode = state.last.nodes[state.last.currentIndex];
      const lastMessage = lastNode.message;
      lastMessage.content = content;
      lastMessage.timestamp = new Date().toLocaleTimeString();
      state.setLastMessage(lastMessage);
    },

    appendLastMessage: (token) =>  {
      const state = get();
      const lastNode = state.last.nodes[state.last.currentIndex];
      const lastMessage = lastNode.message;
      state.setLastContent(lastMessage.content + token);
    },
}});
