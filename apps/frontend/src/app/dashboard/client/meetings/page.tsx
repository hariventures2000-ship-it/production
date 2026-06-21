"use client";

import React, { useState, useEffect } from "react";
import { get, post, del } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button
} from "@hariventure/ui";
import { Video, Calendar, Plus, ExternalLink, X } from "lucide-react";

export default function ClientMeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ purpose: '', requestedDate: '', provider: 'GOOGLE_MEET' });

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await get<any[]>('/meetings');
      setMeetings(data);
    } catch (err) {
      console.error("Failed to fetch meetings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post('/meetings', newMeeting);
      setShowNewForm(false);
      setNewMeeting({ purpose: '', requestedDate: '', provider: 'GOOGLE_MEET' });
      fetchMeetings();
    } catch (err) {
      console.error("Failed to request meeting", err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await del(`/meetings/${id}`);
      fetchMeetings();
    } catch (err) {
      console.error("Failed to cancel meeting", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meeting Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Schedule and manage meetings with the Hariventure team.</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
          {showNewForm ? 'Cancel' : <><Plus className="h-4 w-4"/> Request Meeting</>}
        </Button>
      </div>

      {showNewForm && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="text-lg">Request New Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Meeting</label>
                <input 
                  type="text" required 
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={newMeeting.purpose} 
                  onChange={e => setNewMeeting({...newMeeting, purpose: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Requested Date & Time</label>
                  <input 
                    type="datetime-local" required 
                    className="w-full p-2 border border-slate-300 rounded-md"
                    value={newMeeting.requestedDate} 
                    onChange={e => setNewMeeting({...newMeeting, requestedDate: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Platform</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-md"
                    value={newMeeting.provider} 
                    onChange={e => setNewMeeting({...newMeeting, provider: e.target.value})}
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom</option>
                    <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <Video className="h-12 w-12 text-slate-300 mb-4" />
              <p>You have no meeting requests.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {meetings.map(meeting => (
                <div key={meeting._id} className="p-6 hover:bg-slate-50 transition-colors flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium text-purple-600">{meeting.meetingId}</span>
                      <h3 className="font-semibold text-slate-900">{meeting.purpose}</h3>
                      <Badge variant={meeting.status === 'APPROVED' ? 'success' : meeting.status === 'PENDING' ? 'warning' : 'secondary'}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(meeting.requestedDate).toLocaleString()}</span>
                      <span className="flex items-center gap-1.5"><Video className="h-4 w-4" /> {meeting.provider.replace('_', ' ')}</span>
                    </div>
                    {meeting.notes && (
                      <p className="mt-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-md">Note: {meeting.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {meeting.status === 'APPROVED' && meeting.meetingLink && (
                      <Button variant="outline" size="sm" onClick={() => window.open(meeting.meetingLink, '_blank')} className="text-purple-600 border-purple-200 hover:bg-purple-50">
                        <ExternalLink className="h-4 w-4 mr-2" /> Join
                      </Button>
                    )}
                    {meeting.status === 'PENDING' && (
                      <Button variant="ghost" size="icon" onClick={() => handleCancel(meeting._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
