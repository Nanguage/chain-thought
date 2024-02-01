import React, { useEffect } from 'react';
import { Message } from '../types';
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

interface ChatMessageProps {
  message: Message;
  editing: boolean;
  setNewContent: (content: string) => void;
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, editing, setNewContent }) => {
  const messageClass = message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300';
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    enqueueSnackbar("Copied to clipboard")
  }

  const editRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing) {
      editRef.current?.focus()
    }
  }, [editing])

  const handleContentChange = () => {
    if (editRef.current) {
      setNewContent(editRef.current.innerHTML)
    }
  }

  const msgComp = React.useMemo(() => {
    return (
      <Markdown
        className={"prose"}
        children={message.content}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            const res = match ? (
              <div>
                <div className="w-full h-6">
                  <div className="hover:cursor-pointer float-right h-5 mr-1" onClick={() => handleCopy(code)}>
                    Copy
                    <ContentCopyIcon sx={{height: 12}}/>
                  </div>
                </div>
                <SyntaxHighlighter
                  PreTag="div"
                  children={code}
                  language={match[1]}
                  style={nord}
                />
              </div>
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
          <div
            contentEditable={true}
            ref={editRef}
            className="whitespace-pre-wrap p-2"
            dangerouslySetInnerHTML={{ __html: message.content }}
            onInput={handleContentChange}
            >
          </div>
        ) : (
          msgComp
        )
      }
    </div>
  );
};
