"use client";

import { ChatWindow } from '../../components/pages/dashboard/chat/ChatWindow';
import { LeftSideBar } from '../../components/pages/dashboard/chat/LeftSideBar';
import { chats as initialChats, UserChat } from '../../data/chat';
import { useState } from 'react';
import { ChatMessage } from '../../lib/types';
import { fetchAiReply } from '../../lib/api';
import { VoiceModalContainer } from '../../components/pages/dashboard/chat/VoiceModal/VoiceModalContainer';
import { Mic } from 'lucide-react';
import ThemeToggle from '../../components/mini-components/theme-toggle';

export const Chat = () => {
  const [chats, setChats] = useState<UserChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);
  const activeChat = chats.find(c => c.id === activeChatId);
   const [audioMode, setAudioMode] = useState(false);

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

    const userMsg: ChatMessage = {
      id: Date.now(),
      isAi: false,
      timestamp: new Date().toISOString(),
      ...msg,
    };

    const withUserMsg = chats.map(c =>
      c.id === activeChat.id ? { ...c, messages: [...c.messages, userMsg] } : c
    );
    setChats(withUserMsg);

    try {
      const aiReply = await fetchAiReply(withUserMsg.find(c => c.id === activeChat.id)!.messages);

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        isAi: true,
        timestamp: new Date().toISOString(),
        text: aiReply,
      };

      const updated = chats.map(c =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, aiMsg] } : c
      );
      setChats(updated);
    } catch (err) {
      console.error('AI fetch failed:', err);
    }
  };

  const handleVoiceSession = async (audioBlob: Blob) => {
  if (!activeChat) return;

  // Add placeholder user msg: "🎙️ Voice message..."
  const userMsg: ChatMessage = {
    id: Date.now(),
    isAi: false,
    timestamp: new Date().toISOString(),
    text: "🎙️ Voice message...",
  };
  setChats(prev =>
    prev.map(c =>
      c.id === activeChat.id ? { ...c, messages: [...c.messages, userMsg] } : c
    )
  );

  // Send audio to backend
  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("history", JSON.stringify(activeChat.messages)); // Send history too!

  const response = await fetch("/api/voice-session", {
    method: "POST",
    body: formData,
  });
  const { text: aiText, audio: audioBase64 } = await response.json();

  // Add real user text (from backend STT)
  const realUserMsg: ChatMessage = {
    ...userMsg,
    text: "(You said) " + aiText, // or split STT & LLM differently
  };

  // Add AI reply text
  const aiMsg: ChatMessage = {
    id: Date.now() + 1,
    isAi: true,
    timestamp: new Date().toISOString(),
    text: aiText,
  };

  setChats(prev =>
    prev.map(c =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, realUserMsg, aiMsg] }
        : c
    )
  );

  // Play TTS audio
  const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
  audio.play();
};

  return (
     <div className="flex h-screen">
      <LeftSideBar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={() => {
          const newChat: UserChat = {
            id: Date.now(),
            title: 'New Chat',
            messages: [],
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
        }}
      />

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
            <Mic />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Window */}
        {activeChat && (
          <ChatWindow
            messages={activeChat.messages}
            onSend={handleSendMessage}
          />
        )}

        {/* ✅ Voice Modal INSIDE <Chat> now */}
        <VoiceModalContainer
          isOpen={audioMode}
          onClose={() => setAudioMode(false)}
          onSend={(msg) => handleSendMessage({ text: msg })}
          onAddAiMessage={(aiText) => handleSendMessage({ text: aiText, isAi: true })}
  onVoiceSession={handleVoiceSession}
        />
      </div>
    </div>
  );
};

export default Chat;
