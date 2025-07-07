"use client";

import { ChatWindow } from '../../components/pages/dashboard/chat/ChatWindow';
import { LeftSideBar } from '../../components/pages/dashboard/chat/LeftSideBar';
import { chats as initialChats, UserChat } from '../../data/chat';
import { useState } from 'react';
// import { fetchFlightOffers } from '../../lib/api';
import { ChatMessage } from '../../lib/types';
import { fetchAiReply } from '../../lib/api';

export const Chat = () => {
  const [chats, setChats] = useState<UserChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);
  const activeChat = chats.find(c => c.id === activeChatId);

/*   const handleFlightQuery = async (origin: string, dest: string, dep: string, ret?: string) => {
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
  }; */

 const handleSendMessage = async (msg: Partial<ChatMessage>) => {
  if (!activeChat) return;

  // Add user message immediately
  const userMsg: ChatMessage = {
    id: Date.now(),
    isAi: false,
    timestamp: new Date().toISOString(),
    ...msg,
  };
  const withUserMsg = chats.map(c =>
    c.id === activeChat.id
      ? { ...c, messages: [...c.messages, userMsg] }
      : c
  );
  setChats(withUserMsg);

  try {
    // 👇 Always call AI API for ANY message
    const aiReply = await fetchAiReply(withUserMsg.find(c => c.id === activeChat.id)!.messages);

    // Add AI reply to the same chat
    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      isAi: true,
      timestamp: new Date().toISOString(),
      text: aiReply,
    };

    const updated = chats.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, userMsg, aiMsg] }
        : c
    );
    setChats(updated);

  } catch (err) {
    console.error('AI fetch failed:', err);
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
