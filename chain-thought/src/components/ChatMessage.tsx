import React from 'react';
import { Message } from '../types';
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';


interface ChatMessageProps {
  message: Message;
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300';
  const [editing, setEditing] = React.useState(false);

  const msgComp = React.useMemo(() => {
    return (
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
    );
  }, [message.content]);

  return (
    <div className={`rounded-lg px-4 py-2 my-1 ${messageClass}`}>
      {
        editing ? (
          <div contentEditable={true}>
            {message.content}
          </div>
        ) : (
          msgComp
        )
      }
    </div>
  );
};
