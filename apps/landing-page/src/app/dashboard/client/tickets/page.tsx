"use client";

import React, { useState, useEffect } from "react";
import { get, post } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button
} from "@hariventure/ui";
import { Ticket, Plus, MessageSquare, AlertCircle } from "lucide-react";

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Center</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your support tickets and requests.</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          {showNewForm ? 'Cancel' : <><Plus className="h-4 w-4"/> New Ticket</>}
        </Button>
      </div>

      {showNewForm && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg">Open New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" required 
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={newTicket.subject} 
                  onChange={e => setNewTicket({...newTicket, subject: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required rows={4}
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={newTicket.description} 
                  onChange={e => setNewTicket({...newTicket, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={newTicket.priority} 
                  onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <Ticket className="h-12 w-12 text-slate-300 mb-4" />
              <p>You have no open support tickets.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tickets.map(ticket => (
                <div key={ticket._id} className="p-6 hover:bg-slate-50 transition-colors flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-medium text-blue-600">{ticket.ticketNumber}</span>
                      <h3 className="font-semibold text-slate-900">{ticket.subject}</h3>
                      <Badge variant={ticket.status === 'CLOSED' || ticket.status === 'RESOLVED' ? 'secondary' : 'info'}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      {ticket.priority === 'URGENT' && <Badge variant="destructive">URGENT</Badge>}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {ticket.assignedTo && <span>• Assigned</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
