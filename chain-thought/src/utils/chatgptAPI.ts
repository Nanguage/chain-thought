import { Message } from '../types';
import { ChatGPTMessage } from "../types";
import { OpenAI } from "openai-streams";


const convertSenderToRole = (sender: 'user' | 'bot'): 'user' | 'assistant' => {
  return sender === 'bot' ? 'assistant' : 'user';
};

export async function sendMessage(
  model: string,
  messages: Message[],
  apiKey: string,
  onMessageReceived: (message: string) => void
): Promise<void> {
  const formattedMessages: ChatGPTMessage[] = messages.map((message) => ({
    role: convertSenderToRole(message.sender),
    content: message.content,
  }));

  onMessageReceived('[new]');

  const stream = await OpenAI("chat", {
    model: model,
    messages: formattedMessages,
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }, { apiKey });


  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  async function readStream() {
    onMessageReceived('[start]');
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        onMessageReceived('[end]');
        return;
      }

      // sleep for 0.01 seconds
      await new Promise((resolve) => setTimeout(resolve, 10));

      const rep = decoder.decode(value);
      onMessageReceived(rep);
    }
  }

  await readStream();
}
