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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { useHistoryStore, useStatusStore } from '../store';
import { getLinearLines } from '../utils/history';


const iconSize = 18;
const iconClassname = "text-gray-600 hover:text-gray-800 hover:cursor-pointer"


const NodeSwitcher: React.FC<{historyLine: HistoryLine}> = ({ historyLine }) => {
  const { root, refresh, setLastLine } = useHistoryStore();
  const { enqueueSnackbar } = useSnackbar();
  const { generating } = useStatusStore();

  const setLast = () => {
    const lines = getLinearLines(root)
    setLastLine(lines[lines.length - 1])
  }

  return (
    <div className="flex justify-center">
      <ChevronLeftIcon
        className={iconClassname}
        sx={{height: iconSize}}
        onClick={() => {
          if (generating) {
            enqueueSnackbar('Please wait for the current generation to finish.', {variant: 'error'});
            return;
          }
          if (historyLine.currentIndex > 0) {
            historyLine.currentIndex -= 1;
          }
          refresh();
          setLast();
        }}
      />
      <div className="w-8 text-sm text-gray-600 text-center">{`${historyLine.currentIndex + 1} / ${historyLine.nodes.length}`}</div>
      <ChevronRightIcon
        className={iconClassname}
        sx={{height: iconSize}}
        onClick={() => {
          if (generating) {
            enqueueSnackbar('Please wait for the current generation to finish.', {variant: 'error'});
            return;
          }
          if (historyLine.currentIndex < historyLine.nodes.length - 1) {
            historyLine.currentIndex += 1;
          }
          refresh();
          setLast();
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
  const { refresh } = useHistoryStore();
  const { setReGenerateFlag: setReGenerateFlag, generating } = useStatusStore();
  const [editing, setEditing] = React.useState(false);
  const [newContent, setNewContent] = React.useState("");

  const handleCopy = () => {
    enqueueSnackbar('Copied to clipboard');
    navigator.clipboard.writeText(message.content)
  }

  const reGenerateRequest = () => {
    if (generating) {
      enqueueSnackbar('Please wait for the current generation to finish.', {variant: 'error'});
      return;
    }
    historyLine.nodes.push({
      message: {
        sender: 'bot',
        content: '',
        timestamp: new Date().toLocaleTimeString()
      },
      next: null
    })
    historyLine.currentIndex = historyLine.nodes.length - 1;
    setReGenerateFlag(true);
    refresh();
  }

  const handleStartEditing = () => {
    setEditing(true);
    setNewContent(message.content);
  }

  const handleFinishEditing = () => {
    if (generating) {
      enqueueSnackbar('Please wait for the current generation to finish.', {variant: 'error'});
      return;
    }
    if (newContent === message.content) {
      setEditing(false);
      return;
    }
    setEditing(false);
    historyLine.nodes.push({
      message: {
        sender: 'user',
        content: newContent,
        timestamp: new Date().toLocaleTimeString()
      },
      next: null
    })
    historyLine.currentIndex = historyLine.nodes.length - 1;
    refresh();
  }

  const switcher = () => {
    if (historyLine.nodes.length > 1) {
      return (
        <NodeSwitcher historyLine={historyLine}/>
      )
    }
  }

  const userIcons = () => {
    if (editing) {
      return (
        <>
          <CheckIcon
            className={iconClassname}
            sx={{height: iconSize}}
            onClick={handleFinishEditing}
          />
          <CloseIcon
            className={iconClassname}
            sx={{height: iconSize}}
            onClick={() => setEditing(false)}
          />
        </>
      )
    } else {
      return <>
        {switcher()}
        <EditIcon
          className={iconClassname}
          sx={{height: iconSize}}
          onClick={handleStartEditing}
        />
      </>
    }
  }

  const botIcons = () => {
    return (
      <>
        {switcher()}
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
      </>
    )
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
      <ChatMessage message={message} editing={editing} setNewContent={setNewContent}/>
      <div className={"flex mb-1 justify-between"}>
        {
          hover ? (
            <div className='relative'>
              <div className='absolute top-0 w-10 flex'>
                { message.sender === 'bot' ? botIcons() : null }
                { message.sender === 'user' ? userIcons() : null }
              </div>
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
