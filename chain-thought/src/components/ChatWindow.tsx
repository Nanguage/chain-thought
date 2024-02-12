import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { ChatLine } from './ChatLine';
import { sendMessage } from '../utils/chatgptAPI';
import { HistoryLine } from '../types';
import { getLinearLines, getLinesMessages } from '../utils/history';
import { useSnackbar } from 'notistack';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import IconButton from '@mui/material/IconButton';

import { useSettingStore, useStatusStore, useHistoryStore } from '../store';
import Setting from './Setting';


function flushMathJax() {
  if( typeof window?.MathJax !== "undefined"){
    window.MathJax.typesetClear()
    window.MathJax.typeset()
  }
}


export const ChatWindow: React.FC = () => {
  const { root, addNewLine, appendLastMessage, setLastContent, setLastLine } = useHistoryStore((state) => state);
  const [lines, setLines] = useState<HistoryLine[]>([]);
  const { apiBase, apiKey, model, mathJax, generateDecision } = useSettingStore((state) => state);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const {
    setApiKeyError, setGenerating,
    reGenerateFlag, setReGenerateFlag,
    stopFlag, setStopFlag
  } = useStatusStore((state) => state);
  const [hasRendered, setHasRendered] = useState(false);
  const stopFlagRef = useRef(stopFlag);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (isSmooth=true) => {
    if (messagesEndRef.current) {
      if (isSmooth) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        messagesEndRef.current.scrollIntoView();
      }
    }
  };

  const atTheBottom = () => {
    if (messagesEndRef.current) {
      return messagesEndRef.current.getBoundingClientRect().bottom <= window.innerHeight;
    }
    return false;
  }

  useEffect(() => {
    setHasRendered(true);

    const handleScroll = () => {
      setShowScrollButton(!atTheBottom());
    };

    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hasRendered) {
      scrollToBottom(false);
    }
  }, [hasRendered]);

  const handleMessageReceived = (recv: string) => {
    if (recv === "[new]") {
      setGenerating(true)
      if (!reGenerateFlag) {
        addNewLine({sender: 'bot', content: "**Wait to response...**", timestamp: new Date().toLocaleTimeString()})
      }
    } else if (recv === "[start]") {
      console.log("start response...")
      setLastContent("");
    } else if (recv === "[end]") {
      if (mathJax) {
        flushMathJax();
      }
      setGenerating(false);
    } else {
      console.log(recv)
      appendLastMessage(recv);
      if (stopFlagRef.current) {
        setStopFlag(false);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    stopFlagRef.current = stopFlag;
  }, [stopFlag])

  const handleSendMessage = async (message: string) => {
    addNewLine({sender: 'user', content: message, timestamp: new Date().toLocaleTimeString()})
  };

  useEffect(() => {
    const lines = getLinearLines(root);
    setLastLine(lines[lines.length - 1]);
    setLines(lines);
  }, [root]);

  useEffect(() => {
    const messages = getLinesMessages(lines);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && generateDecision(lastMessage) || reGenerateFlag) {
      if (mathJax) {
        flushMathJax();
      }
      console.log(messages)
      const p = sendMessage(model, messages, apiKey, apiBase, handleMessageReceived);
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
      setReGenerateFlag(false);
    }
    if (atTheBottom()) {
      scrollToBottom(false);
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
      <div className="flex-grow overflow-y-auto p-4" ref={containerRef}>
        {lines.map((line, index) => (
          <ChatLine
            key={index}
            historyLine={line}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="w-full h-0 flex justify-center">
        {
          showScrollButton && (
            <IconButton className="fixed bottom-10 h-10 z-100" color="primary" onClick={(e) => {scrollToBottom(true)}}>
              <ExpandCircleDownIcon />
            </IconButton>
          )
        }
      </div>
      <ChatInput onSubmit={handleSendMessage} />
    </div>
  );
};
