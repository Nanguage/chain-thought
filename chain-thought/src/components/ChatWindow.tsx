import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatLine } from './ChatLine';
import { sendMessage } from '../utils/chatgptAPI';
import { HistoryLine } from '../types';
import { getLinearLines, getLinesMessages } from '../utils/history';
import { useSnackbar } from 'notistack';

import { useSettingStore, useStatusStore, useHistoryStore } from '../store';
import Setting from './Setting';


function flushMathJax() {
  if( typeof window?.MathJax !== "undefined"){
    window.MathJax.typesetClear()
    window.MathJax.typeset()
  }
}


export const ChatWindow: React.FC = () => {
  const { root, addNewLine, appendLastMessage } = useHistoryStore((state) => state);
  const [lines, setLines] = useState<HistoryLine[]>([]);
  const { apiKey, model, mathJax, generateDecision } = useSettingStore((state) => state);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { setApiKeyError, setGenerating, reGenerating, setReGenerating } = useStatusStore((state) => state);

  const handleMessageReceived = (recv: string) => {
    if (recv === "[start]") {
      setGenerating(true)
      if (!reGenerating) {
        addNewLine({sender: 'bot', content: "", timestamp: new Date().toLocaleTimeString()})
      }
    } else if (recv === "[end]") {
      if (mathJax) {
        flushMathJax();
      }
      setGenerating(false)
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      console.log(recv)
      appendLastMessage(recv);
    }
  };

  const handleSendMessage = async (message: string) => {
    addNewLine({sender: 'user', content: message, timestamp: new Date().toLocaleTimeString()})
  };

  useEffect(() => {
    setLines(getLinearLines(root));
  }, [root]);

  useEffect(() => {
    const messages = getLinesMessages(lines);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && generateDecision(lastMessage) || reGenerating) {
      if (mathJax) {
        flushMathJax();
      }
      console.log(messages)
      const p = sendMessage(model, messages, apiKey, (recv) => handleMessageReceived(recv));
      p.then((res) => {
        console.log(res)
        setApiKeyError(false);
      }).catch((err) => {
        console.log(err)
        let errMsg = "Some error occurred during the request."
        if (err.message.toLowerCase().includes('api key')) {
          setApiKeyError(true);
          errMsg = "Invalid API key."
        }
        setGenerating(false);
        enqueueSnackbar(errMsg, { variant: 'error' });
      });
      setReGenerating(false);
    }
  }, [lines]);

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
        {lines.map((line, index) => (
          <ChatLine
            key={index}
            historyLine={line}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput onSubmit={handleSendMessage} />
    </div>
  );
};
