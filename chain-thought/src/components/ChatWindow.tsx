import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';
import { Message } from '../types/message';

import { useSettingStore } from '../store';
import Seeting from './Setting';


export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState<string>("");
  const { apiKey, setApiKey } = useSettingStore((state) => state);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleMessageReceived = (messages: Message[], recv: string) => {
    if (recv === "[start]") {
      setMessages([...messages, {sender: 'bot', content: "", timestamp: new Date().toLocaleTimeString()}])
    } else if (recv === "[end]") {
      setReply("")
    } else {
      console.log(recv)
      setReply((prev) => prev.concat(recv))
    }
  };

  const handleSendMessage = async (message: string) => {
    const updatedMessages: Message[] = [
      ...messages,
      { sender: "user", content: message, timestamp: new Date().toLocaleTimeString() },
    ];
    setMessages(updatedMessages)
    try {
      await sendMessage(updatedMessages, apiKey, (recv) => handleMessageReceived(updatedMessages, recv));
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
      <Seeting />

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
