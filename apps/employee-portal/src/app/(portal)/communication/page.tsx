// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Chat/Communication Workspace Page
// Complete chat interface with dynamic message sending and right details panel (Mentions, Pinned, Files)
// ═══════════════════════════════════════════════════════════════════

"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Users, Hash, Search, Plus, Phone, Video, 
  MoreVertical, Paperclip, Send, Pin, AtSign, FileText, Download, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const CHANNELS = [
  { id: 1, name: "general", type: "public", unread: 0 },
  { id: 2, name: "engineering", type: "public", unread: 0 },
  { id: 3, name: "design-team", type: "private", unread: 2 },
];

const DIRECT_MESSAGES = [
  { id: 1, name: "Arjun M.", avatar: "https://i.pravatar.cc/150?u=emp-002", status: "online", unread: 1 },
  { id: 2, name: "Priya K.", avatar: "https://i.pravatar.cc/150?u=emp-003", status: "offline", unread: 0 },
  { id: 3, name: "Sarah L.", avatar: "https://i.pravatar.cc/150?u=emp-004", status: "busy", unread: 0 },
];

const INITIAL_MESSAGES = [
  { id: "m1", author: "Arjun M.", avatar: "https://i.pravatar.cc/150?u=emp-002", initials: "AM", time: "10:42 AM", text: "I just pushed the fix for the CSRF issue on Firefox. Can someone review PR #248?" },
  { id: "m2", author: "Vijay S.", avatar: "https://i.pravatar.cc/150?u=emp-001", initials: "VS", time: "10:45 AM", text: "Nice work Arjun. I will check it in a few minutes after my sync." },
  { id: "m3", author: "Priya K.", avatar: "https://i.pravatar.cc/150?u=emp-003", initials: "PK", time: "10:46 AM", text: "I looked at the code changes, LGTM! Let's get it merged." }
];

const MOCK_MENTIONS = [
  { id: "men-1", author: "Vijay S.", text: "@Sneha Patil please verify if the Kafka partitioning issue affects deployment.", date: "Yesterday" },
  { id: "men-2", author: "Arjun M.", text: "Awesome layout design @Sneha Patil!", date: "2d ago" }
];

const MOCK_PINNED = [
  { id: "pin-1", text: "Sprint 18 Deliverables Matrix spreadsheet", author: "Vijay S.", date: "Jul 05" },
  { id: "pin-2", text: "Production Release SOP documentation wiki page", author: "Arjun M.", date: "Jul 02" }
];

const MOCK_FILES = [
  { id: "file-1", name: "Architecture-v2.pdf", size: "3.4 MB", type: "PDF" },
  { id: "file-2", name: "Pen-Test-Report.json", size: "840 KB", type: "JSON" }
];

export default function CommunicationPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      author: "Sneha Patil",
      avatar: "https://i.pravatar.cc/150?u=emp-042",
      initials: "SP",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      text: inputText
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    
    // Auto simulated reply from lead after 1.5 seconds
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          author: "Vijay S.",
          avatar: "https://i.pravatar.cc/150?u=emp-001",
          initials: "VS",
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          text: "Received! Let me know if there are any blocking issues."
        }
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] -mt-2 -mx-2 lg:-mx-6 flex border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-sm text-xs">
      
      {/* Sidebar Channel / DM Navigation */}
      <div className="w-60 border-r border-[var(--border)] flex flex-col bg-[var(--background-secondary)] shrink-0 hidden md:flex">
        <div className="p-3 border-b border-[var(--border)]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
            <Input 
              placeholder="Search..." 
              className="pl-8 h-9 bg-[var(--background)] border-[var(--border)] text-xs"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          <div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2 px-2">
              <span>Channels</span>
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-[var(--foreground)]" onClick={() => toast.info("Creating channels requires Slack/Teams admin access.")} />
            </div>
            <div className="space-y-0.5">
              {CHANNELS.map(channel => (
                <button 
                  key={channel.id}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer",
                    channel.name === "engineering" ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-semibold" : "text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 opacity-70" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-[var(--color-primary)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
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
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-[var(--foreground)]" onClick={() => toast.info("Start new conversation dialog.")} />
            </div>
            <div className="space-y-0.5">
              {DIRECT_MESSAGES.map(dm => (
                <button 
                  key={dm.id}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer"
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
                    <span className="bg-[var(--color-primary)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
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
        <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 bg-[var(--card-bg)]">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--foreground-muted)]" />
            <h2 className="font-bold text-sm text-[var(--foreground)]">engineering</h2>
            <span className="text-xs text-[var(--foreground-muted)] ml-2 border-l border-[var(--border)] pl-2">
              12 members
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon-sm" onClick={() => toast.info("Calling sync stream integration...")}><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => toast.info("Starting visual video channel...")}><Video className="w-4 h-4" /></Button>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className={cn(showDetails && "bg-[var(--background-secondary)] text-[var(--foreground)]")} 
              onClick={() => setShowDetails(!showDetails)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          <div className="text-center my-4">
            <span className="text-[9px] font-semibold text-[var(--foreground-muted)] bg-[var(--background-secondary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
              Today
            </span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                <AvatarImage src={msg.avatar} />
                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-bold">{msg.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[var(--foreground)] text-xs">{msg.author}</span>
                  <span className="text-[9px] text-[var(--foreground-muted)]">{msg.time}</span>
                </div>
                <p className="text-xs text-[var(--foreground-secondary)] mt-1.5 leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="p-3 border-t border-[var(--border)] shrink-0 bg-[var(--card-bg)]">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => toast.info("Attach documents/images dialogue.")}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input 
              placeholder="Message #engineering..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 text-xs"
            />
            <Button size="sm" className="h-9 shrink-0" onClick={handleSendMessage}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Info Details Panel (Mentions, Pinned, Shared Files) */}
      {showDetails && (
        <div className="w-72 border-l border-[var(--border)] bg-[var(--background-secondary)]/30 flex flex-col shrink-0">
          <div className="h-14 border-b border-[var(--border)] px-4 flex items-center justify-between bg-[var(--background-secondary)]/50 shrink-0">
            <h3 className="font-bold text-xs text-[var(--foreground)]">Details & Assets</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => setShowDetails(false)} className="rounded-full h-7 w-7 text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="mentions" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 border-b border-[var(--border)] shrink-0 bg-[var(--background-secondary)]/10">
              <TabsList className="flex gap-2 justify-start h-9 bg-transparent p-0 border-b-0">
                <TabsTrigger value="mentions" className="tab-trigger h-9 border-b-2 border-transparent px-1 text-[10px] font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Mentions</TabsTrigger>
                <TabsTrigger value="pinned" className="tab-trigger h-9 border-b-2 border-transparent px-1 text-[10px] font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Pinned</TabsTrigger>
                <TabsTrigger value="files" className="tab-trigger h-9 border-b-2 border-transparent px-1 text-[10px] font-semibold data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]">Files</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              
              {/* MENTIONS TAB */}
              <TabsContent value="mentions" className="space-y-3 m-0 focus:outline-none">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1">
                  <AtSign className="w-3.5 h-3.5" /> Direct Mentions
                </h4>
                {MOCK_MENTIONS.map((men) => (
                  <div key={men.id} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-[var(--foreground-muted)]">
                      <span className="font-bold text-[var(--foreground-secondary)]">{men.author}</span>
                      <span>{men.date}</span>
                    </div>
                    <p className="text-[11px] text-[var(--foreground-secondary)] leading-relaxed">{men.text}</p>
                  </div>
                ))}
              </TabsContent>

              {/* PINNED TAB */}
              <TabsContent value="pinned" className="space-y-3 m-0 focus:outline-none">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5" /> Pinned Messages
                </h4>
                {MOCK_PINNED.map((pin) => (
                  <div key={pin.id} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs space-y-1.5">
                    <p className="text-[11px] text-[var(--foreground-secondary)] leading-relaxed font-semibold">{pin.text}</p>
                    <div className="flex justify-between items-center text-[9px] text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]/50">
                      <span>By {pin.author}</span>
                      <span>{pin.date}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* FILES TAB */}
              <TabsContent value="files" className="space-y-3 m-0 focus:outline-none">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Shared Documents
                </h4>
                {MOCK_FILES.map((file) => (
                  <div key={file.id} className="p-3 border border-[var(--border)] rounded-xl bg-[var(--card-bg)] shadow-xs flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[11px] text-[var(--foreground)] truncate">{file.name}</p>
                      <p className="text-[9px] text-[var(--foreground-muted)] mt-0.5">Type: {file.type} · Size: {file.size}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="h-7 w-7 text-[var(--foreground-muted)] hover:text-[var(--color-primary)] shrink-0"
                      onClick={() => toast.success(`Downloading ${file.name}...`)}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

            </div>
          </Tabs>
        </div>
      )}

    </div>
  );
}
