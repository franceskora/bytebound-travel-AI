import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Mic } from "lucide-react";
import ThemeToggle from "../../components/mini-components/theme-toggle";
import { VoiceModalContainer } from "../../components/pages/dashboard/chat/VoiceModal/VoiceModalContainer";


export const Dashboard = () => {

  const [audioMode, setAudioMode] = useState(false);

  const handleVoiceMessage = (msg: string) => {
    console.log("Voice message:", msg);
    // TODO: Add to chat thread here
  };


  return (
    <div className="flex h-screen">

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary dark:bg-green-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="font-medium text-sm">You</span>
          </div>

          <div className="flex items-center gap-4">
 <button
              onClick={() => setAudioMode(!audioMode)}
              title="Switch to Voice Conversation"
              className={`p-2 rounded-full text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700 ${
                audioMode ? "bg-green" : ""
              }`}
            >
              <Mic size={18} />
            </button>


            <ThemeToggle />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {/* Child routes render here */}
          <Outlet />
        </main>
      </div>
      <VoiceModalContainer
        isOpen={audioMode}
        onClose={() => setAudioMode(false)}
        onSend={handleVoiceMessage}
      />

    </div>
  );
};

export default Dashboard;