import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';
import { Message } from '../types/message';

import { useSettingStore, useStatusStore } from '../store';
import Setting from './Setting';


function flushMathJax() {
  if( typeof window?.MathJax !== "undefined"){
    window.MathJax.typesetClear()
    window.MathJax.typeset()
  }
}


export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState<string>("");
  const { apiKey, model, mathJax } = useSettingStore((state) => state);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { setApiKeyError, setGenerating } = useStatusStore((state) => state);

  const handleMessageReceived = (messages: Message[], recv: string) => {
    if (recv === "[start]") {
      setGenerating(true)
      setMessages([...messages, {sender: 'bot', content: "", timestamp: new Date().toLocaleTimeString()}])
    } else if (recv === "[end]") {
      setReply("")
      if (mathJax) {
        flushMathJax();
      }
      setGenerating(false)
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
    if (mathJax) {
      flushMathJax();
    }
    try {
      await sendMessage(model, updatedMessages, apiKey, (recv) => handleMessageReceived(updatedMessages, recv));
      setErrorMsg("");
      setApiKeyError(false);
    } catch (error) {
      console.error('Error getting response from ChatGPT:', error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
        if (error.message.toLowerCase().includes('api key')) {
          setApiKeyError(true);
        }
      }
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

  useEffect(() => {
    if (mathJax) {
      flushMathJax();
    }
  }, [mathJax])

  return (
    <div className="flex flex-col h-full">
      <Setting />
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
      <div className="text-red-500 text-sm">{errorMsg}</div>
    </div>
  );
};
