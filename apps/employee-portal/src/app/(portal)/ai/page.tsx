"use client";

import { useState } from "react";
import { Bot, Sparkles, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/cn";

export default function AIPage() {
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [messages] = useState([
    { role: "ai", text: "Hello! I'm the Mervi AI Assistant. How can I help you today? I can assist with finding code, checking documentation, or summarizing your tasks." },
    { role: "user", text: "What's the status of the MVP project?" },
    { role: "ai", text: "The Mervi Platform v2 (MVP) project is currently 'On Track' with 72% progress. The active sprint has 4 days remaining. There are 3 pull requests pending your review." }
  ]);

  return (
    <div className="h-[calc(100vh-100px)] -mt-2 -mx-2 lg:-mx-6 flex flex-col max-w-[1000px] mx-auto">
      <div className="flex flex-col items-center justify-center py-6 border-b border-[var(--border)]">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3 border border-amber-500/20">
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Mervi AI Assistant</h1>
        <p className="text-sm text-[var(--foreground-secondary)] mt-1">
          Your personal agent for navigating the enterprise portal.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4 max-w-2xl", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
            {msg.role === "ai" ? (
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Bot className="w-4 h-4 text-amber-500" />
              </div>
            ) : (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            )}
            <div className={cn(
              "px-4 py-3 rounded-2xl text-sm",
              msg.role === "user" ? "bg-[var(--color-primary)] text-white rounded-tr-sm" : "bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm shadow-sm"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]">
        <div className="relative max-w-2xl mx-auto">
          <Input 
            placeholder="Ask Mervi AI anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pr-12 h-12 rounded-full border-[var(--border)] shadow-sm bg-[var(--card-bg)] focus-visible:ring-amber-500"
          />
          <Button 
            size="icon-sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-[var(--foreground-muted)] mt-2">
          AI Assistant can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
