import React, { useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t-2 border-gray-200 px-4 py-3"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow outline-none"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
      >
        Send
      </button>
    </form>
  );
};
