export interface Message {
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export type ChatRole = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatRole;
  content: string;
}

export interface HistoryNode {
  message: Message;
  next: HistoryLine | null;
}

export interface HistoryLine {
  nodes: HistoryNode[];
  currentIndex: number;
}
