import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  otherUserName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export function useChat() {
  const [conversations] = useLocalStorage<Conversation[]>('chat-conversations', []);
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>('chat-messages', {});

  const sendMessage = (threadId: string, text: string, senderId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev?.[threadId] || []), newMessage],
    }));
  };

  return {
    conversations: conversations || [],
    messages: messages || {},
    sendMessage,
  };
}
