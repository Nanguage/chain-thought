import React from 'react';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'bot';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const messageClass = sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300';

  return (
    <div className={`rounded-lg px-4 py-2 my-2 ${messageClass}`}>
      {message}
    </div>
  );
};
