"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification.store";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, FolderKanban, FileText, CheckSquare, CreditCard, MessageSquare } from "lucide-react";
import { cn } from "@/lib/cn";

export default function NotificationsPage() {
  const router = useRouter();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const archive = useNotificationStore((s) => s.archive);

  const activeNotifications = notifications.filter(n => !n.archived).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_UPDATE': return <FolderKanban className="h-4 w-4" />;
      case 'DOCUMENT_UPLOADED': return <FileText className="h-4 w-4" />;
      case 'APPROVAL_REQUIRED': return <CheckSquare className="h-4 w-4 text-warning" />;
      case 'INVOICE_GENERATED': return <CreditCard className="h-4 w-4 text-info" />;
      case 'PAYMENT_RECEIVED': return <CreditCard className="h-4 w-4 text-success" />;
      case 'TICKET_UPDATE': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleAction = (n: any) => {
    markAsRead(n.id);
    if (n.actionUrl) router.push(n.actionUrl);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Notifications"
          description="Updates on your projects, documents, and billing."
          icon={Bell}
        />
        {activeNotifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      <Card>
        <div className="divide-y divide-[var(--border)]">
          {activeNotifications.map((n) => (
            <div key={n.id} className={cn("p-4 sm:p-5 flex gap-4 transition-colors group", !n.read ? "bg-primary/5" : "hover:bg-[var(--background-secondary)]")}>
              <div className="h-10 w-10 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className={cn("text-sm", !n.read ? "font-semibold text-[var(--foreground)]" : "font-medium text-[var(--foreground-secondary)]")}>{n.title}</p>
                  <span className="text-[10px] text-[var(--foreground-muted)] whitespace-nowrap ml-4">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={cn("text-xs mt-1", !n.read ? "text-[var(--foreground-secondary)]" : "text-[var(--foreground-muted)]")}>{n.message}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  {n.actionUrl && (
                    <Button size="sm" variant={!n.read ? "default" : "secondary"} className="h-7 text-xs px-3" onClick={() => handleAction(n)}>
                      View Details
                    </Button>
                  )}
                  {!n.read && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => markAsRead(n.id)}>
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon-sm" onClick={() => archive(n.id)} title="Archive">
                  <Trash2 className="h-4 w-4 text-[var(--foreground-muted)] hover:text-danger" />
                </Button>
              </div>
            </div>
          ))}
          {activeNotifications.length === 0 && (
            <div className="p-16 text-center">
              <Bell className="h-10 w-10 text-[var(--foreground-muted)] mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium text-[var(--foreground)]">You're all caught up!</p>
              <p className="text-xs text-[var(--foreground-secondary)] mt-1">There are no new notifications.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
