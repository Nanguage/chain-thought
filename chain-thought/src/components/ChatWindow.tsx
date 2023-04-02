import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';

interface Message {
  sender: 'user' | 'bot';
  content: string;
}

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { sender: 'user', content: message }]);
    try {
      const response = await sendMessage([...messages, { sender: 'user', content: message }]);
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
