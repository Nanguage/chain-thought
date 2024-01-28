import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessage } from '../utils/chatgptAPI';
import { Message } from '../types';
import { getLinearMessages } from '../utils';

import { useSettingStore, useStatusStore, useHistoryStore } from '../store';
import Setting from './Setting';


function flushMathJax() {
  if( typeof window?.MathJax !== "undefined"){
    window.MathJax.typesetClear()
    window.MathJax.typeset()
  }
}


export const ChatWindow: React.FC = () => {
  const { root, addNewLine, setLastMessage } = useHistoryStore((state) => state);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState<string>("");
  const { apiKey, model, mathJax } = useSettingStore((state) => state);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { setApiKeyError, setGenerating } = useStatusStore((state) => state);

  const handleMessageReceived = (messages: Message[], recv: string) => {
    if (recv === "[start]") {
      setGenerating(true)
      addNewLine({sender: 'bot', content: "", timestamp: new Date().toLocaleTimeString()})
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
    addNewLine({sender: 'user', content: message, timestamp: new Date().toLocaleTimeString()})
  };

  useEffect(() => {
    if (reply) {
      setLastMessage({ sender: "bot", content: reply, timestamp: new Date().toLocaleTimeString()});
    }
  }, [reply])

  useEffect(() => {
    setMessages(getLinearMessages(root));
  }, [root]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      if (mathJax) {
        flushMathJax();
      }
      console.log(messages)
      const p = sendMessage(model, messages, apiKey, (recv) => handleMessageReceived(messages, recv));
      p.then((res) => {
        console.log(res)
        setErrorMsg("");
        setApiKeyError(false);
      }).catch((err) => {
        console.log(err)
        setErrorMsg(err.message);
        if (err.message.toLowerCase().includes('api key')) {
          setApiKeyError(true);
        }
      });
    }
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
