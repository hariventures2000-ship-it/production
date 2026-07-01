"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { get } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Badge, Button
} from "@hariventure/ui";
import { 
  FolderKanban, Clock, CheckCircle, FileText, 
  MessageSquare, ChevronDown, Download, AlertCircle
} from "lucide-react";

export default function ClientDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await get<any[]>('/client-portal/projects');
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0]._id);
        }
      } catch (err: any) {
        // Ignore 401 errors, as the API interceptor automatically redirects to login
        if (err?.response?.status !== 401) {
          console.error("Failed to fetch projects", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchDetails = async () => {
      setIsDetailsLoading(true);
      try {
        const [projData, mileData, updData, docData] = await Promise.all([
          get<any>(`/client-portal/projects/${selectedProjectId}`),
          get<any[]>(`/client-portal/projects/${selectedProjectId}/milestones`),
          get<any[]>(`/client-portal/projects/${selectedProjectId}/updates`),
          get<any[]>(`/client-portal/projects/${selectedProjectId}/documents`),
        ]);
        setProjectDetails(projData);
        setMilestones(mileData);
        setUpdates(updData);
        setDocuments(docData);
      } catch (err) {
        console.error("Failed to fetch project details", err);
      } finally {
        setIsDetailsLoading(false);
      }
    };
    fetchDetails();
  }, [selectedProjectId]);

  const handleDownload = async (docId: string) => {
    try {
      const res = await get<{url: string, name: string}>(`/client-portal/projects/${selectedProjectId}/documents/${docId}/download`);
      if (res?.url) window.open(res.url, "_blank");
    } catch (err) {
      console.error("Failed to download document", err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.firstName}.
          </p>
        </div>
        
        {projects.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Select Project:</label>
            <div className="relative">
              <select 
                className="appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-64 p-2.5 pr-8"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {!selectedProjectId ? (
        <Card className="border-dashed border-2 bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <FolderKanban className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No active projects</h3>
            <p className="text-sm text-slate-500 mt-1">You currently do not have any active projects.</p>
          </CardContent>
        </Card>
      ) : isDetailsLoading ? (
        <div className="p-12 text-center text-slate-500 animate-pulse">Fetching project details...</div>
      ) : projectDetails ? (
        <>
          {/* Project Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">Current Phase</CardTitle>
                <FolderKanban className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{projectDetails.currentPhase}</div>
                <p className="text-xs text-slate-500 mt-1 uppercase font-medium">{projectDetails.status.replace('_', ' ')}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">Overall Progress</CardTitle>
                <div className="h-4 w-4 text-green-600 font-bold">%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-slate-900">{projectDetails.completionPercentage || 0}%</div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${projectDetails.completionPercentage || 0}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">Target Completion</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {new Date(projectDetails.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">Milestones Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {milestones.filter(m => m.status === 'COMPLETED').length} <span className="text-lg text-slate-500 font-normal">/ {milestones.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Updates & Documents */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Project Updates Feed */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <CardTitle>Project Updates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {updates.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No updates posted yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {updates.map(update => (
                        <div key={update._id} className="p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{update.title}</h4>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              {new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{update.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <CardTitle>Approved Documents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {documents.length === 0 ? (
                    <div className="text-center text-slate-500 py-4">No documents available.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {documents.map(doc => (
                        <div key={doc._id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group bg-white">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                              <p className="text-xs text-slate-500 uppercase">{doc.type} • {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(doc._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Milestone Timeline */}
            <div className="space-y-8">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <CardTitle>Milestone Timeline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {milestones.length === 0 ? (
                    <div className="text-center text-slate-500 py-4">No milestones defined.</div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      {milestones.map((milestone, idx) => (
                        <div key={milestone._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${milestone.status === 'COMPLETED' ? 'border-emerald-500 text-emerald-500' : milestone.status === 'IN_PROGRESS' ? 'border-amber-500 text-amber-500' : 'border-slate-300 text-slate-300'}`}>
                            {milestone.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                            {milestone.status === 'IN_PROGRESS' && <Clock className="h-3 w-3" />}
                            {milestone.status === 'PENDING' && <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                          </div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm">{milestone.title}</h4>
                            </div>
                            <div className="text-xs text-slate-500 flex flex-col gap-1">
                              <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                              {milestone.status === 'COMPLETED' && milestone.completedDate && (
                                <span className="text-emerald-600 font-medium">Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                              )}
                              <Badge variant={milestone.status === 'COMPLETED' ? 'success' : milestone.status === 'IN_PROGRESS' ? 'warning' : 'secondary'} className="w-fit mt-1 text-[10px]">
                                {milestone.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
