"use client";

import React, { useState, useRef, useEffect } from "react";
import { post } from "@/lib/api-client";
import { Bot, Send, User, Sparkles, FileText } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  sources?: string[];
}

export default function ClientAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Hello! I am your Mervi AI Assistant. How can I help you check on your active projects, deliverables, milestones, or billing details today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    setInput("");

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      content: userMessageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await post<{ answer: string, sources: string[] }>('/ai-assistant/query', { query: userMessageText });
      
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        content: res.answer,
        timestamp: new Date(),
        sources: res.sources,
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI assistant query failed", err);
      
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        content: "Sorry, I am having trouble connecting to the services right now. Please try again in a few moments.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Assistant Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              Mervi AI Copilot <Sparkles className="w-3.5 h-3.5 text-mervi-cyan animate-pulse" />
            </h3>
            <span className="text-[10px] text-mervi-teal font-bold uppercase tracking-wider block">Agent Active</span>
          </div>
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/45">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border text-xs font-bold ${
              msg.sender === "user" 
                ? "bg-slate-800 border-slate-700 text-mervi-cyan" 
                : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400"
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className="max-w-[70%] space-y-2">
              <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                msg.sender === "user" 
                  ? "bg-indigo-600 border-indigo-550 text-white rounded-tr-none" 
                  : "bg-slate-900 border-slate-800 text-slate-300 rounded-tl-none"
              }`}>
                {msg.content}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 pl-1">
                  {msg.sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-lg text-[9px] font-semibold text-slate-400">
                      <FileText className="w-3 h-3 text-slate-500" />
                      {src}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border bg-indigo-600/10 border-indigo-500/20 text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[70%] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Panel */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/60 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask a question about your project, milestones or invoices..." 
          className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 placeholder-slate-700 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
