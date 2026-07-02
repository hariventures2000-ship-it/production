"use client";

import React, { useState, useRef, useEffect } from "react";
import { aiService } from "@/lib/services/ai.service";
import { useAppStore } from "@/store/app.store";
import { useAuthStore } from "@/store/auth.store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AssistantPage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const user = useAuthStore(s => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0 && user) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hello ${user.firstName}, I'm your Mervi AI Assistant. I have context on your current project. How can I help you today? You can ask me about project status, pending approvals, or find specific documents.`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [messages.length, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedProjectId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiService.query(input);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What is the current status of the project?",
    "Are there any invoices I need to pay?",
    "Summarize the latest document uploaded.",
    "What's blocking the next milestone?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      <div className="shrink-0 mb-6">
        <PageHeader
          title="AI Assistant"
          description="Ask questions about your project context, documents, and status."
          icon={Bot}
        />
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-primary/20">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' ? "bg-[var(--background-tertiary)] text-[var(--foreground)]" : "bg-primary text-white"
              )}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              
              <div className={cn(
                "rounded-2xl px-5 py-3.5 text-sm",
                msg.role === 'user' ? "bg-primary text-white" : "bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)]"
              )}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[var(--card-bg)] prose-pre:border prose-pre:border-[var(--border)] prose-a:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
                <span className={cn(
                  "text-[9px] block mt-2",
                  msg.role === 'user' ? "text-primary-100" : "text-[var(--foreground-muted)]"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-[var(--background-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-2xl px-5 py-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-[var(--foreground-muted)]">Analyzing project data...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs font-medium text-[var(--foreground-muted)] mb-2 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Suggested queries</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} className="text-xs bg-[var(--background-tertiary)] hover:bg-[var(--border)] border border-[var(--border)] rounded-full px-3 py-1.5 text-[var(--foreground-secondary)] transition-colors text-left cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-[var(--card-bg)] border-t border-[var(--border)]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the project..."
              disabled={loading}
              className="w-full h-12 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-full pl-5 pr-12 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || loading} className="absolute right-1.5 h-9 w-9 rounded-full">
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-[var(--foreground-muted)]">AI can make mistakes. Verify important project information.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
