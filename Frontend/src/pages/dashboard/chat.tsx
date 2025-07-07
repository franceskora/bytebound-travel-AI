"use client";

import { ChatWindow } from '../../components/pages/dashboard/chat/ChatWindow';
import { LeftSideBar } from '../../components/pages/dashboard/chat/LeftSideBar';
import { chats as initialChats, UserChat } from '../../data/chat';
import { useState } from 'react';
import { fetchFlightOffers } from '../../lib/api';
import { ChatMessage } from '../../lib/types';

export const Chat = () => {
  const [chats, setChats] = useState<UserChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);
  const activeChat = chats.find(c => c.id === activeChatId);

  const handleFlightQuery = async (origin: string, dest: string, dep: string, ret?: string) => {
    if (!activeChat) return;
    try {
      const offers = await fetchFlightOffers(origin, dest, dep, ret);
      const offer = offers[0];
      const cardMsg: ChatMessage = {
        id: Date.now(),
        isAi: true,
        timestamp: new Date().toISOString(),
        cardType: 'flight',
        cardData: offer,
      };
      const updated = chats.map(c =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, cardMsg] }
          : c
      );
      setChats(updated);
    } catch (err) {
      console.error("Flight fetch failed", err);
    }
  };

  const handleSendMessage = (msg: Partial<ChatMessage>) => {
    if (!activeChat) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      isAi: false,
      timestamp: new Date().toISOString(),
      ...msg,
    };
    const updated = chats.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg] }
        : c
    );
    setChats(updated);

    // Optional simulated AI response
    if (msg.text?.toLowerCase().includes('flight')) {
      const [_, origin, destination] = msg.text.match(/flight from (\w+) to (\w+)/i) || [];
      if (origin && destination) setTimeout(() => handleFlightQuery(origin, destination, '2025-07-15'), 500);
    }
  };

  const handleNewChat = () => {
    const newChat: UserChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  return (
    <div className="flex h-screen">
      <LeftSideBar
        chats={chats} activeChatId={activeChatId}
        onSelectChat={setActiveChatId} onNewChat={handleNewChat}
      />
      {activeChat && (
        <ChatWindow messages={activeChat.messages} onSend={handleSendMessage} />
      )}
    </div>
  );
};

export default Chat;
