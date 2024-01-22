import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';
import { Message } from '../types/message';


// Please set your API key in .env file, e.g.: VITE_OPENAI_API_KEY=your-api-key
const default_key = import.meta.env.VITE_OPENAI_API_KEY


export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState<string>("");
  const [apiKey, setApiKey] = useState(default_key);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (message: string) => {
    const updatedMessages: Message[] = [
      ...messages,
      { sender: "user", content: message, timestamp: new Date().toLocaleTimeString() },
    ];

    setMessages(updatedMessages)

    try {
      const handleMessageReceived = (receivedMessage: string) => {
        console.log(receivedMessage)
        if (receivedMessage === "[start]") {
          setMessages([...updatedMessages, {sender: 'bot', content: "", timestamp: new Date().toLocaleTimeString()}])
        } else if (receivedMessage === "[end]") {
          setReply("")
        } else {
          setReply(prevReply => prevReply + receivedMessage)
        }
      };

      await sendMessage(updatedMessages, apiKey, handleMessageReceived);
    } catch (error) {
      console.error('Error getting response from ChatGPT:', error);
    }
  };

  useEffect(() => {
    if (reply) {
      const updatedMessages: Message[] = [
        ...messages.slice(0, messages.length - 1),
        { sender: "bot", content: reply, timestamp: new Date().toLocaleTimeString() },
      ];
      setMessages(updatedMessages);
    }
  }, [reply])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
          OpenAI API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md"
        />
      </div>

      <hr/>

      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput onSubmit={handleSendMessage} />
    </div>
  );
};
