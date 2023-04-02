export interface Message {
  sender: 'user' | 'bot';
  content: string;
}

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}
