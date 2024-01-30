import React from 'react';
import { HistoryLine } from '../types';
import { ChatMessage } from './ChatMessage';
import PersonIcon from '@mui/icons-material/Person';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

interface ChatLineProps {
  historyLine: HistoryLine;
}

export const ChatLine: React.FC<ChatLineProps> = ({ historyLine }) => {
  const [hover, setHover] = React.useState(false);
  const currentNode = historyLine.nodes[historyLine.currentIndex];
  const message = currentNode.message;
  const iconClassname = "text-gray-600 hover:text-gray-800 hover:cursor-pointer"
  const iconSize = 18;
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = () => {
    enqueueSnackbar('Copied to clipboard');
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center">
        {message.sender === 'user' ? <PersonIcon/> : <SmartToySharpIcon/>}
        <div className="text-xs text-gray-500 ml-2">
          {message.sender}
        </div>
      </div>
      <ChatMessage message={message} />
      <div className={"flex mb-4 justify-between"}>
        {
          hover ? (
            <div className='relative'>
              {
                message.sender === 'bot' ? (
                  <div className='absolute top-0 w-10 flex'>
                    <ContentCopyIcon
                      className={iconClassname}
                      sx={{height: iconSize - 2}}
                      onClick={handleCopy}
                      />
                    <RefreshIcon
                      className={iconClassname}
                      sx={{height: iconSize + 1}}/>
                  </div>
                ) : null
              }
              {
                message.sender === 'user' ? (
                  <EditIcon
                    className={"absolute top-0 " + iconClassname}
                    sx={{height: iconSize}}/>
                ) : null
              }
            </div>
          ) : <div></div>
        }
        <div className="text-xs text-gray-500 mt-0.5">
          {message.timestamp}
        </div>
      </div>
    </div>
  )
}
