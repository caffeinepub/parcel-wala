import { Conversation } from '../../hooks/useChat';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { MessageCircle } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectThread: (threadId: string) => void;
}

export default function ConversationList({ conversations, onSelectThread }: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className="cursor-pointer transition-colors hover:bg-accent"
          onClick={() => onSelectThread(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{conversation.otherUserName}</span>
                  {conversation.unread > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {conversation.lastMessage}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
