import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';

interface Message {
  sender: 'user' | 'bot';
  content: string;
}

// 请在 .env 文件中设置你的API密钥，例如：REACT_APP_OPENAI_API_KEY=your_api_key_here
const default_key = import.meta.env.VITE_OPENAI_API_KEY


export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState(default_key);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { sender: 'user', content: message }]);
    try {
      const response = await sendMessage(
        [...messages, { sender: 'user', content: message }],
        apiKey);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', content: response }]);
    } catch (error) {
      console.error('Error getting response from ChatGPT:', error);
    }
  };

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
            message={message.content}
            sender={message.sender}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput onSubmit={handleSendMessage} />
    </div>
  );
};
