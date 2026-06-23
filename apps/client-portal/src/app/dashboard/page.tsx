"use client";

import React, { useState, useEffect } from "react";
import { get } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  ChevronDown, 
  Download,
  AlertCircle
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
          setSelectedProjectId(data[0].id); // check id since backend returns standard string id
        }
      } catch (err: any) {
        console.error("Failed to fetch projects", err);
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
      if (res?.url) {
        // Direct download
        const fullUrl = res.url.startsWith('http') ? res.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${res.url}`;
        window.open(fullUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to download document", err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Console Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, {user?.firstName}. Keep track of your live operations.
          </p>
        </div>
        
        {projects.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-400">Select Project:</label>
            <div className="relative">
              <select 
                className="appearance-none bg-slate-950 border border-slate-800 text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-64 p-3 pr-10 outline-none transition-all cursor-pointer font-medium"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {!selectedProjectId ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
          <FolderKanban className="h-14 w-14 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No active projects</h3>
          <p className="text-sm text-slate-400 mt-1">You currently do not have any active projects linked to your account.</p>
        </div>
      ) : isDetailsLoading ? (
        <div className="p-12 text-center text-slate-400 animate-pulse">Fetching project details...</div>
      ) : projectDetails ? (
        <>
          {/* Project Overview Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">Current Phase</span>
                <FolderKanban className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="text-xl font-extrabold text-white truncate">{projectDetails.currentPhase}</div>
              <p className="text-[10px] text-indigo-400 mt-2 uppercase font-extrabold tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded w-fit">
                {projectDetails.status.replace('_', ' ')}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">Overall Progress</span>
                <span className="text-sm font-extrabold text-indigo-400">%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-extrabold text-white">{projectDetails.completionPercentage || 0}%</div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex-1">
                  <div className="h-full bg-gradient-to-r from-mervi-cyan to-mervi-blue rounded-full transition-all duration-1000" style={{ width: `${projectDetails.completionPercentage || 0}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">Target Completion</span>
                <Clock className="h-5 w-5 text-mervi-cyan" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {new Date(projectDetails.estimatedEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">Milestones Completed</span>
                <CheckCircle2 className="h-5 w-5 text-mervi-teal" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {milestones.filter(m => m.status === 'COMPLETED').length} <span className="text-base text-slate-500 font-normal">/ {milestones.length}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Updates & Documents */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Project Updates Feed */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-extrabold text-white text-base">Project Updates</h3>
                </div>
                <div className="p-0">
                  {updates.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No updates posted yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-850">
                      {updates.map(update => (
                        <div key={update.id} className="p-6 hover:bg-slate-850/30 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white text-sm">{update.title}</h4>
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded font-medium border border-slate-800">
                              {update.createdAt ? new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{update.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-mervi-cyan" />
                  <h3 className="font-extrabold text-white text-base">Approved Documents</h3>
                </div>
                {documents.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">No documents available.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950/30 transition-all group bg-slate-900">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-medium">{doc.type} • {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownload(doc.id)} 
                          className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Milestone Timeline */}
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-mervi-teal" />
                  <h3 className="font-extrabold text-white text-base">Milestone Timeline</h3>
                </div>
                {milestones.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">No milestones defined.</div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:-translate-x-px before:w-0.5 before:bg-slate-800">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="relative flex gap-4 items-start">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border bg-slate-950 shrink-0 z-10 ${
                          milestone.status === 'COMPLETED' 
                            ? 'border-emerald-500 text-emerald-400' 
                            : milestone.status === 'IN_PROGRESS' 
                              ? 'border-amber-500 text-amber-400' 
                              : 'border-slate-800 text-slate-600'
                        }`}>
                          {milestone.status === 'COMPLETED' && <CheckCircle2 className="h-3.5 w-3.5" />}
                          {milestone.status === 'IN_PROGRESS' && <Clock className="h-3.5 w-3.5" />}
                          {milestone.status === 'PENDING' && <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />}
                        </div>
                        <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 flex-1">
                          <h4 className="font-bold text-white text-xs mb-1">{milestone.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{milestone.description}</p>
                          <div className="text-[10px] text-slate-500 flex flex-col gap-0.5">
                            <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                            {milestone.status === 'COMPLETED' && milestone.completedDate && (
                              <span className="text-emerald-500 font-semibold">Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
