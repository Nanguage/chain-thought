import React from 'react';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChatWindow } from './components/ChatWindow';


const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#0000ff',
    },
  },
});


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen bg-gray-100 flex items-stretch md:items-center justify-center md:p-10">
        <div id="chatbackground" className="bg-white w-full h-full md:max-w-[800px] rounded-lg shadow-md p-4 flex flex-col">
          <ChatWindow />
        </div>
      </div>
    </ThemeProvider>
  );
};


export default App;
