import { useNotifications } from '../hooks/useNotifications';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
          <img
            src="/assets/generated/empty-notifications.dim_900x600.png"
            alt="No notifications"
            className="mb-4 h-32 w-auto opacity-50"
          />
          <p className="text-sm text-muted-foreground">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition-all duration-200 motion-safe:hover:shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 ${
                notification.read ? 'bg-card' : 'bg-accent/50'
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                    className="transition-all duration-200 motion-safe:hover:scale-110"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
