"use client";

import React, { useState, useRef, useEffect } from "react";
import { post } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button
} from "@hariventure/ui";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
}

export default function KambanAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I am Kamban, your Enterprise AI Assistant. Ask me about your projects, invoices, tickets, or meetings.'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await post<{ answer: string, sources: string[] }>('/ai-assistant/query', { query: userMsg.content });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: res.answer,
        sources: res.sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Request Failed", err);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm sorry, I encountered an error while processing your request. Please try again."
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          Kamban AI Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">Enterprise GraphRAG Intelligence. All queries are strictly scoped to your authorized data.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg border-indigo-100 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
                  
                  {/* Citations/Sources */}
                  {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs text-slate-400 mr-1">Sources:</span>
                      {msg.sources.map((source, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-medium rounded-full">
                          {source}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] gap-3 flex-row">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Kamban is thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kamban about your projects, tickets, or invoices..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading} className="h-auto px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="mt-2 text-center text-xs text-slate-400">
            Kamban uses Enterprise GraphRAG. It only retrieves data authorized for your account.
          </div>
        </div>
      </Card>
    </div>
  );
}
