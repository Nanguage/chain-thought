import { Message } from '../types/message';
import { ChatGPTMessage } from "../types/message";
import { OpenAI } from "openai-streams";


const convertSenderToRole = (sender: 'user' | 'bot'): 'user' | 'assistant' => {
  return sender === 'bot' ? 'assistant' : 'user';
};

export async function sendMessage(
  messages: Message[],
  apiKey: string,
  onMessageReceived: (message: string) => void
): Promise<void> {
  const formattedMessages: ChatGPTMessage[] = messages.map((message) => ({
    role: convertSenderToRole(message.sender),
    content: message.content,
  }));

  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }, { apiKey });


  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  async function readStream() {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        return;
      }

      // sleep for 0.01 seconds
      await new Promise((resolve) => setTimeout(resolve, 10));

      const text = decoder.decode(value);
      const rep = JSON.parse(text)
      // if role in rep, content = '[start]'
      // elif content not in rep, content = '[end]'
      let content
      if (rep['role'] === 'assistant') {
        content = '[start]'
      } else if (rep['content'] === undefined) {
        content = '[end]'
      } else {
        content = rep['content']
      }

      onMessageReceived(content);
    }
  }

  readStream();
}
