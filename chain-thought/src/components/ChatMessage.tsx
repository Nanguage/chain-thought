import React from 'react';
import { Message } from '../types/message';
import PersonIcon from '@mui/icons-material/Person';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';


interface ChatMessageProps {
  message: Message;
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300';

  return (
    <div>
      <div className="flex items-center">
        {message.sender === 'user' ? <PersonIcon/> : <SmartToySharpIcon/>}
        <div className="text-xs text-gray-500 ml-2">
          {message.sender}
        </div>
      </div>

      <div className={`rounded-lg px-4 py-2 my-2 ${messageClass}`}>
        {message.content}
      </div>

      <div className="flex justify-end">
        <div className="text-xs text-gray-500">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
