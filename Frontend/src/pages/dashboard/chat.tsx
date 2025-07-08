"use client";

import { ChatWindow } from '../../components/pages/dashboard/chat/ChatWindow';
import { LeftSideBar } from '../../components/pages/dashboard/chat/LeftSideBar';
import { chats as initialChats, UserChat } from '../../data/chat';
import { useState } from 'react';
import { ChatMessage } from '../../lib/types';

// --- CHANGE #1: Import the correct API function ---
import { getOrchestratorResponse } from '../../lib/api';

export const Chat = () => {
  const [chats, setChats] = useState<UserChat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(initialChats[0].id);
  const activeChat = chats.find(c => c.id === activeChatId);

  // --- CHANGE #2: Replace the entire 'handleSendMessage' function ---
  const handleSendMessage = async (msg: Partial<ChatMessage>) => {
    if (!activeChat || !msg.text) return;

    // Add user's message to the UI immediately
    const userMsg: ChatMessage = {
      id: Date.now(),
      isAi: false,
      timestamp: new Date().toISOString(),
      ...msg,
    };

    setChats(currentChats =>
      currentChats.map(c =>
        c.id === activeChat.id
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );

    // Call the backend AI orchestrator
    try {
      // NOTE: Using a placeholder 'travelers' array.
      // In a real app, you'd get this from your user's profile or a form.
      const mockTraveler = {
        id: "1",
        dateOfBirth: "1990-01-01",
        name: { firstName: "John", lastName: "Doe" },
        gender: "MALE",
        contact: {
          emailAddress: "john.doe@example.com",
          phones: [{ deviceType: "MOBILE", countryCallingCode: "1", number: "5551234567" }]
        }
      };

      const orchestratorResponse = await getOrchestratorResponse(msg.text, [mockTraveler]);

      // Create a new AI message to hold the response card
      const aiCardMsg: ChatMessage = {
        id: Date.now() + 1,
        isAi: true,
        timestamp: new Date().toISOString(),
        text: orchestratorResponse.message || "Here is your itinerary:",
        cardType: 'itinerary', // Use a generic 'itinerary' card type
        cardData: orchestratorResponse.bookingConfirmation, // The full booking data
      };

      // Add the AI's card response to the chat
      setChats(currentChats =>
        currentChats.map(c =>
          c.id === activeChat.id
            ? { ...c, messages: [...c.messages, aiCardMsg] }
            : c
        )
      );

    } catch (error) {
        console.error("Orchestrator failed:", error);
        // Add a user-friendly error message to the chat
        const errorMsg: ChatMessage = {
            id: Date.now() + 1,
            isAi: true,
            timestamp: new Date().toISOString(),
            text: `I'm sorry, I couldn't process that request. The server returned an error.`,
        };
        setChats(currentChats =>
            currentChats.map(c =>
                c.id === activeChat.id
                    ? { ...c, messages: [...c.messages, errorMsg] }
                    : c
            )
        );
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