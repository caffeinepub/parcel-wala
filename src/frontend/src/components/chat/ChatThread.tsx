import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ChatThreadProps {
  threadId: string;
  onBack: () => void;
}

export default function ChatThread({ threadId, onBack }: ChatThreadProps) {
  const { identity } = useInternetIdentity();
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const threadMessages = messages[threadId] || [];
  const myPrincipal = identity?.getPrincipal().toString();

  const handleSend = () => {
    if (!newMessage.trim() || !myPrincipal) return;
    sendMessage(threadId, newMessage, myPrincipal);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Conversation</h2>
      </div>

      <ScrollArea className="flex-1 rounded-lg border border-border bg-muted/50 p-4">
        <div className="space-y-4">
          {threadMessages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          ) : (
            threadMessages.map((message) => {
              const isMe = message.senderId === myPrincipal;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-card-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="mt-1 block text-xs opacity-70">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
