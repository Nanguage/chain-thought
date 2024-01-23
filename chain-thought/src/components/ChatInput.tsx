import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
    <div
      className="flex gap-1 items-center border-t-2 border-gray-200 px-1 py-3"
    >
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow outline-none"
        placeholder="Type here, Enter to send, Shift+Enter to new line."
        multiline
        onKeyDown={(e) => {
          console.log(e.key);
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
      />
      <IconButton color="primary">
        <SendIcon onClick={handleSubmit} />
      </IconButton>
    </div>
  );
};
