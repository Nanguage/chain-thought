import React from 'react';
import './index.css'; // 确保引入了 Tailwind CSS
import { ChatWindow } from './components/ChatWindow';


const App: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-stretch md:items-center justify-center">
      <div id="chatbackground" className="bg-white w-full h-full md:max-w-xl md:h-[800px] rounded-lg shadow-md p-4 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
};


export default App;
