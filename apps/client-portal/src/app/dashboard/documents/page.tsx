"use client";

import React, { useState, useEffect } from "react";
import { get } from "@/lib/api-client";
import { FileText, Search, Download, Filter } from "lucide-react";

export default function ClientDocumentsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const projs = await get<any[]>('/client-portal/projects');
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to init documents page", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchDocs = async () => {
      try {
        setIsLoading(true);
        let url = `/client-portal/projects/${selectedProjectId}/documents`;
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedType) params.append('type', selectedType);
        
        if (params.toString()) {
          url += '?' + params.toString();
        }
        
        const data = await get<any[]>(url);
        // Backend filtering representation (if mock seeder returned unfiltered data, we can also filter client-side just in case)
        let filtered = data;
        if (searchQuery) {
          filtered = filtered.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedType) {
          filtered = filtered.filter(d => d.type === selectedType);
        }
        setDocuments(filtered);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchDocs();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [selectedProjectId, searchQuery, selectedType]);

  const handleDownload = async (docId: string) => {
    try {
      const res = await get<{url: string, name: string}>(`/client-portal/projects/${selectedProjectId}/documents/${docId}/download`);
      if (res?.url) {
        const fullUrl = res.url.startsWith('http') ? res.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${res.url}`;
        window.open(fullUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to download document", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Document Center</h1>
          <p className="text-sm text-slate-400 mt-1">Access and download approved project files.</p>
        </div>
        
        {projects.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-md">
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-350 focus:ring-0 cursor-pointer outline-none px-2"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search documents by name..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white outline-none placeholder-slate-650 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
          <select 
            className="w-full pl-11 pr-8 py-3 appearance-none bg-slate-900 border border-slate-800 rounded-xl shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-300 outline-none cursor-pointer text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="" className="bg-slate-900 text-white">All Document Types</option>
            <option value="CONTRACT" className="bg-slate-900 text-white">Contracts</option>
            <option value="PROPOSAL" className="bg-slate-900 text-white">Proposals</option>
            <option value="REPORT" className="bg-slate-900 text-white">Reports</option>
            <option value="DESIGN" className="bg-slate-900 text-white">Designs</option>
            <option value="INVOICE" className="bg-slate-900 text-white">Invoices</option>
            <option value="SPECIFICATION" className="bg-slate-900 text-white">Specifications</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
        {!selectedProjectId ? (
          <div className="p-12 text-center text-slate-500">No project selected.</div>
        ) : isLoading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Searching documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-slate-500">
            <FileText className="h-12 w-12 text-slate-700 mb-4" />
            <p className="text-sm font-semibold">No documents found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-850">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-5 hover:bg-slate-850/20 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">{doc.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="inline-block bg-slate-950 border border-slate-800 text-slate-400 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">{doc.type}</span>
                      <span>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownload(doc.id)} 
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-indigo-400 hover:text-white border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-bold text-xs"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
