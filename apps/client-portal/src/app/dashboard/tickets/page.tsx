"use client";

import React, { useState, useEffect } from "react";
import { get, post } from "@/lib/api-client";
import { Ticket, Plus, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

export default function ClientTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'MEDIUM' });

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await get<any[]>('/tickets');
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post('/tickets', newTicket);
      setShowNewForm(false);
      setNewTicket({ subject: '', description: '', priority: 'MEDIUM' });
      fetchTickets();
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Support Console</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track your support tickets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchTickets}
            className="p-3 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowNewForm(!showNewForm)} 
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            {showNewForm ? 'Cancel' : <><Plus className="h-4.5 w-4.5"/> Open New Ticket</>}
          </button>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <h3 className="text-base font-extrabold text-white mb-4">Open New Support Ticket</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="ticket-subject" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Subject</label>
              <input 
                id="ticket-subject"
                type="text" 
                required 
                className="w-full p-3 bg-slate-950/60 border border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm placeholder-slate-700"
                value={newTicket.subject} 
                onChange={e => setNewTicket({...newTicket, subject: e.target.value})} 
                placeholder="Brief summary of the issue"
              />
            </div>
            <div>
              <label htmlFor="ticket-desc" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Description</label>
              <textarea 
                id="ticket-desc"
                required 
                rows={4}
                className="w-full p-3 bg-slate-950/60 border border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm placeholder-slate-750"
                value={newTicket.description} 
                onChange={e => setNewTicket({...newTicket, description: e.target.value})} 
                placeholder="Please describe details of the issue..."
              />
            </div>
            <div>
              <label htmlFor="ticket-priority" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Priority</label>
              <select 
                id="ticket-priority"
                className="w-full p-3 bg-slate-950/60 border border-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm cursor-pointer"
                value={newTicket.priority} 
                onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
              >
                <option value="LOW" className="bg-slate-900">Low</option>
                <option value="MEDIUM" className="bg-slate-900">Medium</option>
                <option value="HIGH" className="bg-slate-900">High</option>
                <option value="URGENT" className="bg-slate-900">Urgent</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-slate-500">
            <Ticket className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-sm font-semibold">You have no open support tickets.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-850">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-6 hover:bg-slate-850/10 transition-colors flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{ticket.ticketNumber}</span>
                    <h3 className="font-bold text-white text-sm">{ticket.subject}</h3>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide ${
                      ticket.status === 'CLOSED' || ticket.status === 'RESOLVED' 
                        ? 'bg-slate-950 text-slate-400 border border-slate-800' 
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-550/10'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    {ticket.priority === 'URGENT' && (
                      <span className="bg-red-500/10 text-red-400 border border-red-550/10 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{ticket.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500 font-semibold">
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {ticket.assignedTo && <span>• Assigned to Agent</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
