"use client";

import { ChatWindow } from '../../components/pages/dashboard/chat/ChatWindow';
import { LeftSideBar } from '../../components/pages/dashboard/chat/LeftSideBar';
import { chats as initialChats, UserChat } from '../../data/chat';
import { useState } from 'react';

export const Chat = () => {
  const [chats, setChats] = useState<UserChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat: UserChat = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  const handleSendMessage = (msg: any) => {
    if (!activeChat) return;

    const newMessage = {
      id: Date.now(),
      isAi: false,
      timestamp: new Date().toISOString(),
      ...msg,
    };

    let newTitle = activeChat.title;
    if (activeChat.messages.length === 0 && msg.text) {
      const raw = msg.text.trim();
      const meaningful = raw.replace(/^(hi|hello|hey)[.!]?/i, '').trim();
      const finalTitle = meaningful.length > 0 ? meaningful : raw;
      newTitle = finalTitle.split(' ').slice(0, 6).join(' ');
    }

    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id
        ? {
            ...chat,
            title: newTitle,
            messages: [...chat.messages, newMessage],
          }
        : chat
    );
    setChats(updatedChats);

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        isAi: true,
        text: `You said: ${msg.text}`,
        timestamp: new Date().toISOString(),
      };
      const updatedChatsWithAI = updatedChats.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, messages: [...chat.messages, aiReply] }
          : chat
      );
      setChats(updatedChatsWithAI);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      <LeftSideBar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onNewChat={handleNewChat}
      />
      {activeChat && (
        <ChatWindow messages={activeChat.messages} onSend={handleSendMessage} />
      )}
    </div>
  );
};

export default Chat;