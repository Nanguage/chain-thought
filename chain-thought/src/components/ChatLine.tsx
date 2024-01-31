import React from 'react';
import { HistoryLine } from '../types';
import { ChatMessage } from './ChatMessage';
import PersonIcon from '@mui/icons-material/Person';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useSnackbar } from 'notistack';
import { useHistoryStore, useStatusStore } from '../store';


const iconSize = 18;
const iconClassname = "text-gray-600 hover:text-gray-800 hover:cursor-pointer"


const NodeSwitcher: React.FC<{historyLine: HistoryLine}> = ({ historyLine }) => {
  const { refresh } = useHistoryStore();

  return (
    <div className="flex justify-center">
      <ChevronLeftIcon
        className={iconClassname}
        sx={{height: iconSize}}
        onClick={() => {
          if (historyLine.currentIndex > 0) {
            historyLine.currentIndex -= 1;
          }
          refresh();
        }}
      />
      <div className="w-8 text-sm text-gray-600 text-center">{`${historyLine.currentIndex + 1} / ${historyLine.nodes.length}`}</div>
      <ChevronRightIcon
        className={iconClassname}
        sx={{height: iconSize}}
        onClick={() => {
          if (historyLine.currentIndex < historyLine.nodes.length - 1) {
            historyLine.currentIndex += 1;
          }
          refresh();
        }}
      />
    </div>
  )
}

interface ChatLineProps {
  historyLine: HistoryLine;
}

export const ChatLine: React.FC<ChatLineProps> = ({ historyLine }) => {
  const [hover, setHover] = React.useState(false);
  const currentNode = historyLine.nodes[historyLine.currentIndex];
  const message = currentNode.message;
  const { enqueueSnackbar } = useSnackbar();
  const { refresh, setLastLine } = useHistoryStore();
  const { setReGenerating } = useStatusStore();
  const [editing, setEditing] = React.useState(false);

  const handleCopy = () => {
    enqueueSnackbar('Copied to clipboard');
    navigator.clipboard.writeText(message.content)
  }

  const reGenerateRequest = () => {
    historyLine.nodes.push({
      message: {
        sender: 'bot',
        content: '',
        timestamp: new Date().toLocaleTimeString()
      },
      next: null
    })
    historyLine.currentIndex = historyLine.nodes.length - 1;
    setReGenerating(true);
    setLastLine(historyLine);
    refresh();
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
      <ChatMessage message={message} editing={editing} />
      <div className={"flex mb-1 justify-between"}>
        {
          hover ? (
            <div className='relative'>
              {
                message.sender === 'bot' ? (
                  <div className='absolute top-0 w-10 flex'>
                    {
                      historyLine.nodes.length > 1 ?  (
                        <NodeSwitcher historyLine={historyLine}/>
                      ) : null
                    }
                    <ContentCopyIcon
                      className={iconClassname+ " pt-0.5"}
                      sx={{height: iconSize - 2}}
                      onClick={handleCopy}
                      />
                    <RefreshIcon
                      className={iconClassname}
                      sx={{height: iconSize + 1}}
                      onClick={reGenerateRequest}
                      />
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
