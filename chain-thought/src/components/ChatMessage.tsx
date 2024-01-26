import React from 'react';
import { Message } from '../types';
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import PersonIcon from '@mui/icons-material/Person';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';


interface ChatMessageProps {
  message: Message;
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300';
  const [editing, setEditing] = React.useState(false);

  return (
    <div>
      <div className="flex items-center">
        {message.sender === 'user' ? <PersonIcon/> : <SmartToySharpIcon/>}
        <div className="text-xs text-gray-500 ml-2">
          {message.sender}
        </div>
      </div>

      <div className={`rounded-lg px-4 py-2 my-2 ${messageClass}`}>
        {
          editing ? (
            <div contentEditable={true}>
              {message.content}
            </div>
          ) : (
            <Markdown
              children={message.content}
              components={{
                code(props) {
                  const {children, className, node, ...rest} = props
                  const match = /language-(\w+)/.exec(className || '')
                  const res = match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={nord}
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  )
                  return res
                }
              }}
            />
          )
        }

      </div>

      <div className="flex justify-end">
        <div className="text-xs text-gray-500">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
