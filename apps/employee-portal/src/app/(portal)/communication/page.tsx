"use client";

import { useState } from "react";
import { MessageSquare, Users, Hash, Search, Plus, Phone, Video, MoreVertical, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

const CHANNELS = [
  { id: 1, name: "general", type: "public", unread: 0 },
  { id: 2, name: "engineering", type: "public", unread: 5 },
  { id: 3, name: "design-team", type: "private", unread: 2 },
];

const DIRECT_MESSAGES = [
  { id: 1, name: "Arjun M.", avatar: "https://i.pravatar.cc/150?u=emp-002", status: "online", unread: 1 },
  { id: 2, name: "Priya K.", avatar: "https://i.pravatar.cc/150?u=emp-003", status: "offline", unread: 0 },
  { id: 3, name: "Sarah L.", avatar: "https://i.pravatar.cc/150?u=emp-004", status: "busy", unread: 0 },
];

export default function CommunicationPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="h-[calc(100vh-100px)] -mt-2 -mx-2 lg:-mx-6 flex border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] flex flex-col bg-[var(--background-secondary)] shrink-0 hidden md:flex">
        <div className="p-3 border-b border-[var(--border)]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search..." 
              className="pl-8 h-9 bg-[var(--background)] border-[var(--border)]"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2 px-2">
              <span>Channels</span>
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-[var(--foreground)]" />
            </div>
            <div className="space-y-0.5">
              {CHANNELS.map(channel => (
                <button 
                  key={channel.id}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                    channel.name === "engineering" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-medium" : "text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {channel.type === "private" ? <Hash className="w-4 h-4 opacity-70" /> : <Hash className="w-4 h-4 opacity-70" />}
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2 px-2">
              <span>Direct Messages</span>
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-[var(--foreground)]" />
            </div>
            <div className="space-y-0.5">
              {DIRECT_MESSAGES.map(dm => (
                <button 
                  key={dm.id}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={dm.avatar} />
                        <AvatarFallback className="text-[8px]">{dm.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--background-secondary)]",
                        dm.status === "online" ? "bg-emerald-500" :
                        dm.status === "busy" ? "bg-red-500" : "bg-gray-400"
                      )} />
                    </div>
                    <span>{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--card-bg)]">
        {/* Chat Header */}
        <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--foreground-muted)]" />
            <h2 className="font-bold text-[var(--foreground)]">engineering</h2>
            <span className="text-xs text-[var(--foreground-muted)] ml-2 border-l border-[var(--border)] pl-2">
              12 members
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm"><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon-sm"><Video className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon-sm"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="text-center my-4">
            <span className="text-[10px] font-medium text-[var(--foreground-muted)] bg-[var(--background-secondary)] px-2 py-1 rounded-full">
              Today
            </span>
          </div>
          
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src="https://i.pravatar.cc/150?u=emp-002" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[var(--foreground)] text-sm">Arjun M.</span>
                <span className="text-[10px] text-[var(--foreground-muted)]">10:42 AM</span>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">
                I just pushed the fix for the CSRF issue on Firefox. Can someone review PR #248?
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src="https://i.pravatar.cc/150?u=emp-001" />
              <AvatarFallback>VS</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[var(--foreground)] text-sm">Vijay S.</span>
                <span className="text-[10px] text-[var(--foreground-muted)]">10:45 AM</span>
              </div>
              <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">
                Looking at it now. Looks good, merging in 5 mins.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background-secondary)]">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-sm focus-within:border-[var(--color-primary)] transition-colors p-2">
            <Input 
              placeholder="Message #engineering..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-none shadow-none focus-visible:ring-0 px-2 text-sm h-auto py-1.5"
            />
            <div className="flex items-center justify-between mt-2 px-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-[var(--foreground-muted)]"><Plus className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-[var(--foreground-muted)]"><Paperclip className="w-4 h-4" /></Button>
              </div>
              <Button size="icon-sm" className="h-7 w-7" disabled={!message.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
