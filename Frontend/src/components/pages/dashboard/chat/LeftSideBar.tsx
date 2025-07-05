import { useState } from 'react';
import { Settings, Search, MessageSquare, X, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SettingsDrawer } from '../settings/SettingsDrawer';

interface Chat {
  id: number;
  title: string;
}

interface LeftSideBarProps {
  chats: Chat[];
  activeChatId: number;
  onSelectChat: (id: number) => void;
   onNewChat: () => void;
}

export const LeftSideBar = ({ chats, activeChatId, onSelectChat, onNewChat }: LeftSideBarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
   
    navigate('/signin'); 
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Toggle button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200
        w-64 md:w-1/4 flex flex-col p-4 bg-gray-50 dark:bg-dark border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Header */}
        <button className="w-full flex items-center justify-between p-2 mb-4 text-sm font-semibold rounded-lg text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700">
          <span>ByteBound AI</span>
          <MessageSquare size={16} />
        </button>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg outline-none"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center mb-4 p-2 text-sm font-semibold rounded-lg bg-primary dark:bg-green text-white hover:opacity-90"
        >
          + New Chat
        </button>

        {/* Chats list - This should not take up all available space */}
        <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
          <p className="text-xs font-bold text-gray-400 uppercase">Recent</p>
          {filteredChats.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              {chats.length === 0 ? 'No chats yet' : 'No matching chats'}
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-2 rounded-lg cursor-pointer truncate ${
                  chat.id === activeChatId
                    ? 'bg-primary dark:bg-green text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <p className="text-sm truncate">{chat.title}</p>
              </div>
            ))
          )}
        </div>

        {/* User/Profile Section */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary dark:bg-green flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="text-sm font-semibold">User Name</span>
          </div>
         <button
        onClick={() => setIsSettingsOpen(true)}
        className="p-2 rounded-full text-primary hover:bg-secondary transition bg-light dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <Settings size={16} />
      </button>

        </div>

        {/* Logout Button - This should be visible now */}
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 p-3 text-sm font-semibold bg-transparent text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
        <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </aside>
    </>
  );
};