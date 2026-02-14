import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ConversationList from '../components/chat/ConversationList';
import ChatThread from '../components/chat/ChatThread';

export default function ChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { conversations } = useChat();

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Messages</h1>

      {!selectedThreadId ? (
        conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
            <img
              src="/assets/generated/empty-chat.dim_900x600.png"
              alt="No messages"
              className="mb-4 h-32 w-auto opacity-50"
            />
            <p className="text-sm text-muted-foreground">
              No messages yet. Start a conversation from a listing!
            </p>
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            onSelectThread={setSelectedThreadId}
          />
        )
      ) : (
        <ChatThread
          threadId={selectedThreadId}
          onBack={() => setSelectedThreadId(null)}
        />
      )}
    </div>
  );
}
