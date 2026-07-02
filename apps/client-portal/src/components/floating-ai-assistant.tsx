"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { useAssistantStore } from "@/store/assistant.store";
import { aiService } from "@/lib/services/ai.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/app.store";
import ReactMarkdown from "react-markdown";

export function FloatingAIAssistant() {
  const { isOpen, setIsOpen, messages, addMessage } = useAssistantStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);

  const quickSuggestions = [
    "Summarize my project",
    "Show pending approvals",
    "Explain latest invoice",
    "Upcoming milestones",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const responseMsg = await aiService.query(text);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseMsg.answer,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-8 right-8 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className={`fixed bottom-8 right-8 z-[100] flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl origin-bottom-right transition-all duration-300 ease-in-out ${isMinimized ? 'h-[56px] w-[320px]' : 'h-[600px] max-h-[85vh] w-[calc(100vw-32px)] sm:w-[420px]'}`}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 cursor-pointer shrink-0"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] leading-tight">MERVI Assistant</h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" /> Active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 shrink-0 border border-[var(--border)]">
                        <AvatarFallback className={msg.role === 'user' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-primary/10 text-primary font-semibold text-[10px]'}>
                          {msg.role === 'user' ? 'ME' : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-[var(--radius-lg)] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[var(--foreground)] text-[var(--background)] rounded-tr-sm' : 'bg-[var(--card-bg)] text-[var(--foreground)] rounded-tl-sm border border-[var(--border)]'}`}>
                          <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                            <ReactMarkdown>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <span className="text-[10px] text-[var(--foreground-muted)] px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0 border border-[var(--border)]">
                        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-[var(--card-bg)] shadow-sm border border-[var(--border)] rounded-[var(--radius-lg)] rounded-tl-sm px-4 py-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs text-[var(--foreground-secondary)]">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2 bg-[var(--background)]">
                    {quickSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => handleSend(suggestion)}
                        disabled={loading}
                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:border-[var(--input-border)] hover:text-[var(--foreground)] transition-colors text-left shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3 border-t border-[var(--border)] bg-[var(--card-bg)]">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything about your project..."
                      className="flex-1 h-10 rounded-full border border-[var(--input-border)] bg-[var(--input-bg)] px-4 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                      disabled={loading}
                    />
                    <Button 
                      type="submit" 
                      size="icon-sm" 
                      disabled={!input.trim() || loading}
                      className="absolute right-1.5 h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
